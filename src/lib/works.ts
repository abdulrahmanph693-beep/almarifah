import { queryOptions } from "@tanstack/react-query";
import manuscriptImg from "@/assets/feature-manuscript.jpg";
import libraryImg from "@/assets/feature-library.jpg";
import cityImg from "@/assets/feature-city.jpg";
import { fetchPublishedWorks, type PublishedWorkRow } from "./works.functions";
import type { Author, Post, Section } from "./content";

export const publishedWorksOptions = queryOptions({
  queryKey: ["published-works"],
  queryFn: () => fetchPublishedWorks(),
});

export function slugifyTitle(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "work"
  );
}

function fallbackImage(section: Section, category: string) {
  if (section === "poetry") return cityImg;
  if (category === "History") return libraryImg;
  return manuscriptImg;
}

/** Normalize a published submission row into the site-wide Post shape. */
export function workToPost(w: PublishedWorkRow): Post {
  const isPoem = w.kind === "poem";
  const words = w.body.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug: `${slugifyTitle(w.title)}-${w.id.slice(0, 8)}`,
    title: w.title,
    subtitle: w.subtitle,
    excerpt: w.excerpt || w.body.replace(/\s+/g, " ").slice(0, 180).trim(),
    section: isPoem ? "poetry" : "essays",
    category: w.category || "Literature",
    tags: [],
    authorSlug: "",
    date: (w.published_at ?? w.created_at).slice(0, 10),
    readTime: Math.max(1, Math.round(words / 200)),
    image: w.cover_image || fallbackImage(isPoem ? "poetry" : "essays", w.category),
    body: isPoem
      ? []
      : w.body
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean),
    poem: isPoem ? w.body : undefined,
    popularity: 0,
    authorName: w.author_name,
    authorBio: w.author_bio,
  };
}

export function worksToPosts(rows: PublishedWorkRow[] | undefined): Post[] {
  return (rows ?? []).map(workToPost);
}

/** First stanza of a poem, for list previews. Handles both "*" separators and blank lines. */
export function poemPreview(post: Post) {
  return (post.poem ?? "").split(/\n\s*\*\s*\n|\n{2,}/)[0]?.trim() ?? "";
}

/** Full stanzas of a poem for the article page. */
export function poemStanzas(post: Post): string[] {
  return (post.poem ?? "")
    .split(/\n\s*\*\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function deriveContributors(works: Post[]): Author[] {
  const seen = new Map<string, Author>();
  for (const w of works) {
    if (!w.authorName || seen.has(w.authorName)) continue;
    seen.set(w.authorName, {
      slug: "",
      name: w.authorName,
      role: "Contributor",
      bio: w.authorBio ?? "",
      initials: w.authorName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => (p[0] ?? "").toUpperCase())
        .join(""),
    });
  }
  return [...seen.values()];
}

export function relatedWorks(post: Post, works: Post[], count = 3): Post[] {
  return works
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.section === post.section ? 2 : 0) + (p.category === post.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.p);
}
