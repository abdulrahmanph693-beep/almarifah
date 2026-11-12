CREATE TABLE public.editorial_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role_title text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_data text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.editorial_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_members TO authenticated;
GRANT ALL ON public.editorial_members TO service_role;
ALTER TABLE public.editorial_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active editorial members" ON public.editorial_members FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins insert editorial members" ON public.editorial_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update editorial members" ON public.editorial_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete editorial members" ON public.editorial_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER editorial_members_updated_at BEFORE UPDATE ON public.editorial_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();