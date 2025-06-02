import { projectsDB } from './submit-project';
import supabase from '../../lib/supabase';

// Default fallback projects to always ensure we have something to show
const defaultFallbackProjects = [
  {
    id: "suilens",
    projectTitle: "SuiLens",
    description: "Live DeFi analytics dashboard for Sui blockchain",
    grantAmount: "320",
    githubRepo: "https://github.com/suilabs/suilens",
    walletAddress: "",
    milestones: [
      {
        text: 'Set up basic data feed from Sui and display TVL + wallet balances.',
        status: 'completed',
        amount: '80 SUI Unlocked'
      },
      {
        text: 'Build live dashboard interface with charts and real-time updates.',
        status: 'pending',
        amount: '80 SUI Locked'
      }
    ],
    imagePath: "/suilens.png",
    status: "approved",
    createdAt: new Date().toISOString(),
    votes: 94,
    approved: true
  },
  {
    id: "pixelmint",
    projectTitle: "PixelMint",
    description: "NFT creation platform for pixel art on Sui",
    grantAmount: "140",
    githubRepo: "https://github.com/pixelmint/sui-nft",
    walletAddress: "",
    imagePath: "/pixelmint.png",
    status: "approved",
    createdAt: new Date().toISOString(),
    votes: 45,
    approved: true
  },
  {
    id: "questloop",
    projectTitle: "QuestLoop",
    description: "Gamified onboarding and quests for Sui ecosystem",
    grantAmount: "175",
    githubRepo: "https://github.com/questloop/sui-quests",
    walletAddress: "",
    imagePath: "/questloop.png",
    status: "approved",
    createdAt: new Date().toISOString(),
    votes: 62,
    approved: true
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase client is properly initialized
    if (!supabase) {
      console.warn('Supabase client not properly initialized, using fallback data');
      return res.status(200).json({ 
        success: true, 
        projects: defaultFallbackProjects,
        source: 'default-fallback',
        warning: 'Supabase client not properly initialized'
      });
    }

    // Try to get approved projects from Supabase first
    const { data: supabaseProjects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('approved', true);
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      
      // Fallback to in-memory database if Supabase fails
      const approvedProjects = projectsDB.filter(project => project.approved === true);
      
      // If we have approved projects in memory, return those
      if (approvedProjects && approvedProjects.length > 0) {
        return res.status(200).json({ 
          success: true, 
          projects: approvedProjects,
          source: 'memory',
          warning: 'Database connection failed, using fallback storage'
        });
      }
      
      // If no approved projects in memory, return default fallbacks
      return res.status(200).json({ 
        success: true, 
        projects: defaultFallbackProjects,
        source: 'default-fallback',
        warning: 'No approved projects found in database or memory'
      });
    }
    
    // If successful but no projects found, return fallbacks
    if (!supabaseProjects || supabaseProjects.length === 0) {
      console.log('No approved projects found in Supabase database');
      
      // Check memory database for approved projects
      const approvedProjects = projectsDB.filter(project => project.approved === true);
      
      // If we have approved projects in memory, return those
      if (approvedProjects && approvedProjects.length > 0) {
        console.log('Found approved projects in memory:', approvedProjects.length);
        return res.status(200).json({ 
          success: true, 
          projects: approvedProjects,
          source: 'memory',
          warning: 'No approved projects in Supabase, using memory storage'
        });
      }
      
      // If no approved projects anywhere, return default fallbacks
      return res.status(200).json({ 
        success: true, 
        projects: defaultFallbackProjects,
        source: 'default-fallback',
        warning: 'No approved projects found in database or memory'
      });
    }
    
    console.log(`Found ${supabaseProjects.length} approved projects in Supabase`);
    
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
    
    // Always include default fallback projects alongside real projects
    return res.status(200).json({ 
      success: true, 
      projects: [...formattedProjects, ...defaultFallbackProjects],
      source: 'supabase+fallbacks'
    });
  } catch (error) {
    console.error('Error fetching approved projects:', error);
    
    // Final fallback to in-memory database
    try {
      const approvedProjects = projectsDB.filter(project => project.approved === true);
      
      // If we have approved projects in memory, return those
      if (approvedProjects && approvedProjects.length > 0) {
        return res.status(200).json({ 
          success: true, 
          projects: approvedProjects,
          source: 'memory-fallback',
          warning: 'Error occurred with database, using fallback storage'
        });
      }
      
      // If no approved projects in memory, return default fallbacks
      return res.status(200).json({ 
        success: true, 
        projects: defaultFallbackProjects,
        source: 'default-fallback',
        warning: 'Error occurred and no projects in memory, using default fallbacks'
      });
    } catch (fallbackError) {
      // If everything else fails, still return the default fallbacks
      return res.status(200).json({ 
        success: true, 
        projects: defaultFallbackProjects,
        source: 'emergency-fallback',
        warning: 'Multiple errors occurred, using emergency fallback data'
      });
    }
  }
} 