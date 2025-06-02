import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Delete project API endpoint hit:', new Date().toISOString());
    
    // Get project ID and wallet address from request
    const { projectId, walletAddress } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    // Initialize Supabase client with admin privileges if possible
    let supabase;
    if (supabaseServiceKey) {
      console.log('Using service role key for elevated privileges');
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } else {
      console.log('Using anon key with limited privileges');
      supabase = createClient(supabaseUrl, supabaseKey);
    }
    
    console.log('Supabase client initialized successfully.');

    // First try to fetch the project to determine how wallet_address is stored
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Error fetching project:', fetchError);
      return res.status(500).json({ success: false, message: 'Failed to fetch project', error: fetchError });
    }

    if (!projectData) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    console.log('Found project:', JSON.stringify(projectData));

    // If wallet address is provided, check if it matches before deleting
    if (walletAddress) {
      let matchesWallet = false;
      const storedWallet = projectData.wallet_address;
      
      if (typeof storedWallet === 'string') {
        // Handle case where wallet is stored as JSON array string: ["0x123..."]
        if (storedWallet.startsWith('[')) {
          try {
            const parsedWallet = JSON.parse(storedWallet);
            matchesWallet = parsedWallet.includes(walletAddress);
          } catch (e) {
            console.error('Error parsing wallet JSON:', e);
            // Try direct string comparison if JSON parsing fails
            matchesWallet = storedWallet === walletAddress;
          }
        } else {
          // Simple string comparison
          matchesWallet = storedWallet === walletAddress;
        }
      }
      
      if (!matchesWallet) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to delete this project',
          expectedWallet: projectData.wallet_address,
          providedWallet: walletAddress
        });
      }
    }

    // Delete the project from Supabase
    console.log(`Attempting to delete project with ID: ${projectId}`);
    const { error: deleteError, data: deleteData } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return res.status(500).json({ success: false, message: 'Failed to delete project', error: deleteError });
    }

    // Verify deletion by trying to fetch again
    const { data: checkData, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();
      
    if (!checkError && checkData) {
      console.warn('Project still exists after deletion attempt');
      return res.status(500).json({ 
        success: false, 
        message: 'Project still exists after deletion attempt',
        deleteResult: deleteData
      });
    }

    console.log('Project deleted successfully:', projectId);
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred', error: error.message });
  }
} 