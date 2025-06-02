import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Force delete project API endpoint hit:', new Date().toISOString());
    
    // Get project ID and wallet address from request
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    // Initialize Supabase client with the highest available permissions
    let supabase;
    const headers = {
      'Prefer': 'resolution=merge-duplicates'
    };
    
    if (supabaseServiceKey) {
      console.log('Using service role key for enhanced permissions');
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false
        },
        global: { headers }
      });
    } else {
      console.log('Using anon key (limited permissions)');
      supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers }
      });
    }

    // First, get the project to see if it exists
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching project:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: fetchError.message
      });
    }

    if (!projectData) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    console.log('Found project, attempting forced deletion:', projectId);

    // Force delete
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: deleteError.message
      });
    }

    // Verify that the deletion was successful
    const { data: checkData, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId);

    if (checkError) {
      console.error('Error verifying deletion:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying deletion',
        error: checkError.message
      });
    }

    if (checkData && checkData.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Project still exists after forced deletion attempt',
        project: projectData
      });
    }

    console.log('Project successfully deleted with force method');
    
    return res.status(200).json({
      success: true,
      message: 'Project successfully deleted',
      project: projectData
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