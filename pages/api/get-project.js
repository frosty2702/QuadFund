import { projectsDB } from './submit-project';
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Project ID is required' 
      });
    }
    
    console.log(`Fetching project with ID: ${id}`);

    // First try to get the project from Supabase
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      
      // Fallback to in-memory database if Supabase fails
      const memoryProject = projectsDB.find(project => project.id === id);
      
      if (!memoryProject) {
        return res.status(404).json({ 
          error: 'Project not found in memory', 
          warning: 'Database connection failed, tried memory fallback'
        });
      }
      
      // Return the project from memory
      return res.status(200).json({ 
        success: true, 
        project: memoryProject,
        source: 'memory',
        warning: 'Database connection failed, using fallback storage'
      });
    }
    
    if (!data) {
      // Try to find in memory as a last resort
      const memoryProject = projectsDB.find(project => project.id === id);
      
      if (memoryProject) {
        return res.status(200).json({
          success: true,
          project: memoryProject,
          source: 'memory-fallback',
          warning: 'Project not found in database but found in memory'
        });
      }
      
      return res.status(404).json({ 
        error: 'Project not found' 
      });
    }
    
    console.log(`Successfully fetched project: ${data.project_title || data.id}`);
    
    // Return the project
    return res.status(200).json({ 
      success: true, 
      project: data,
      source: 'supabase'
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ 
      error: 'An error occurred while fetching the project',
      details: error.message
    });
  }
} 