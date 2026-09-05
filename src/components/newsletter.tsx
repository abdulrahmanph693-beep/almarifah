import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-md border border-border bg-parchment p-6"
    >
      <Mail className="h-5 w-5 text-accent" aria-hidden />
      <h2 id="newsletter-heading" className="mt-3 font-serif text-xl leading-snug">
        Subscribe to Alma'rifa Insights
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        One considered letter each week: a new essay, a poem worth rereading, and notes from the
        editors.
      </p>
      <form
        className="mt-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          toast.success("You're subscribed", {
            description: "Look out for the next Alma'rifa letter.",
          });
          setEmail("");
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
