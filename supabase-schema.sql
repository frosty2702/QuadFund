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

-- Create RLS policies for projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved projects
CREATE POLICY "Anyone can read approved projects" ON public.projects
  FOR SELECT USING (approved = true);

-- Allow project owners to read their own projects
CREATE POLICY "Users can read their own projects" ON public.projects
  FOR SELECT USING (wallet_address = auth.uid()::text);

-- Allow users to create projects
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (true);

-- Allow project owners to update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (wallet_address = auth.uid()::text);

-- Create votes table to track user votes
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id),
  wallet_address TEXT NOT NULL,
  vote_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  transaction_hash TEXT
);

-- Set up RLS for votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own votes
CREATE POLICY "Users can read their own votes" ON public.votes
  FOR SELECT USING (wallet_address = auth.uid()::text);

-- Allow users to create votes
CREATE POLICY "Users can create votes" ON public.votes
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own votes
CREATE POLICY "Users can update their own votes" ON public.votes
  FOR UPDATE USING (wallet_address = auth.uid()::text);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS project_wallet_idx ON public.projects(wallet_address);
CREATE INDEX IF NOT EXISTS votes_project_idx ON public.votes(project_id);
CREATE INDEX IF NOT EXISTS votes_wallet_idx ON public.votes(wallet_address); 