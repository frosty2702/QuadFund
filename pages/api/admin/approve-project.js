import { projectsDB } from '../submit-project';

// Simple admin authorization middleware
const isAuthorized = (req) => {
  // In a real app, you would implement proper authentication and authorization
  // This is just a placeholder for demonstration purposes
  const adminToken = req.headers.authorization?.split(' ')[1];
  return adminToken === process.env.ADMIN_API_TOKEN;
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the request is authorized
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    // Find the project in the database
    const projectIndex = projectsDB.findIndex(project => project.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Update the project to be approved
    projectsDB[projectIndex] = {
      ...projectsDB[projectIndex],
      approved: true,
      status: 'approved',
      approvedAt: new Date().toISOString()
    };
    
    return res.status(200).json({ 
      success: true, 
      message: 'Project approved successfully',
      project: projectsDB[projectIndex]
    });
  } catch (error) {
    console.error('Error approving project:', error);
    return res.status(500).json({ 
      error: 'An error occurred while approving the project',
      details: error.message
    });
  }
} 