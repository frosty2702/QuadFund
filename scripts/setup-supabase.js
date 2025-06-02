const { createClient } = require('@supabase/supabase-js');

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Connected to Supabase, checking for projects table...');
  
  // Create projects table if it doesn't exist
  const { error: tableCheckError, data: existingTables } = await supabase
    .from('projects')
    .select('id')
    .limit(1);
  
  if (tableCheckError && tableCheckError.code === '42P01') {
    console.log('Projects table does not exist, creating it...');
    
    // Use raw SQL to create the table
    const { error: createTableError } = await supabase.rpc('create_projects_table', {});
    
    if (createTableError) {
      console.error('Error creating projects table:', createTableError);
      
      // Create the function if it doesn't exist
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_projects_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          project_title TEXT NOT NULL,
          description TEXT,
          grant_amount NUMERIC,
          github_repo TEXT,
          wallet_address TEXT,
          milestones JSONB,
          image_path TEXT,
          approved BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_projects_wallet_address ON public.projects(wallet_address);
        CREATE INDEX IF NOT EXISTS idx_projects_approved ON public.projects(approved);
      END;
      $$ LANGUAGE plpgsql;
      `;
      
      const { error: createFunctionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
      
      if (createFunctionError) {
        console.error('Failed to create database function:', createFunctionError);
      } else {
        // Try creating the table again
        const { error: retryError } = await supabase.rpc('create_projects_table', {});
        if (retryError) {
          console.error('Still could not create table:', retryError);
        } else {
          console.log('Successfully created projects table');
        }
      }
    } else {
      console.log('Successfully created projects table');
    }
  } else {
    console.log('Projects table exists');
  }
}

setupDatabase()
  .then(() => console.log('Database setup complete'))
  .catch(err => console.error('Error in database setup:', err));
