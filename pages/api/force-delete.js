import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');

    // Use the rpc method to execute a SQL query directly
    const { data, error } = await supabase.rpc('exec', {
      query: `DELETE FROM projects WHERE id = '${projectId}' RETURNING id`
    });

    if (error) {
      console.error('Error executing delete SQL:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete project',
        error 
      });
    }

    // Check if we got a result
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found or not deleted' 
      });
    }

    console.log('Delete successful, rows affected:', data.length);
    return res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully',
      result: data 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred', 
      error: error.message 
    });
  }
} 