import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Copy, Facebook, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { ArticleCard } from "@/components/article-card";
import { Comments } from "@/components/comments";
import {
  authorBySlug,
  formatDate,
  postBySlug,
  relatedPosts,
  sectionLabel,
} from "@/lib/content";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — Almarifah" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const author = authorBySlug(post.authorSlug);
    return {
      meta: [
        { title: `${post.title} — Almarifah` },
        { name: "description", content: post.excerpt },
        { name: "author", content: author.name },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/article/${params.slug}` },
        { property: "article:published_time", content: post.date },
      ],
      links: [{ rel: "canonical", href: `/article/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            keywords: post.tags.join(", "),
            articleSection: sectionLabel(post.section),
            author: { "@type": "Person", name: author.name },
            publisher: { "@type": "Organization", name: "Almarifah" },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function ShareBar({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);
  const items = [
    { icon: Twitter, label: "Share on X", href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon: Facebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { icon: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { icon: MessageCircle, label: "Share on WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];

  return (
    <div className="sticky top-40 flex gap-2 lg:flex-col">
      <span className="hidden text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground lg:block">
        Share
      </span>
      {items.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        onClick={() => {
          navigator.clipboard?.writeText(url);
          toast.success("Link copied");
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <Copy className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function ArticlePage() {
  const { post } = Route.useLoaderData();
  const author = authorBySlug(post.authorSlug);
  const progress = useReadingProgress();
  const related = relatedPosts(post);
  const isPoem = post.section === "poetry";

  return (
    <div className={isPoem ? "ambient-poetry" : undefined}>
      <div
        className="fixed left-0 top-0 z-50 h-1 bg-accent transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <header className={`mx-auto max-w-3xl ${isPoem ? "text-center" : ""}`}>
          <span className="eyebrow">
            {sectionLabel(post.section)} · {post.category}
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-[1.12] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 font-serif text-xl italic leading-relaxed text-muted-foreground">
            {post.subtitle}
          </p>

          <div
            className={`mt-8 flex flex-wrap items-center gap-4 border-y border-border py-4 ${
              isPoem ? "justify-center" : ""
            }`}
          >
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-serif text-accent"
            >
              {author.initials}
            </span>
            <div className="text-sm">
              <p className="font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
                <span className="inline-flex items-center gap-1">
                  <Clock className="inline h-3 w-3" aria-hidden />
                  {post.readTime} min read
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.success(`Following ${author.name}`)}
              className="ml-auto rounded-full border border-accent px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Follow
            </button>
          </div>
        </header>

        <div className="mt-10 lg:grid lg:grid-cols-[4rem_minmax(0,1fr)] lg:gap-8">
          <div className="mb-8 lg:mb-0">
            <ShareBar title={post.title} />
          </div>

          <div className="mx-auto max-w-3xl">
            {!isPoem && (
              <img
                src={post.image}
                alt=""
                width={1200}
                height={900}
                className="mb-10 aspect-[16/9] w-full rounded-md object-cover"
              />
            )}

            <div className="prose-reading">
              {post.body.map((para, i) => (
                <p key={i} className={i === 0 && !isPoem ? "dropcap" : undefined}>
                  {para}
                </p>
              ))}
            </div>

            {post.poem && (
              <div className="my-12 space-y-14">
                {post.poem.split("\n*\n").map((stanza, i) => (
                  <p key={i} className="poem text-foreground">
                    {stanza.trim()}
                  </p>
                ))}
              </div>
            )}

            {!isPoem && (
              <blockquote className="prose-reading">
                The work is slow, and the slowness is the method.
              </blockquote>
            )}

            <ul className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  #{t}
                </li>
              ))}
            </ul>

            <section
              aria-labelledby="author-bio-heading"
              className="mt-12 flex gap-4 rounded-md border border-border bg-card p-6"
            >
              <span
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-lg text-accent"
              >
                {author.initials}
              </span>
              <div>
                <h2 id="author-bio-heading" className="font-serif text-lg">
                  {author.name}
                </h2>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {author.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>
              </div>
            </section>

            <Comments />
          </div>
        </div>
      </article>

      <section aria-labelledby="related-heading" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="rule-accent mb-8">
            <h2 id="related-heading" className="font-serif text-2xl">
              Related Reading
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
          <Link
            to="/articles"
            className="mt-8 inline-block text-xs uppercase tracking-[0.16em] text-accent hover:underline"
          >
            Back to the archive
          </Link>
        </div>
      </section>
    </div>
  );
}
