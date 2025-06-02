import { projectsDB } from './submit-project';
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, voteAmount } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ 
        error: 'Project ID is required' 
      });
    }

    if (voteAmount === undefined || typeof voteAmount !== 'number') {
      return res.status(400).json({ 
        error: 'Valid vote amount is required' 
      });
    }

    // Get current project from Supabase to get current vote count
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('votes')
      .eq('id', projectId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching project from Supabase:', fetchError);
      
      // Fallback to in-memory database if Supabase fetch fails
      const project = projectsDB.find(p => p.id === projectId);
      if (!project) {
        return res.status(404).json({ 
          error: 'Project not found' 
        });
      }
      
      // Update votes in memory
      const currentVotes = project.votes || 0;
      const newVotes = currentVotes + voteAmount;
      
      // Update the project in memory
      const projectIndex = projectsDB.findIndex(p => p.id === projectId);
      projectsDB[projectIndex] = {
        ...projectsDB[projectIndex],
        votes: newVotes
      };
      
      return res.status(200).json({ 
        success: true, 
        message: 'Votes updated successfully (in-memory fallback)',
        votes: newVotes,
        warning: 'Database connection failed, using fallback storage'
      });
    }
    
    if (!currentProject) {
      return res.status(404).json({ 
        error: 'Project not found in database' 
      });
    }
    
    // Calculate new vote count
    const currentVotes = currentProject.votes || 0;
    const newVotes = currentVotes + voteAmount;
    
    // Update votes in Supabase
    const { data, error } = await supabase
      .from('projects')
      .update({ votes: newVotes })
      .eq('id', projectId)
      .select();
    
    if (error) {
      console.error('Error updating votes in Supabase:', error);
      
      // Fallback to in-memory database if Supabase update fails
      const projectIndex = projectsDB.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        return res.status(404).json({ 
          error: 'Project not found in memory' 
        });
      }
      
      // Update the project in memory
      projectsDB[projectIndex] = {
        ...projectsDB[projectIndex],
        votes: newVotes
      };
      
      return res.status(200).json({ 
        success: true, 
        message: 'Votes updated successfully (in-memory fallback)',
        votes: newVotes,
        warning: 'Database connection failed, using fallback storage'
      });
    }
    
    // Also update in-memory DB for backward compatibility
    const projectIndex = projectsDB.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      projectsDB[projectIndex] = {
        ...projectsDB[projectIndex],
        votes: newVotes
      };
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Votes updated successfully',
      votes: newVotes
    });
  } catch (error) {
    console.error('Error updating votes:', error);
    return res.status(500).json({ 
      error: 'An error occurred while updating votes',
      details: error.message
    });
  }
} 