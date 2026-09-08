import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublishedWorkRow = {
  id: string;
  title: string;
  subtitle: string;
  kind: "essay" | "poem";
  category: string;
  excerpt: string;
  body: string;
  cover_image: string;
  published_at: string | null;
  created_at: string;
  author_name: string;
  author_bio: string;
};

/**
 * Public read of published works plus the author name/bio for each.
 * Runs with the publishable key only — RLS restricts this to published
 * submissions and to profiles of authors with at least one published work.
 */
export const fetchPublishedWorks = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
  );

  const { data: subs, error } = await supabase
    .from("submissions")
    .select(
      "id, author_id, title, subtitle, kind, category, excerpt, body, cover_image, published_at, created_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !subs || subs.length === 0) return [] as PublishedWorkRow[];

  const authorIds = [...new Set(subs.map((s) => s.author_id))];
  const profiles = new Map<string, { full_name: string; bio: string }>();
  const { data: people } = await supabase
    .from("profiles")
    .select("id, full_name, bio")
    .in("id", authorIds);
  for (const p of people ?? []) {
    profiles.set(p.id, { full_name: p.full_name, bio: p.bio });
  }

  return subs.map<PublishedWorkRow>((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    kind: s.kind,
    category: s.category,
    excerpt: s.excerpt,
    body: s.body,
    cover_image: s.cover_image,
    published_at: s.published_at,
    created_at: s.created_at,
    author_name: profiles.get(s.author_id)?.full_name || "Almarifah Contributor",
    author_bio: profiles.get(s.author_id)?.bio || "",
  }));
});
