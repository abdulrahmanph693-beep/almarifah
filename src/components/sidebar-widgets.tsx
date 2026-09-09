import { Link } from "@tanstack/react-router";
import { authors, popularPosts, type Author, type Post } from "@/lib/content";

export function MostRead({ posts = popularPosts }: { posts?: Post[] | undefined }) {
  return (
    <section aria-labelledby="most-read-heading">
      <h2 id="most-read-heading" className="eyebrow">
        Most Read
      </h2>
      <ol className="mt-4 space-y-4">
        {posts.slice(0, 5).map((post, i) => (
          <li key={post.slug} className="flex gap-3">
            <span className="font-serif text-2xl leading-none text-border">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <Link
                to="/article/$slug"
                params={{ slug: post.slug }}
                className="font-serif text-base leading-snug hover:text-accent"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">{post.readTime} min read</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AuthorSpotlight({ contributors = authors }: { contributors?: Author[] }) {
  return (
    <section aria-labelledby="contributors-heading">
      <h2 id="contributors-heading" className="eyebrow">
        Contributors
      </h2>
      <ul className="mt-4 space-y-4">
        {contributors.map((a) => (
          <li key={a.name} className="flex gap-3 rounded-md border border-border bg-card p-3">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-sm text-accent"
            >
              {a.initials}
            </span>
            <div>
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
