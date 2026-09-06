import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Newsletter } from "@/components/newsletter";
import { AuthorSpotlight, MostRead } from "@/components/sidebar-widgets";
import {
  authorBySlug,
  formatDate,
  posts,
  postsBySection,
  sortedPosts,
  sectionLabel,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almarifah — A Hub for Thought, Literature, and Knowledge" },
      {
        name: "description",
        content:
          "Essays, poetry, short stories and criticism in English. The official English edition of Ainul-Haqq.",
      },
      { property: "og:title", content: "Almarifah — Thought, Literature, and Knowledge" },
      {
        property: "og:description",
        content: "Long-form essays, poetry and criticism for slow, serious reading.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = posts.filter((p) => p.featured);
  const lead = featured[0]!;
  const rest = featured.slice(1);
  const recent = sortedPosts.slice(0, 6);
  const essays = postsBySection("essays").slice(0, 2);
  const poems = postsBySection("poetry");
  const editors = posts.filter((p) => p.editorsChoice);
  const leadAuthor = authorBySlug(lead.authorSlug);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="group">
            <h1 id="hero-heading" className="sr-only">
              Editorial picks
            </h1>
            <Link to="/article/$slug" params={{ slug: lead.slug }} className="block">
              <img
                src={lead.image}
                alt=""
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full rounded-md object-cover"
              />
            </Link>
            <div className="mt-6">
              <span className="eyebrow">
                {lead.category} · {sectionLabel(lead.section)}
              </span>
              <h2 className="mt-3 font-serif text-3xl leading-[1.15] sm:text-5xl">
                <Link
                  to="/article/$slug"
                  params={{ slug: lead.slug }}
                  className="transition-colors group-hover:text-accent"
                >
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {lead.subtitle}
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{leadAuthor.name}</span>
                <span aria-hidden>·</span>
                <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden />
                  {lead.readTime} min read
                </span>
              </p>
            </div>
          </article>

          <div className="flex flex-col gap-6 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="eyebrow">Editorial Picks</h2>
            {rest.map((post) => (
              <ArticleCard key={post.slug} post={post} variant="wide" />
            ))}
          </div>
        </div>
      </section>

      {/* Essays + sidebar */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-16">
          <section aria-labelledby="essays-heading">
            <div className="rule-accent mb-8">
              <h2 id="essays-heading" className="font-serif text-2xl">
                Featured Essays & Long-form Analysis
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {essays.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          <section aria-labelledby="recent-heading">
            <div className="rule-accent mb-8">
              <h2 id="recent-heading" className="font-serif text-2xl">
                Recent Articles
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recent.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                to="/articles"
                className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Browse all articles
              </Link>
            </div>
          </section>

          <section aria-labelledby="editors-heading">
            <div className="rule-accent mb-8">
              <h2 id="editors-heading" className="font-serif text-2xl">
                Editor's Choice & Opinion
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {editors.map((post) => (
                <article key={post.slug} className="border-t-2 border-accent pt-4">
                  <span className="eyebrow">{post.category}</span>
                  <h3 className="mt-2 font-serif text-xl leading-snug">
                    <Link
                      to="/article/$slug"
                      params={{ slug: post.slug }}
                      className="hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12 lg:border-l lg:border-border lg:pl-8">
          <MostRead />
          <AuthorSpotlight />
          <Newsletter />
        </aside>
      </div>

      {/* Poetry corner */}
      <section aria-labelledby="poetry-heading" className="ambient-poetry border-y border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <span className="eyebrow">Poetry Corner</span>
          <h2 id="poetry-heading" className="mt-3 font-serif text-3xl sm:text-4xl">
            Where the line break does the thinking
          </h2>
          <div className="mt-12 space-y-16">
            {poems.map((poem) => (
              <article key={poem.slug}>
                <p className="poem mx-auto max-w-xl text-foreground">
                  {poem.poem?.split("*")[0]?.trim()}
                </p>
                <h3 className="mt-8 font-serif text-xl">
                  <Link
                    to="/article/$slug"
                    params={{ slug: poem.slug }}
                    className="hover:text-accent"
                  >
                    {poem.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {authorBySlug(poem.authorSlug).name}
                </p>
              </article>
            ))}
          </div>
          <Link
            to="/poetry"
            className="mt-14 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Enter the Poetry Corner
          </Link>
        </div>
      </section>
    </>
  );
}
