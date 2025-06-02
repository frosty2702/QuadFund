// Delete submissions script
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function deleteSubmissions() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found in environment variables');
      console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      process.exit(1);
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');

    // Get wallet address from command line args
    const args = process.argv.slice(2);
    const walletAddress = args[0];
    
    if (!walletAddress) {
      console.log('Please provide a wallet address as an argument');
      console.log('Usage: node delete-submissions.js <wallet-address>');
      process.exit(1);
    }

    console.log(`Deleting submissions for wallet: ${walletAddress}`);
    
    // Clean the wallet address to handle different formats
    const cleanWalletAddress = walletAddress.replace(/[\[\]"\\]/g, '');

    // Query to find all projects by this wallet
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching projects:', fetchError);
      process.exit(1);
    }

    // Filter projects by wallet address with various formats
    const matchingProjects = projects.filter(project => {
      if (!project.walletAddress) return false;
      
      // Handle different wallet formats
      const projectWallet = project.walletAddress;
      
      if (typeof projectWallet === 'string') {
        if (projectWallet === walletAddress || projectWallet === cleanWalletAddress) {
          return true;
        }
        
        // Handle JSON string format
        if (projectWallet.startsWith('[')) {
          try {
            const parsedWallet = JSON.parse(projectWallet);
            return parsedWallet.includes(cleanWalletAddress);
          } catch (e) {
            return false;
          }
        }
      }
      
      return false;
    });

    if (matchingProjects.length === 0) {
      console.log('No projects found for this wallet address');
      process.exit(0);
    }

    console.log(`Found ${matchingProjects.length} projects to delete`);
    
    // Delete each project
    for (const project of matchingProjects) {
      console.log(`Deleting project ${project.id}: ${project.title || 'Untitled'}`);
      
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);
      
      if (deleteError) {
        console.error(`Error deleting project ${project.id}:`, deleteError);
      } else {
        console.log(`Successfully deleted project ${project.id}`);
      }
    }
    
    console.log('All matching projects have been processed');
    
  } catch (error) {
    console.error('Error deleting submissions:', error);
    process.exit(1);
  }
}

// Run the script
deleteSubmissions(); 