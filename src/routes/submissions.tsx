import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submissions — Almarifah" },
      {
        name: "description",
        content:
          "Submit an essay, poem, or story to Almarifah. Read the submission guidelines and share your work with the editors.",
      },
      { property: "og:title", content: "Submissions — Almarifah" },
      { property: "og:description", content: "Submit an essay or poem to Almarifah." },
      { property: "og:url", content: "/submissions" },
    ],
    links: [{ rel: "canonical", href: "/submissions" }],
  }),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const { session } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="eyebrow">Submissions</span>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Submissions</h1>
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
        <p>
          Every submission is reviewed by the editors and, once approved, published under your name
          on the site. You can follow the status of each piece — pending, approved, or needs
          changes — from your author profile.
        </p>
      </div>

      <div className="mt-10 rounded-md border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Ready to share your work?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a free author profile, add your biography, and submit your first piece.
        </p>
        <Link
          to={session ? "/dashboard" : "/auth"}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <PenLine className="h-4 w-4" aria-hidden />
          {session ? "Go to my profile" : "Sign in to submit"}
        </Link>
      </div>
    </div>
  );
}
