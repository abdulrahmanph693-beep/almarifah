import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { authorBySlug, formatDate, type Post } from "@/lib/content";

type Props = { post: Post; variant?: "default" | "wide" | "minimal"; priority?: boolean };

export function ArticleCard({ post, variant = "default", priority = false }: Props) {
  const author = authorBySlug(post.authorSlug);

  if (variant === "minimal") {
    return (
      <article className="group border-b border-border py-5 last:border-0">
        <span className="eyebrow">{post.category}</span>
        <h3 className="mt-2 font-serif text-lg leading-snug">
          <Link
            to="/article/$slug"
            params={{ slug: post.slug }}
            className="link-underline transition-colors group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {author.name} · {post.readTime} min read
        </p>
      </article>
    );
  }

  return (
    <article
      className={`card-lift group flex overflow-hidden rounded-md border border-border bg-card ${
        variant === "wide" ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <Link
        to="/article/$slug"
        params={{ slug: post.slug }}
        className={`block overflow-hidden bg-muted ${variant === "wide" ? "sm:w-2/5" : ""}`}
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={post.image}
          alt=""
          width={1200}
          height={900}
          loading={priority ? "eager" : "lazy"}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
            variant === "wide" ? "aspect-[4/3] sm:aspect-auto" : "aspect-[16/10]"
          }`}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow">{post.category}</span>
        <h3 className="mt-2 font-serif text-xl leading-snug">
          <Link
            to="/article/$slug"
            params={{ slug: post.slug }}
            className="transition-colors group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{author.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {post.readTime} min
          </span>
        </div>
      </div>
    </article>
  );
}
