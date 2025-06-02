import { projectsDB } from '../submit-project';

// Simple admin authorization middleware
const isAuthorized = (req) => {
  // In a real app, you would implement proper authentication and authorization
  // This is just a placeholder for demonstration purposes
  const adminToken = req.headers.authorization?.split(' ')[1];
  return adminToken === process.env.ADMIN_API_TOKEN;
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the request is authorized
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Return all projects including pending/unapproved ones
    return res.status(200).json({ 
      success: true, 
      projects: projectsDB
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ 
      error: 'An error occurred while fetching projects',
      details: error.message
    });
  }
} 