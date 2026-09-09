import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArticleCard } from "@/components/article-card";
import { postsBySection, sections, type Section } from "@/lib/content";
import { publishedWorksOptions, worksToPosts } from "@/lib/works";

export const Route = createFileRoute("/genres")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(publishedWorksOptions);
  },
  head: () => ({
    meta: [
      { title: "Literary Genres — Almarifah" },
      {
        name: "description",
        content:
          "Short stories, reviews and perspectives: fiction and criticism from the Almarifah contributors.",
      },
      { property: "og:title", content: "Literary Genres — Almarifah" },
      { property: "og:description", content: "Short stories, reviews and perspectives." },
      { property: "og:url", content: "/genres" },
    ],
    links: [{ rel: "canonical", href: "/genres" }],
  }),
  component: GenresPage,
});

const genreIds: Section[] = ["short-stories", "reviews", "perspectives"];

function GenresPage() {
  const { data: workRows = [] } = useSuspenseQuery(publishedWorksOptions);
  const workPosts = worksToPosts(workRows);
  const worksMode = workPosts.length > 0;
  const [active, setActive] = useState<Section>("short-stories");
  const meta = sections.find((s) => s.id === active)!;
  const posts = worksMode
    ? workPosts.filter((p) => p.section !== "poetry")
    : postsBySection(active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="rule-accent mb-10 max-w-2xl">
        <span className="eyebrow">Forms</span>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Literary Genres</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Fiction, criticism and opinion — each form with its own demands on the reader.
        </p>
      </header>

      {!worksMode && (
        <>
          <div className="flex flex-wrap gap-2 border-b border-border pb-4" role="tablist">
            {genreIds.map((id) => {
              const s = sections.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active === id}
                  onClick={() => setActive(id)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                    active === id
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <p className="mt-6 font-serif text-lg text-muted-foreground">{meta.blurb}</p>
        </>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
