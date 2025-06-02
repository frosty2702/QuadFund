import { projectsDB } from './submit-project';
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        error: 'Wallet address is required' 
      });
    }
    
    // Clean the query wallet address
    const cleanWalletAddress = walletAddress.toString().replace(/[\[\]"]/g, '');
    
    console.log('Fetching submissions for wallet:', walletAddress);
    console.log('Cleaned wallet address for query:', cleanWalletAddress);

    // First, check if we can query all projects to see what's available
    console.log('DEBUG: Getting all projects to check database state');
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('*');
      
    if (allError) {
      console.error('Error fetching all projects:', allError);
    } else {
      console.log(`Found ${allProjects.length} total projects in database`);
      
      if (allProjects.length > 0) {
        // Log the first project as an example
        console.log('Example project:', {
          id: allProjects[0].id,
          title: allProjects[0].project_title,
          wallet: allProjects[0].wallet_address
        });
        
        // Log all wallet addresses for debugging
        console.log('All wallet addresses in database:');
        allProjects.forEach(p => {
          console.log(`- ${p.wallet_address}`);
        });
      }
    }
    
    // Try different query strategies
    let supabaseProjects = [];
    
    // 1. Try direct query (includes exact match and LIKE with JSON formatting)
    const { data: directMatches, error: directError } = await supabase
      .from('projects')
      .select('*')
      .or(`wallet_address.eq.${cleanWalletAddress},wallet_address.like.%${cleanWalletAddress}%`);
      
    if (directError) {
      console.error('Error with direct wallet query:', directError);
    } else {
      console.log(`Found ${directMatches.length} projects with direct wallet match`);
      supabaseProjects = directMatches;
    }
    
    // 2. If that fails, try to manually filter
    if (supabaseProjects.length === 0 && allProjects && allProjects.length > 0) {
      console.log('Trying manual filtering of all projects');
      
      supabaseProjects = allProjects.filter(project => {
        if (!project.wallet_address) return false;
        
        const dbWallet = project.wallet_address.toString().replace(/[\[\]"]/g, '').toLowerCase();
        const queryWallet = cleanWalletAddress.toLowerCase();
        
        const exactMatch = dbWallet === queryWallet;
        const prefixMatch = queryWallet.startsWith('0x') && dbWallet === queryWallet.substring(2);
        const noPrefixMatch = !queryWallet.startsWith('0x') && dbWallet === `0x${queryWallet}`;
        
        return exactMatch || prefixMatch || noPrefixMatch;
      });
      
      console.log(`Found ${supabaseProjects.length} projects after manual filtering`);
    }
    
    if (supabaseProjects.length === 0) {
      // Fallback to in-memory database
      const memoryProjects = projectsDB.filter(project => {
        if (!project.walletAddress) return false;
        
        const projectWallet = project.walletAddress.toString().replace(/[\[\]"]/g, '').toLowerCase();
        const queryWallet = cleanWalletAddress.toLowerCase();
        
        return (
          projectWallet === queryWallet ||
          (queryWallet.startsWith('0x') && projectWallet === queryWallet.substring(2)) ||
          (!queryWallet.startsWith('0x') && projectWallet === `0x${queryWallet}`)
        );
      });
      
      console.log(`Found ${memoryProjects.length} projects in memory for this wallet`);
      
      return res.status(200).json({ 
        success: true, 
        projects: memoryProjects,
        source: 'memory',
        warning: 'No projects found in database'
      });
    }
    
    // If successful, map the Supabase fields to match the expected format
    const formattedProjects = supabaseProjects.map(project => ({
      id: project.id,
      projectTitle: project.project_title,
      description: project.description,
      grantAmount: project.grant_amount,
      githubRepo: project.github_repo,
      walletAddress: project.wallet_address,
      milestones: project.milestones,
      imagePath: project.image_path,
      status: project.status,
      createdAt: project.created_at,
      votes: project.votes,
      approved: project.approved
    }));
    
    return res.status(200).json({ 
      success: true, 
      projects: formattedProjects,
      source: 'supabase'
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    
    // Final fallback to in-memory database
    try {
      const walletAddress = req.query.walletAddress;
      const cleanWalletAddress = walletAddress.toString().replace(/[\[\]"]/g, '');
      
      const memoryProjects = projectsDB.filter(project => {
        if (!project.walletAddress) return false;
        
        const projectWallet = project.walletAddress.toString().replace(/[\[\]"]/g, '').toLowerCase();
        const queryWallet = cleanWalletAddress.toLowerCase();
        
        return (
          projectWallet === queryWallet ||
          (queryWallet.startsWith('0x') && projectWallet === queryWallet.substring(2)) ||
          (!queryWallet.startsWith('0x') && projectWallet === `0x${queryWallet}`)
        );
      });
      
      return res.status(200).json({ 
        success: true, 
        projects: memoryProjects,
        source: 'memory-fallback',
        warning: 'Error occurred with database, using fallback storage'
      });
    } catch (fallbackError) {
      return res.status(500).json({ 
        error: 'An error occurred while fetching user submissions',
        details: error.message
      });
    }
  }
} 