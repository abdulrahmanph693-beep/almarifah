-- Public pages need author names/bios for published works.
GRANT SELECT ON public.submissions TO anon;
GRANT SELECT ON public.profiles TO anon;

CREATE POLICY "Anyone reads profiles of published authors"
  ON public.profiles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM public.submissions s
      WHERE s.author_id = profiles.id
        AND s.status = 'published'::submission_status
    )
  );