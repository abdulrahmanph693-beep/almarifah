import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your contributor profile — Almarifah" },
      {
        name: "description",
        content:
          "Manage your Almarifah contributor profile and track which of your works are pending, approved, published or need changes.",
      },
      { property: "og:title", content: "Your contributor profile — Almarifah" },
      { property: "og:description", content: "Track your submissions to Almarifah." },
    ],
  }),
  component: Dashboard,
});

const emptyDraft = {
  title: "",
  subtitle: "",
  kind: "essay" as SubmissionKind,
  category: "Literature",
  excerpt: "",
  body: "",
};

function Dashboard() {
  const { session, isAdmin } = useAuth();
  const userId = session?.user.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, bio")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const worksQuery = useQuery({
    queryKey: ["my-submissions", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("author_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.full_name ?? "");
      setBio(profileQuery.data.bio ?? "");
    }
  }, [profileQuery.data]);

  const grouped = useMemo(() => {
    const works = worksQuery.data ?? [];
    const by = (s: SubmissionStatus) => works.filter((w) => w.status === s);
    return {
      pending: by("pending"),
      approved: [...by("approved"), ...by("published")],
      rejected: by("rejected"),
    };
  }, [worksQuery.data]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, bio })
      .eq("id", userId!);
    setBusy(false);
    if (error) {
      toast.error("Could not save your details.");
      return;
    }
    toast.success("Profile updated.");
    queryClient.invalidateQueries({ queryKey: ["profile", userId] });
  }

  async function submitWork(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = { ...draft, author_id: userId!, status: "pending" as const };
    const { error } = editingId
      ? await supabase.from("submissions").update(payload).eq("id", editingId)
      : await supabase.from("submissions").insert(payload);
    setBusy(false);
    if (error) {
      toast.error("Could not save this work.");
      return;
    }
    toast.success(editingId ? "Resubmitted for review." : "Sent for review.");
    setDraft(emptyDraft);
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["my-submissions", userId] });
  }

  function editWork(work: Submission) {
    setEditingId(work.id);
    setDraft({
      title: work.title,
      subtitle: work.subtitle,
      kind: work.kind,
      category: work.category,
      excerpt: work.excerpt,
      body: work.body,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Contributor</span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            {name || profileQuery.data?.email || "Your profile"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{profileQuery.data?.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent"
            >
              Editor desk
            </Link>
          )}
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-12">
          <section>
            <div className="rule-accent mb-6">
              <h2 className="font-serif text-2xl">
                {editingId ? "Revise your work" : "Submit a new work"}
              </h2>
            </div>
            <form onSubmit={submitWork} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
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
                <Label htmlFor="excerpt">Short summary</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Full text</Label>
                <Textarea
                  id="body"
                  rows={12}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={busy}>
                  {editingId ? "Resubmit for review" : "Send for review"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setDraft(emptyDraft);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="rule-accent mb-6">
              <h2 className="font-serif text-2xl">Your works</h2>
            </div>
            {worksQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (worksQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing submitted yet. Your first piece will appear here.
              </p>
            ) : (
              <div className="space-y-10">
                <WorkGroup
                  heading="Pending review"
                  works={grouped.pending}
                  onEdit={editWork}
                />
                <WorkGroup heading="Approved & published" works={grouped.approved} />
                <WorkGroup
                  heading="Needs changes"
                  works={grouped.rejected}
                  onEdit={editWork}
                />
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:border-l lg:border-border lg:pl-8">
          <div className="rule-accent">
            <h2 className="font-serif text-xl">Personal information</h2>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Name</Label>
              <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profileQuery.data?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short biography</Label>
              <Textarea
                id="bio"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" disabled={busy}>
              Save details
            </Button>
          </form>

          <dl className="grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            <Stat label="Pending" value={grouped.pending.length} />
            <Stat label="Approved" value={grouped.approved.length} />
            <Stat label="Revise" value={grouped.rejected.length} />
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-2xl">{value}</dd>
    </div>
  );
}

function WorkGroup({
  heading,
  works,
  onEdit,
}: {
  heading: string;
  works: Submission[];
  onEdit?: (work: Submission) => void;
}) {
  if (works.length === 0) return null;
  return (
    <div>
      <h3 className="eyebrow">{heading}</h3>
      <ul className="mt-4 space-y-4">
        {works.map((work) => (
          <li key={work.id} className="rounded-md border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="font-serif text-xl leading-snug">{work.title}</h4>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {work.kind === "poem" ? "Poem" : "Essay"} · {work.category}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] ${statusClass[work.status]}`}
              >
                {statusLabel[work.status]}
              </span>
            </div>
            {work.review_note && (
              <p className="mt-3 border-l-2 border-accent pl-3 text-sm text-muted-foreground">
                Editor's note: {work.review_note}
              </p>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => onEdit(work)}>
                Edit
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
