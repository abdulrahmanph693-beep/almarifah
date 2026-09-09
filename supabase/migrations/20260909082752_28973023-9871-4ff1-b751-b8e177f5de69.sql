REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, full_name, bio) ON public.profiles TO anon;