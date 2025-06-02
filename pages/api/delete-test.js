import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    const projectId = req.query.projectId || 'dff91e6f-7ac3-41c3-82de-4925c5c65f29';
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');
    
    // 1. Check if project exists
    console.log(`1. Checking if project ${projectId} exists...`);
    const { data: beforeProject, error: beforeError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (beforeError) {
      return res.status(500).json({
        success: false,
        stage: 'before-check',
        error: beforeError
      });
    }
    
    if (!beforeProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found before deletion'
      });
    }
    
    console.log('Project exists before deletion:', beforeProject);
    
    // 2. Delete the project
    console.log(`2. Deleting project ${projectId}...`);
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (deleteError) {
      return res.status(500).json({
        success: false,
        stage: 'delete',
        error: deleteError
      });
    }
    
    console.log('Delete operation executed without errors');
    
    // 3. Check if project was deleted
    console.log(`3. Checking if project ${projectId} still exists...`);
    const { data: afterProject, error: afterError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (afterError && afterError.code !== 'PGRST116') {
      // PGRST116 is the error code for "No rows returned", which is what we want
      return res.status(500).json({
        success: false,
        stage: 'after-check',
        error: afterError
      });
    }
    
    if (afterProject) {
      return res.status(500).json({
        success: false,
        message: 'Project still exists after deletion',
        project: afterProject
      });
    }
    
    console.log('Project was successfully deleted');
    
    // 4. Try to get all projects
    console.log('4. Getting all projects...');
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('*');
    
    if (allError) {
      return res.status(500).json({
        success: false,
        stage: 'all-projects',
        error: allError
      });
    }
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Project deletion test completed successfully',
      projectId,
      beforeProject,
      allProjectsCount: allProjects.length,
      allProjectIds: allProjects.map(p => p.id)
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