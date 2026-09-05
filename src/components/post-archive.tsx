import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { categories, type Post } from "@/lib/content";

const PAGE = 6;

export function PostArchive({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState<string>("All");
  const [tag, setTag] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) => (category === "All" || p.category === category) && (!tag || p.tags.includes(tag)),
      ),
    [posts, category, tag],
  );

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setVisible(PAGE);
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
              category === c
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filter by tag">
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === t}
            onClick={() => {
              setTag(tag === t ? null : t);
              setVisible(PAGE);
            }}
            className={`text-xs transition-colors ${
              tag === t ? "text-accent underline" : "text-muted-foreground hover:text-accent"
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground" aria-live="polite">
        Showing {shown.length} of {filtered.length} pieces
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 font-serif text-lg text-muted-foreground">
          Nothing here yet under this filter.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-md border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
