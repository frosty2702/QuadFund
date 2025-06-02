// Temporary script to fix all projects in Supabase database
import supabase from './lib/supabase';

async function fixProjects() {
  console.log('Running project fix script...');
  
  try {
    // 1. Fetch all existing projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching projects:', fetchError);
      return;
    }
    
    console.log(`Found ${projects.length} projects in the database`);
    
    // 2. Fix each project
    for (const project of projects) {
      console.log(`Fixing project ${project.id}...`);
      
      // Clean up wallet address
      let cleanWalletAddress = project.wallet_address;
      if (typeof project.wallet_address === 'string') {
        cleanWalletAddress = project.wallet_address.replace(/[\[\]"]/g, '');
      }
      
      // Update the project
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          wallet_address: cleanWalletAddress,
          approved: true, // Force approve all projects for demo purposes
          status: 'approved'
        })
        .eq('id', project.id);
        
      if (updateError) {
        console.error(`Error updating project ${project.id}:`, updateError);
      } else {
        console.log(`Project ${project.id} fixed successfully`);
      }
    }
    
    console.log('Project fix script completed');
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the function
fixProjects(); 