-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title TEXT NOT NULL,
  description TEXT NOT NULL,
  grant_amount TEXT NOT NULL,
  github_repo TEXT,
  wallet_address TEXT NOT NULL,
  milestones JSONB DEFAULT '[]',
  image_path TEXT DEFAULT '/placeholder-project.png',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  votes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false
);

-- Simpler RLS policies that don't depend on auth
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects
CREATE POLICY "Allow anyone to read projects" ON public.projects
  FOR SELECT USING (true);

-- Allow anyone to insert projects
CREATE POLICY "Allow anyone to insert projects" ON public.projects
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update projects (we'll rely on application logic for access control)
CREATE POLICY "Allow anyone to update projects" ON public.projects
  FOR UPDATE USING (true);

-- Create votes table to track user votes
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id),
  wallet_address TEXT NOT NULL,
  vote_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  transaction_hash TEXT
);

-- Simpler RLS policies for votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read votes
CREATE POLICY "Allow anyone to read votes" ON public.votes
  FOR SELECT USING (true);

-- Allow anyone to insert votes
CREATE POLICY "Allow anyone to insert votes" ON public.votes
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update votes (we'll rely on application logic for access control)
CREATE POLICY "Allow anyone to update votes" ON public.votes
  FOR UPDATE USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS project_wallet_idx ON public.projects(wallet_address);
CREATE INDEX IF NOT EXISTS votes_project_idx ON public.votes(project_id);
CREATE INDEX IF NOT EXISTS votes_wallet_idx ON public.votes(wallet_address); 