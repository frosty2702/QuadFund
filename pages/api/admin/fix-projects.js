import supabase from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Running project fix operation...');
    
    // 1. Fetch all existing projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching projects:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch projects', details: fetchError });
    }
    
    console.log(`Found ${projects.length} projects in the database`);
    
    const results = [];
    
    // 2. Fix each project
    for (const project of projects) {
      console.log(`Fixing project ${project.id}...`);
      
      // Clean up wallet address
      let cleanWalletAddress = project.wallet_address;
      if (typeof project.wallet_address === 'string') {
        cleanWalletAddress = project.wallet_address.replace(/[\[\]"]/g, '');
      }
      
      // Update the project
      const { data, error: updateError } = await supabase
        .from('projects')
        .update({
          wallet_address: cleanWalletAddress,
          approved: true, // Force approve all projects for demo purposes
          status: 'approved'
        })
        .eq('id', project.id)
        .select();
        
      if (updateError) {
        console.error(`Error updating project ${project.id}:`, updateError);
        results.push({ id: project.id, success: false, error: updateError.message });
      } else {
        console.log(`Project ${project.id} fixed successfully`);
        results.push({ id: project.id, success: true });
      }
    }
    
    console.log('Project fix operation completed');
    
    return res.status(200).json({ 
      success: true, 
      message: `Fixed ${results.filter(r => r.success).length} of ${projects.length} projects`,
      results 
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
} 