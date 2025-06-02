-- Fix for missing DELETE policies in RLS
-- Run this in the Supabase SQL Editor

-- First, add a DELETE policy to the projects table
CREATE POLICY "Allow anyone to delete projects" ON public.projects
  FOR DELETE USING (true);

-- Also add a DELETE policy to the votes table
CREATE POLICY "Allow anyone to delete votes" ON public.votes
  FOR DELETE USING (true);

-- Alternatively, if you want to temporarily disable RLS for testing:
-- ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;

-- After your operations, you can re-enable it:
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- To verify the policies:
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('projects', 'votes')
ORDER BY tablename, policyname; 