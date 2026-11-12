import { useState, type ChangeEvent, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type Member = Database["public"]["Tables"]["editorial_members"]["Row"];
type MemberDraft = Pick<Member, "full_name" | "role_title" | "section" | "bio" | "photo_data">;

const blankDraft: MemberDraft = {
  full_name: "",
  role_title: "",
  section: "",
  bio: "",
  photo_data: "",
};

const queryKey = ["editorial-members-admin"] as const;

export function EditorialBoardManager() {
  const queryClient = useQueryClient();
  const membersQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_members")
        .select("*")
        .order("position", { ascending: true })
        .order("full_name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [draft, setDraft] = useState<MemberDraft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setDraft(blankDraft);
    setEditingId(null);
  }

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Portraits must be 2 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((current) => ({ ...current, photo_data: reader.result as string }));
      }
    };
    reader.onerror = () => toast.error("Could not read that image.");
    reader.readAsDataURL(file);
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.full_name.trim() || !draft.section.trim()) return;
    setBusy(true);
    const payload = {
      full_name: draft.full_name.trim(),
      role_title: draft.role_title.trim(),
      section: draft.section.trim(),
      bio: draft.bio.trim(),
      photo_data: draft.photo_data,
    };
    const result = editingId
      ? await supabase.from("editorial_members").update(payload).eq("id", editingId)
      : await supabase
          .from("editorial_members")
          .insert({ ...payload, position: membersQuery.data?.length ?? 0 });
    setBusy(false);
    if (result.error) {
      toast.error("Could not save this editor.");
      return;
    }
    toast.success(editingId ? "Editor details updated." : "Editor added to the directory.");
    resetForm();
    await queryClient.invalidateQueries({ queryKey });
    await queryClient.invalidateQueries({ queryKey: ["editorial-members-public"] });
  }

  async function deleteMember(member: Member) {
    if (!window.confirm(`Remove ${member.full_name} from the public directory?`)) return;
    const { error } = await supabase.from("editorial_members").delete().eq("id", member.id);
    if (error) {
      toast.error("Could not remove this editor.");
      return;
    }
    toast.success("Editor removed.");
    if (editingId === member.id) resetForm();
    await queryClient.invalidateQueries({ queryKey });
    await queryClient.invalidateQueries({ queryKey: ["editorial-members-public"] });
  }

  function editMember(member: Member) {
    setEditingId(member.id);
    setDraft({
      full_name: member.full_name,
      role_title: member.role_title,
      section: member.section,
      bio: member.bio,
      photo_data: member.photo_data,
    });
  }

  return (
    <div>
      <div className="rule-accent mb-6">
        <h2 className="font-serif text-2xl">Editorial board</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add section editors and their portraits to the public About Us page.
        </p>
      </div>

      <form className="max-w-2xl space-y-4 border-b border-border pb-8" onSubmit={saveMember}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="editor-name">Editor name</Label>
            <Input id="editor-name" value={draft.full_name} onChange={(event) => setDraft({ ...draft, full_name: event.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editor-section">Section</Label>
            <Input id="editor-section" placeholder="e.g. Seerah & Tawheed" value={draft.section} onChange={(event) => setDraft({ ...draft, section: event.target.value })} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="editor-title">Position or role</Label>
            <Input id="editor-title" placeholder="e.g. Editorial Board" value={draft.role_title} onChange={(event) => setDraft({ ...draft, role_title: event.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editor-bio">Short biography</Label>
          <Textarea id="editor-bio" rows={3} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Label htmlFor="editor-photo" className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input px-3 text-sm hover:bg-accent">
            <ImagePlus aria-hidden="true" className="size-4" />
            Upload portrait
          </Label>
          <Input id="editor-photo" type="file" accept="image/*" className="sr-only" onChange={choosePhoto} />
          {draft.photo_data && <img src={draft.photo_data} alt="Portrait preview" className="size-12 rounded-full border border-border object-cover" />}
          {draft.photo_data && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setDraft({ ...draft, photo_data: "" })}>
              <X aria-hidden="true" /> Remove photo
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Images up to 2 MB.</p>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy || !draft.full_name.trim() || !draft.section.trim()}>
            {busy ? "Saving…" : editingId ? "Save editor" : "Add editor"}
          </Button>
          {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </form>

      <div className="divide-y divide-border">
        {membersQuery.isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">Loading editors…</p>
        ) : membersQuery.isError ? (
          <p className="py-6 text-sm text-destructive" role="alert">Could not load the directory.</p>
        ) : (membersQuery.data ?? []).length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No editors have been added yet.</p>
        ) : (membersQuery.data ?? []).map((member) => (
          <article key={member.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-4">
              {member.photo_data ? <img src={member.photo_data} alt="" className="size-12 shrink-0 rounded-full border border-border object-cover" /> : <div aria-hidden="true" className="size-12 shrink-0 rounded-full bg-muted" />}
              <div className="min-w-0">
                <h3 className="font-serif text-lg">{member.full_name}</h3>
                <p className="text-sm text-muted-foreground">{member.role_title || member.section} · {member.section}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => editMember(member)}><Pencil aria-hidden="true" /> Edit</Button>
              <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => void deleteMember(member)}><Trash2 aria-hidden="true" /> Remove</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}