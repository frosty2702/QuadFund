import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Force delete ALL projects API endpoint hit:', new Date().toISOString());
    
    // Get wallet address from request for safety filtering
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required for safety to prevent deleting all projects' 
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');
    
    // First get all projects for the wallet
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching projects:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: fetchError.message
      });
    }

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found'
      });
    }

    console.log(`Found ${projects.length} projects in database`);
    
    // Filter projects by wallet address (both string and JSON string formats)
    const matchingProjects = projects.filter(project => {
      const projectWallet = project.wallet_address;
      
      // Check different possible formats of wallet address storage
      if (projectWallet === walletAddress) {
        return true;
      }
      
      try {
        // Try to parse it as JSON if it's a string that looks like JSON
        if (typeof projectWallet === 'string' && projectWallet.startsWith('[')) {
          const parsedWallet = JSON.parse(projectWallet);
          if (Array.isArray(parsedWallet) && parsedWallet.includes(walletAddress)) {
            return true;
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      return false;
    });

    if (matchingProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found matching the provided wallet address'
      });
    }

    console.log(`Found ${matchingProjects.length} projects matching wallet: ${walletAddress}`);
    
    // For each project, try multiple deletion methods
    const results = [];
    
    for (const project of matchingProjects) {
      console.log(`Attempting to delete project: ${project.id}`);
      
      // Method 1: Standard delete
      let deleted = false;
      
      try {
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id);
          
        if (!deleteError) {
          deleted = true;
          console.log(`Successfully deleted project ${project.id} with method 1`);
        } else {
          console.log(`Method 1 failed for project ${project.id}: ${deleteError.message}`);
        }
      } catch (e) {
        console.error(`Exception in method 1 for project ${project.id}:`, e);
      }
      
      // Method 2: Use REST API directly if method 1 failed
      if (!deleted) {
        try {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/projects?id=eq.${project.id}`,
            {
              method: 'DELETE',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=representation',
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            deleted = true;
            console.log(`Successfully deleted project ${project.id} with method 2`);
          } else {
            console.log(`Method 2 failed for project ${project.id}: ${response.statusText}`);
          }
        } catch (e) {
          console.error(`Exception in method 2 for project ${project.id}:`, e);
        }
      }
      
      // Method 3: Try raw SQL if supported
      if (!deleted && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          // Create a new client with service role key for elevated privileges
          const adminSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
          
          const { error: rpcError } = await adminSupabase.rpc('delete_project', { project_id: project.id });
          
          if (!rpcError) {
            deleted = true;
            console.log(`Successfully deleted project ${project.id} with method 3`);
          } else {
            console.log(`Method 3 failed for project ${project.id}: ${rpcError.message}`);
          }
        } catch (e) {
          console.error(`Exception in method 3 for project ${project.id}:`, e);
        }
      }
      
      // Verify deletion
      const { data: checkData } = await supabase
        .from('projects')
        .select('id')
        .eq('id', project.id);
        
      const actuallyDeleted = !checkData || checkData.length === 0;
      
      results.push({
        projectId: project.id,
        deleted: actuallyDeleted,
        title: project.project_title || project.title
      });
    }
    
    // Check if any projects were actually deleted
    const successfulDeletions = results.filter(r => r.deleted);
    
    if (successfulDeletions.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete any projects',
        attempts: results
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${successfulDeletions.length} out of ${results.length} projects`,
      results
    });
    
  } catch (error) {
    console.error('Unexpected error during forced deletion:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
} 