import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, PenLine } from "lucide-react";
import { toast } from "sonner";
import { sections } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Submissions — Alma'rifa" },
      {
        name: "description",
        content:
          "Pitch an essay, submit poetry or fiction, or write to the Alma'rifa editors. Submission guidelines and response times.",
      },
      { property: "og:title", content: "Contact & Submissions — Alma'rifa" },
      { property: "og:description", content: "Pitch an essay or submit poetry to Alma'rifa." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <span className="eyebrow">Contact</span>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Contact & Submissions</h1>
        <div className="prose-reading mt-8">
          <p>
            We read everything that arrives, and we reply to everything we read — usually within
            three weeks. Send finished work rather than proposals for poetry and fiction; for essays,
            a clear pitch of 200–300 words is enough to begin.
          </p>
          <h2>Guidelines</h2>
          <ul>
            <li>Essays: 1,500–6,000 words. Argument first, sources cited.</li>
            <li>Poetry: up to five poems in a single file.</li>
            <li>Fiction: one story, up to 5,000 words.</li>
            <li>Reviews: query first with the book and your angle.</li>
          </ul>
        </div>
        <div className="mt-8 space-y-3 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-accent" aria-hidden /> editors@almarifa.example
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <PenLine className="h-4 w-4 text-accent" aria-hidden /> submissions@almarifa.example
          </p>
        </div>
      </div>

      <form
        className="space-y-4 rounded-md border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          toast.success("Message sent", { description: "The editors will be in touch." });
        }}
      >
        <h2 className="font-serif text-2xl">Write to the editors</h2>

        <div>
          <label htmlFor="c-name" className="text-xs font-medium uppercase tracking-[0.12em]">
            Name
          </label>
          <input
            id="c-name"
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="c-email" className="text-xs font-medium uppercase tracking-[0.12em]">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="c-type" className="text-xs font-medium uppercase tracking-[0.12em]">
            Submission type
          </label>
          <select
            id="c-type"
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option>General enquiry</option>
            {sections.map((s) => (
              <option key={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="c-message" className="text-xs font-medium uppercase tracking-[0.12em]">
            Message
          </label>
          <textarea
            id="c-message"
            rows={6}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Send message
        </button>

        {sent && (
          <p className="text-xs text-muted-foreground" role="status">
            Thank you — your message is with the editors.
          </p>
        )}
      </form>
    </div>
  );
}
