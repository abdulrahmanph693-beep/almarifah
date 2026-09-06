import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-parchment">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-serif text-2xl">
            Alma<span className="text-accent">'</span>rifa
          </span>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The English edition of Ainul-Haqq. A quiet place for essays, poetry, criticism and the
            slow work of thinking.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Sections</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/articles" className="hover:text-accent">
                Articles & Essays
              </Link>
            </li>
            <li>
              <Link to="/poetry" className="hover:text-accent">
                Poetry
              </Link>
            </li>
            <li>
              <Link to="/genres" className="hover:text-accent">
                Literary Genres
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">The Journal</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact & Submissions
              </Link>
            </li>
            <li>
              <a href="https://ainul-haqq.com" rel="noopener" className="hover:text-accent">
                العربية — Ainul-Haqq
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Almarifah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
