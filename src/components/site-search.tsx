import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { posts, sectionLabel } from "@/lib/content";
import { publishedWorksOptions, worksToPosts } from "@/lib/works";

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: workRows } = useQuery(publishedWorksOptions);
  const pool = useMemo(() => {
    const workPosts = worksToPosts(workRows);
    return workPosts.length > 0 ? workPosts : posts;
  }, [workRows]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return pool
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [pool, query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="site-search" className="sr-only">
        Search Almarifah
      </label>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          id="site-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search essays, poetry, ideas…"
          className={`bg-transparent text-sm outline-none placeholder:text-muted-foreground ${
            compact ? "w-full" : "w-44 focus:w-64 transition-[width] duration-300 lg:w-56"
          }`}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="site-search-results"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div
          id="site-search-results"
          className="absolute right-0 z-50 mt-2 w-[min(24rem,90vw)] overflow-hidden rounded-md border border-border bg-popover shadow-xl"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No matches for “{query}”.
            </p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/article/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block border-b border-border px-4 py-3 last:border-0 hover:bg-secondary"
                  >
                    <span className="eyebrow">{sectionLabel(p.section)}</span>
                    <span className="mt-1 block font-serif text-sm leading-snug">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
