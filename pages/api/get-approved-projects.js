import { projectsDB } from './submit-project';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Filter out projects that aren't approved
    const approvedProjects = projectsDB.filter(project => project.approved === true);
    
    return res.status(200).json({ 
      success: true, 
      projects: approvedProjects
    });
  } catch (error) {
    console.error('Error fetching approved projects:', error);
    return res.status(500).json({ 
      error: 'An error occurred while fetching projects',
      details: error.message
    });
  }
} 