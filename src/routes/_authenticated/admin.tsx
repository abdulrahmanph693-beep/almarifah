import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  statusClass,
  statusLabel,
  submissionCategories,
  type Submission,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/lib/submissions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Editor desk — Almarifah" },
      {
        name: "description",
        content:
          "Review, edit, approve, publish or return submissions sent to Almarifah by contributors.",
      },
      { property: "og:title", content: "Editor desk — Almarifah" },
      { property: "og:description", content: "Editorial review and publishing controls." },
    ],
  }),
  component: AdminDesk,
});

const emptyDraft = {
  title: "",
  subtitle: "",
  kind: "essay" as SubmissionKind,
  category: "Literature",
  excerpt: "",
  body: "",
  cover_image: "",
};

type EditState = {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  cover_image: string;
};

function AdminDesk() {
  const { isAdmin, loading, session } = useAuth();
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState<EditState | null>(null);

  async function createOwnWork(publishNow: boolean) {
    const userId = session?.user.id;
    if (!userId) return;
    if (!draft.title.trim() || !draft.body.trim()) {
      toast.error("Add a title and the full text first.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("submissions")
      .insert({ ...draft, author_id: userId, status: "pending" as const })
      .select("id")
      .single();
    if (error || !data) {
      setBusy(false);
      toast.error("Could not save this work.");
      return;
    }
    if (publishNow) {
      const { error: pubError } = await supabase
        .from("submissions")
        .update({ status: "published" as const, published_at: new Date().toISOString() })
        .eq("id", data.id);
      if (pubError) {
        setBusy(false);
        toast.error("Saved as a draft, but publishing failed.");
        queryClient.invalidateQueries({ queryKey: ["all-submissions"] });
        return;
      }
    }
    setBusy(false);
    setDraft(emptyDraft);
    toast.success(publishNow ? "Published to the site." : "Saved as pending.");
    queryClient.invalidateQueries({ queryKey: ["all-submissions"] });
  }

  const worksQuery = useQuery({
    queryKey: ["all-submissions"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });

  const authorsQuery = useQuery({
    queryKey: ["all-profiles"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email");
      if (error) throw error;
      return data ?? [];
    },
  });

  const authorName = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of authorsQuery.data ?? []) map.set(p.id, p.full_name || p.email);
    return map;
  }, [authorsQuery.data]);

  const works = worksQuery.data ?? [];
  const byStatus = (s: SubmissionStatus) => works.filter((w) => w.status === s);

  async function setStatus(work: Submission, status: SubmissionStatus) {
    const patch = {
      status,
      review_note: note,
      ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
      ...(edit && openId === work.id ? edit : {}),
    };
    const { error } = await supabase.from("submissions").update(patch).eq("id", work.id);
    if (error) {
      toast.error("Could not update this work.");
      return;
    }
    toast.success(`Marked as ${statusLabel[status].toLowerCase()}.`);
    setOpenId(null);
    setEdit(null);
    setNote("");
    queryClient.invalidateQueries({ queryKey: ["all-submissions"] });
  }

  if (loading) return <p className="p-12 text-sm text-muted-foreground">Loading…</p>;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-serif text-3xl">Editors only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is reserved for the editorial team.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-md border border-border px-4 py-2 text-sm"
        >
          Back to your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Editorial</span>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Editor desk</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Read, edit, approve, publish or return every work sent to Almarifah.
      </p>

      <Tabs defaultValue="pending" className="mt-10">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="pending">Pending ({byStatus("pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({byStatus("approved").length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({byStatus("published").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">Returned ({byStatus("rejected").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-8">
          <div className="rule-accent mb-6">
            <h2 className="font-serif text-2xl">Write your own work</h2>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createOwnWork(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="admin-title">Title</Label>
                <Input
                  id="admin-title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="admin-subtitle">Subtitle</Label>
                <Input
                  id="admin-subtitle"
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={draft.kind}
                  onValueChange={(v) => setDraft({ ...draft, kind: v as SubmissionKind })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essay">Essay / article</SelectItem>
                    <SelectItem value="poem">Poem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {submissionCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-excerpt">Short summary</Label>
              <Textarea
                id="admin-excerpt"
                rows={2}
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-body">Full text</Label>
              <Textarea
                id="admin-body"
                rows={14}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Working…" : "Publish now"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => createOwnWork(false)}
              >
                Save as draft
              </Button>
            </div>
          </form>
        </TabsContent>

        {(["pending", "approved", "published", "rejected"] as const).map((status) => (
          <TabsContent key={status} value={status} className="mt-8 space-y-5">
            {byStatus(status).length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing here right now.</p>
            )}
            {byStatus(status).map((work) => (
              <article key={work.id} className="rounded-md border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl leading-snug">{work.title}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {authorName.get(work.author_id) ?? "Unknown author"} ·{" "}
                      {work.kind === "poem" ? "Poem" : "Essay"} · {work.category}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] ${statusClass[work.status]}`}
                  >
                    {statusLabel[work.status]}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const next = openId === work.id ? null : work.id;
                    setOpenId(next);
                    setNote(next ? work.review_note : "");
                    setEdit(
                      next
                        ? {
                            title: work.title,
                            subtitle: work.subtitle,
                            body: work.body,
                          }
                        : null,
                    );
                  }}
                >
                  {openId === work.id ? "Close" : "Review"}
                </Button>

                {openId === work.id && edit && (
                  <div className="mt-5 space-y-4 border-t border-border pt-5">
                    <div className="space-y-2">
                      <Label htmlFor={`t-${work.id}`}>Title</Label>
                      <Input
                        id={`t-${work.id}`}
                        value={edit.title}
                        onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`s-${work.id}`}>Subtitle</Label>
                      <Input
                        id={`s-${work.id}`}
                        value={edit.subtitle}
                        onChange={(e) => setEdit({ ...edit, subtitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`b-${work.id}`}>Full text</Label>
                      <Textarea
                        id={`b-${work.id}`}
                        rows={14}
                        value={edit.body}
                        onChange={(e) => setEdit({ ...edit, body: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`n-${work.id}`}>Note to the author</Label>
                      <Textarea
                        id={`n-${work.id}`}
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setStatus(work, "approved")}>
                        Save & approve
                      </Button>
                      <Button variant="secondary" onClick={() => setStatus(work, "published")}>
                        Publish
                      </Button>
                      <Button variant="outline" onClick={() => setStatus(work, "pending")}>
                        Keep pending
                      </Button>
                      <Button variant="destructive" onClick={() => setStatus(work, "rejected")}>
                        Return to author
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
