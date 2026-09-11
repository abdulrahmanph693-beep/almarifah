import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { submissionCategories } from "./submissions";

export type Category = {
  id: string;
  name: string;
  position: number;
  active: boolean;
};

/** Categories an author/editor can choose from when publishing a work. */
export function useCategories(includeInactive = false) {
  const query = useQuery({
    queryKey: ["categories", includeInactive],
    queryFn: async () => {
      let q = supabase
        .from("categories")
        .select("id, name, position, active")
        .order("position", { ascending: true })
        .order("name", { ascending: true });
      if (!includeInactive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const names = (query.data ?? []).filter((c) => c.active).map((c) => c.name);
  return {
    ...query,
    categories: query.data ?? [],
    names: names.length > 0 ? names : submissionCategories,
  };
}
