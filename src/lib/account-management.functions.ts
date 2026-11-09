import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertNotLastAdmin, assertNotSelf } from "@/lib/account-management.policy";

type AccountAction = "admin" | "disabled";

async function requireAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Only an administrator can manage accounts.");
}

export const listManagedAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const pageSize = 1000;
    const users = [] as Awaited<ReturnType<typeof supabaseAdmin.auth.admin.listUsers>> extends { data: { users: (infer U)[] } } ? U[] : never;

    for (let page = 1; page <= 100; page += 1) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: pageSize });
      if (error) throw new Error("Could not load website accounts.");
      users.push(...data.users);
      if (data.users.length < pageSize) break;
    }

    const [{ data: profiles, error: profileError }, { data: roles, error: roleError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (profileError || roleError) throw new Error("Could not load account details.");

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));
    const rolesById = new Map<string, string[]>();
    for (const role of roles ?? []) {
      const current = rolesById.get(role.user_id) ?? [];
      current.push(role.role);
      rolesById.set(role.user_id, current);
    }

    return users.map((user) => ({
      id: user.id,
      email: user.email ?? "",
      fullName: profileById.get(user.id) ?? "",
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
      emailConfirmedAt: user.email_confirmed_at ?? null,
      bannedUntil: user.banned_until ?? null,
      roles: rolesById.get(user.id) ?? [],
    }));
  });

export const updateManagedAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; action: AccountAction; enabled: boolean }) => input)
  .handler(async ({ data, context }) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.userId)) {
      throw new Error("Choose a valid account.");
    }
    await requireAdmin(context.supabase, context.userId);
    assertNotSelf(context.userId, data.userId, data.action === "admin" ? "administrator access" : "sign-in status");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.action === "admin") {
      if (data.enabled) {
        const { error } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
        if (error) throw new Error("Could not grant administrator access.");
      } else {
        const { data: admins, error: countError } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");
        if (countError) throw new Error("Could not verify administrator access.");
        assertNotLastAdmin(true, (admins ?? []).length, "removed");
        const { error } = await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", data.userId)
          .eq("role", "admin");
        if (error) throw new Error("Could not remove administrator access.");
      }
    } else {
      if (!data.enabled) {
        const { data: targetRoles, error: roleError } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", data.userId)
          .eq("role", "admin");
        if (roleError) throw new Error("Could not verify account permissions.");
        if (targetRoles?.length) {
          const { data: admins, error: countError } = await supabaseAdmin
            .from("user_roles")
            .select("user_id")
            .eq("role", "admin");
          if (countError) throw new Error("Could not verify administrator access.");
          assertNotLastAdmin(true, (admins ?? []).length, "disabled");
        }
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
        ban_duration: data.enabled ? "none" : "876000h",
      });
      if (error) throw new Error(data.enabled ? "Could not restore account sign-in." : "Could not disable account sign-in.");
    }

    return { ok: true };
  });

export const deleteManagedAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.userId)) {
      throw new Error("Choose a valid account.");
    }
    await requireAdmin(context.supabase, context.userId);
    assertNotSelf(context.userId, data.userId, "delete this account");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: targetRoles, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (roleError) throw new Error("Could not verify account permissions.");
    if (targetRoles?.length) {
      const { data: admins, error: countError } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (countError) throw new Error("Could not verify administrator access.");
      assertNotLastAdmin(true, (admins ?? []).length, "deleted");
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error("Could not delete this account.");
    return { ok: true };
  });