import { createFileRoute } from "@tanstack/react-router";
import { authors } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Almarifah" },
      {
        name: "description",
        content:
          "Almarifah is the English edition of Ainul-Haqq: an editorial home for essays, poetry and criticism written for unhurried readers.",
      },
      { property: "og:title", content: "About Us — Almarifah" },
      {
        property: "og:description",
        content: "The editorial mission behind Almarifah, the English edition of Ainul-Haqq.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
        Almarifah — The Knowledge
      </h1>

      <div className="prose-reading mt-10">
        <p className="dropcap">
          Almarifah is the English edition of Ainul-Haqq. It exists for a kind of reading that is
          becoming rare: unhurried, argumentative, willing to sit with a paragraph until it gives
          something up.
        </p>
        <p>
          We publish essays and long-form analysis, poetry and translation, and studies in Seerah
          and Tawheed. Our subjects are philosophy, literature, culture, history and language —
          but the through-line is method rather than topic. We would rather publish one careful piece
          than five quick ones.
        </p>
        <blockquote>
          Certainty is usually a symptom of having stopped too early.
        </blockquote>
        <h2>What we look for</h2>
        <ul>
          <li>Arguments that survive their own strongest objection.</li>
          <li>Prose that earns its length.</li>
          <li>Poetry that trusts silence as much as sound.</li>
          <li>Criticism written by someone who loves the form they are examining.</li>
        </ul>
        <h2>Our relationship to Ainul-Haqq</h2>
        <p>
          Ainul-Haqq is our Arabic parent publication. Almarifah is not a mirror of it: some pieces
          are translated in both directions, others are written for this edition alone. The two share
          an editorial conscience rather than a table of contents.
        </p>
      </div>

      <section aria-labelledby="team-heading" className="mt-16">
        <div className="rule-accent mb-8">
          <h2 id="team-heading" className="font-serif text-2xl">
            The Editors
          </h2>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {authors.map((a) => (
            <li key={a.slug} className="rounded-md border border-border bg-card p-5">
              <span
                aria-hidden
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-serif text-accent"
              >
                {a.initials}
              </span>
              <h3 className="mt-3 font-serif text-lg">{a.name}</h3>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{a.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.bio}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
