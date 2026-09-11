import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCategories, type Category } from "@/lib/categories";

/** Editor-desk panel to add, rename, hide, reorder and delete publishing sections. */
export function SectionManager() {
  const { categories, isLoading } = useCategories(true);
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function addCategory() {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    const position = (categories.at(-1)?.position ?? 0) + 1;
    const { error } = await supabase.from("categories").insert({ name, position });
    setBusy(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "That section already exists." : "Could not add the section.",
      );
      return;
    }
    setNewName("");
    toast.success(`Added “${name}”.`);
    refresh();
  }

  async function patch(c: Category, values: Partial<Pick<Category, "name" | "active" | "position">>) {
    const { error } = await supabase.from("categories").update(values).eq("id", c.id);
    if (error) {
      toast.error("Could not save that change.");
      return;
    }
    refresh();
  }

  async function rename(c: Category) {
    const name = editName.trim();
    if (!name) return;
    await patch(c, { name });
    setEditId(null);
    toast.success("Section renamed.");
  }

  async function move(index: number, delta: number) {
    const a = categories[index];
    const b = categories[index + delta];
    if (!a || !b) return;
    await Promise.all([
      supabase.from("categories").update({ position: b.position }).eq("id", a.id),
      supabase.from("categories").update({ position: a.position }).eq("id", b.id),
    ]);
    refresh();
  }

  async function remove(c: Category) {
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) {
      toast.error("Could not delete this section.");
      return;
    }
    toast.success("Section deleted.");
    refresh();
  }

  return (
    <div>
      <div className="rule-accent mb-6">
        <h2 className="font-serif text-2xl">Sections</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These are the sections writers choose from when they submit or publish a work.
        </p>
      </div>

      <form
        className="mb-8 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <div className="flex-1 space-y-2" style={{ minWidth: "14rem" }}>
          <Label htmlFor="new-section">New section</Label>
          <Input
            id="new-section"
            value={newName}
            placeholder="e.g. Spirituality"
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy || !newName.trim()}>
          Add section
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <ul className="space-y-3">
        {categories.map((c, i) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4"
          >
            {editId === c.id ? (
              <Input
                className="max-w-xs"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
            ) : (
              <span className="font-serif text-lg">
                {c.name}
                {!c.active && (
                  <span className="ml-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Hidden
                  </span>
                )}
              </span>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)}>
                Move up
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={i === categories.length - 1}
                onClick={() => move(i, 1)}
              >
                Move down
              </Button>
              {editId === c.id ? (
                <>
                  <Button size="sm" onClick={() => rename(c)}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                >
                  Rename
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => patch(c, { active: !c.active })}>
                {c.active ? "Hide" : "Show"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{c.name}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Works already filed under this section keep their label, but writers will no
                      longer be able to choose it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remove(c)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
