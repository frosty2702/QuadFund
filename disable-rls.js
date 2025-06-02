// This is the SQL code to execute in the Supabase SQL Editor to disable RLS, 
// delete projects, and re-enable RLS.
// Copy and paste this into the Supabase SQL Editor in the dashboard.

/*
-- Step 1: Temporarily disable RLS on the projects table
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Step 2: Delete the projects for a specific wallet address
DELETE FROM public.projects 
WHERE wallet_address = '0x97ddf0eaaf9c80d4b88450437b7be6a1ae39d207df496797194ce2d1bd4a85fe'
   OR wallet_address LIKE '%0x97ddf0eaaf9c80d4b88450437b7be6a1ae39d207df496797194ce2d1bd4a85fe%';
   
-- Step 3: Re-enable RLS on the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify deletion was successful
SELECT * FROM public.projects 
WHERE wallet_address = '0x97ddf0eaaf9c80d4b88450437b7be6a1ae39d207df496797194ce2d1bd4a85fe'
   OR wallet_address LIKE '%0x97ddf0eaaf9c80d4b88450437b7be6a1ae39d207df496797194ce2d1bd4a85fe%';
*/

// IMPORTANT: You must run this SQL in the Supabase dashboard SQL Editor with admin privileges.
// RLS cannot be disabled from a client-side API call - it requires direct database access.

console.log(`
To delete projects from the Supabase database, you need to:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to your project
3. Click on "SQL Editor" in the left sidebar
4. Create a new query
5. Paste the SQL code above (remove the comment markers)
6. Run the query

This SQL will:
- Temporarily disable Row Level Security (RLS) on the projects table
- Delete all projects matching the wallet address
- Re-enable RLS to maintain security
- Verify the deletion was successful

NOTE: This requires admin access to the database and cannot be done through the client API.
`); 