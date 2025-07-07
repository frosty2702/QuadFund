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

CREATE INDEX IF NOT EXISTS idx_projects_wallet ON projects(wallet_address);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_approved ON projects(approved);


CREATE POLICY "Allow anyone to view approved projects"
  ON projects
  FOR SELECT
  USING (approved = true);

