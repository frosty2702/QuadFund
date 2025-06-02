import { projectsDB } from './submit-project';
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ 
        error: 'Project ID is required' 
      });
    }
    
    console.log(`Attempting to approve project with ID: ${projectId}`);

    // First, check if the project exists
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching project from Supabase:', fetchError);
      return res.status(404).json({ 
        error: 'Failed to fetch project from database',
        details: fetchError.message 
      });
    }
    
    if (!existingProject) {
      console.error(`Project with ID ${projectId} not found in database`);
      return res.status(404).json({ 
        error: 'Project not found in database' 
      });
    }
    
    console.log(`Found project to approve:`, {
      id: existingProject.id,
      title: existingProject.project_title,
      currentStatus: existingProject.status,
      currentlyApproved: existingProject.approved
    });

    // Update in Supabase
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status: 'approved',
        approved: true 
      })
      .eq('id', projectId)
      .select();
    
    if (error) {
      console.error('Error updating project in Supabase:', error);
      
      // Fallback to in-memory database if Supabase fails
      const projectIndex = projectsDB.findIndex(project => project.id === projectId);
      
      if (projectIndex === -1) {
        return res.status(404).json({ 
          error: 'Project not found in memory' 
        });
      }
      
      // Update the project status to approved in memory DB
      projectsDB[projectIndex] = {
        ...projectsDB[projectIndex],
        status: 'approved',
        approved: true
      };
      
      console.log(`Project ${projectId} approved successfully in memory fallback`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Project approved successfully (in-memory fallback)',
        warning: 'Database connection failed, using fallback storage'
      });
    }
    
    if (data.length === 0) {
      console.error(`Project with ID ${projectId} not found after update attempt`);
      return res.status(404).json({ 
        error: 'Project not found in database after update attempt' 
      });
    }
    
    console.log(`Project ${projectId} approved successfully in Supabase`);
    
    // Also update in-memory DB for backward compatibility
    const projectIndex = projectsDB.findIndex(project => project.id === projectId);
    if (projectIndex !== -1) {
      projectsDB[projectIndex] = {
        ...projectsDB[projectIndex],
        status: 'approved',
        approved: true
      };
      console.log(`Project ${projectId} also updated in memory DB`);
    }
    
    // Verify the project is now approved in the database
    const { data: verifyProject, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (!verifyError && verifyProject) {
      console.log('Verification check:', {
        id: verifyProject.id,
        title: verifyProject.project_title,
        status: verifyProject.status,
        approved: verifyProject.approved
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Project approved successfully',
      project: data[0]
    });
  } catch (error) {
    console.error('Error approving project:', error);
    return res.status(500).json({ 
      error: 'An error occurred while approving the project',
      details: error.message
    });
  }
} 