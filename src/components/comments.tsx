import { useState } from "react";
import { Flag, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

type Comment = {
  id: number;
  name: string;
  date: string;
  body: string;
  likes: number;
  flagged?: boolean;
};

const seed: Comment[] = [
  {
    id: 1,
    name: "Hana Idris",
    date: "3 days ago",
    body: "The third pass you describe is exactly what I lost during years of skimming. I've started rereading one essay a week and the difference is real.",
    likes: 12,
  },
  {
    id: 2,
    name: "Daniel Okoye",
    date: "1 day ago",
    body: "I'd push back gently: some difficulty is just poor editing wearing a scholar's coat. The distinction matters.",
    likes: 7,
  },
];

export function Comments() {
  const [comments, setComments] = useState(seed);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="comments-heading" className="flex items-center gap-2 font-serif text-2xl">
        <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
        Discussion ({comments.length})
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Comments are moderated. Disagreement is welcome; contempt is not.
      </p>

      <form
        className="mt-6 space-y-3 rounded-md border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !body.trim()) return;
          setComments((c) => [
            ...c,
            { id: Date.now(), name: name.trim(), date: "Just now", body: body.trim(), likes: 0 },
          ]);
          setName("");
          setBody("");
          toast.success("Comment submitted", { description: "It will appear after moderation." });
        }}
      >
        <div>
          <label htmlFor="comment-name" className="text-xs font-medium uppercase tracking-[0.12em]">
            Name
          </label>
          <input
            id="comment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="comment-body" className="text-xs font-medium uppercase tracking-[0.12em]">
            Comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Post comment
        </button>
      </form>

      <ul className="mt-8 space-y-6">
        {comments.map((c) => (
          <li key={c.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 font-serif text-sm text-accent"
              >
                {c.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() =>
                  setComments((list) =>
                    list.map((x) => (x.id === c.id ? { ...x, likes: x.likes + 1 } : x)),
                  )
                }
                className="inline-flex items-center gap-1.5 hover:text-accent"
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden /> {c.likes}
              </button>
              <button
                type="button"
                onClick={() => toast("Reported to moderators", { description: "Thank you." })}
                className="inline-flex items-center gap-1.5 hover:text-destructive"
              >
                <Flag className="h-3.5 w-3.5" aria-hidden /> Report
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
