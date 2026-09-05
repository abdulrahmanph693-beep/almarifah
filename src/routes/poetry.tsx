import { createFileRoute, Link } from "@tanstack/react-router";
import { authorBySlug, formatDate, postsBySection } from "@/lib/content";

export const Route = createFileRoute("/poetry")({
  head: () => ({
    meta: [
      { title: "Poetry — Alma'rifa" },
      {
        name: "description",
        content:
          "Verse, translation and the music of language: the Alma'rifa Poetry Corner, formatted to preserve every line break and stanza.",
      },
      { property: "og:title", content: "Poetry — Alma'rifa" },
      { property: "og:description", content: "Verse, translation and the music of language." },
      { property: "og:url", content: "/poetry" },
    ],
    links: [{ rel: "canonical", href: "/poetry" }],
  }),
  component: PoetryPage,
});

function PoetryPage() {
  const poems = postsBySection("poetry");

  return (
    <div className="ambient-poetry">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <span className="eyebrow">Poetry Corner</span>
        <h1 className="mt-3 font-serif text-4xl sm:text-6xl">Poetry</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Poems are set the way they were written — stanza breaks, caesuras and silences intact.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-20 px-4 pb-24 sm:px-6">
        {poems.map((poem) => (
          <article key={poem.slug} className="text-center">
            <h2 className="font-serif text-3xl">
              <Link to="/article/$slug" params={{ slug: poem.slug }} className="hover:text-accent">
                {poem.title}
              </Link>
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {authorBySlug(poem.authorSlug).name} · {formatDate(poem.date)}
            </p>
            <p className="poem mx-auto mt-10 max-w-xl text-foreground">
              {poem.poem?.split("*")[0]?.trim()}
            </p>
            <Link
              to="/article/$slug"
              params={{ slug: poem.slug }}
              className="mt-10 inline-block text-xs uppercase tracking-[0.18em] text-accent hover:underline"
            >
              Read the full poem
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
