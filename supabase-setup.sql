-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  project_title TEXT NOT NULL,
  description TEXT NOT NULL,
  grant_amount TEXT NOT NULL,
  github_repo TEXT,
  wallet_address TEXT,
  milestones JSONB,
  image_path TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  votes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_wallet ON projects(wallet_address);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_approved ON projects(approved);

-- RLS (Row Level Security) Policies
-- These will be important when you integrate with Supabase Auth

-- Allow anyone to view approved projects
CREATE POLICY "Allow anyone to view approved projects"
  ON projects
  FOR SELECT
  USING (approved = true);

-- In the future, you might want to add more policies like:
-- 1. Only allow users to view their own unapproved projects
-- 2. Only allow admins to approve projects
-- 3. Only allow project owners to update their own projects 