import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — Alma'rifa" },
      {
        name: "description",
        content: "Set a new password for your Alma'rifa account.",
      },
      { property: "og:title", content: "Choose a new password — Alma'rifa" },
      { property: "og:url", content: "/reset-password" },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recovery links arrive with type=recovery in the URL hash; Supabase
    // exchanges it for a session automatically. Wait for that session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && !invalid)) {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      } else {
        // Give the hash exchange a moment before declaring the link invalid.
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: retry }) => {
            if (!retry.session) setInvalid(true);
          });
        }, 2500);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [invalid]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("The two passwords don't match — type them again.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated — you're signed in.");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the password. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (invalid) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl">Link expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This password reset link is invalid or has expired. Request a fresh one from the
          sign-in page.
        </p>
        <Button asChild className="mt-6 w-fit">
          <Link to="/auth">Back to sign in</Link>
        </Button>
      </section>
    );
  }

  if (!ready) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 sm:px-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
        <p className="mt-3 text-sm text-muted-foreground">Verifying your reset link…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl">Choose a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter a new password for your account. Use at least 6 characters.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Repeat new password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            minLength={6}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            disabled={busy}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {busy ? "Updating password…" : "Set new password"}
        </Button>
      </form>
    </section>
  );
}
