import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, X, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteSearch } from "@/components/site-search";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/articles", label: "Articles & Essays" },
  { to: "/poetry", label: "Poetry" },
  { to: "/genres", label: "Seerah" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact / Submissions" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, isAdmin } = useAuth();


  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="border-b border-border/70 bg-parchment">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6">
          <a
            href="https://ainul-haqq.com"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
            rel="noopener"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden />
            العربية — Ainul-Haqq
          </a>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SiteSearch />
            </div>
            {session ? (
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                {isAdmin ? "Editor desk" : "My profile"}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-5">
          <Link to="/" className="group">
            <span className="block font-serif text-3xl leading-none tracking-tight sm:text-4xl">
              Almarifah
            </span>
            <span className="mt-1.5 block text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              A Hub for Thought, Literature, and Knowledge
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-7 border-t border-border py-3 text-[0.8rem] font-medium uppercase tracking-[0.13em]">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-accent" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="link-underline transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border md:hidden">
          <div className="px-4 py-3 sm:hidden">
            <SiteSearch compact />
          </div>
          <ul className="pb-3">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-accent" }}
                  className="block px-4 py-2.5 text-sm font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={session ? (isAdmin ? "/admin" : "/dashboard") : "/auth"}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-accent"
              >
                {session ? (isAdmin ? "Editor desk" : "My profile") : "Sign in / Create account"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
