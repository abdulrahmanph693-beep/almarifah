import { createFileRoute } from "@tanstack/react-router";
import { PostArchive } from "@/components/post-archive";
import { sortedPosts } from "@/lib/content";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Articles & Essays — Almarifah" },
      {
        name: "description",
        content:
          "Long-form essays and analysis on philosophy, history, literature and culture, filtered by category and tag.",
      },
      { property: "og:title", content: "Articles & Essays — Almarifah" },
      {
        property: "og:description",
        content: "Long-form essays and analysis on philosophy, history, literature and culture.",
      },
      { property: "og:url", content: "/articles" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const posts = sortedPosts.filter((p) => p.section !== "poetry");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="rule-accent mb-10 max-w-2xl">
        <span className="eyebrow">The Archive</span>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Articles & Essays</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Arguments given the room they need. Filter by category or follow a tag through the
          archive.
        </p>
      </header>
      <PostArchive posts={posts} />
    </div>
  );
}
