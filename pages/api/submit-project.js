import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../lib/supabase';

// Configure formidable to parse form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Create upload directories function - called at server startup
const ensureUploadDirectories = () => {
  const directories = [
    path.join(process.cwd(), 'tmp'),
    path.join(process.cwd(), 'public', 'uploads')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
      }
    }
  });
};

// Ensure directories exist when this module is loaded
ensureUploadDirectories();

// This is kept for backward compatibility but will be deprecated in favor of Supabase
export let projectsDB = [];

export default async function handler(req, res) {
  // Log when the API is hit
  console.log('Submit project API endpoint hit:', new Date().toISOString());
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting to process form submission');
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating uploads directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      console.log('Creating temp directory');
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Parse the incoming form data using formidable with more verbose options
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: false,
      uploadDir: tempDir,
    });
    
    console.log('Formidable initialized');
    
    // Use promise-based parsing
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parsing error:", err);
          return reject(err);
        }
        console.log("Form parsed successfully");
        console.log("Fields received:", Object.keys(fields));
        
        // Validate files object
        if (!files || typeof files !== 'object') {
          console.log("No files received or files object is invalid");
          files = {}; // Use empty object as fallback
        } else {
          console.log("Files received:", Object.keys(files));
          
          // Check if projectImage exists but is invalid
          if (files.projectImage && (!files.projectImage.filepath || !files.projectImage.size)) {
            console.log("Project image is invalid, removing from files object");
            delete files.projectImage;
          }
        }
        
        resolve([fields, files]);
      });
    });

    console.log('Form data parsed successfully');
    
    // Process image if it exists
    let imagePath = null;
    if (files && files.projectImage) {
      const projectImage = files.projectImage;
      console.log("Processing image file:", projectImage.originalFilename);
      console.log("Image file properties:", {
        size: projectImage.size,
        filepath: projectImage.filepath,
        newFilename: projectImage.newFilename,
        mimetype: projectImage.mimetype
      });
      
      try {
        // Generate a unique filename
        const fileName = `${uuidv4()}${path.extname(projectImage.originalFilename || '.jpg')}`;
        
        // Save the file
        const newPath = path.join(uploadDir, fileName);
        
        console.log('Copying file from', projectImage.filepath);
        console.log('To', newPath);
        
        // Validate that filepath exists before trying to copy
        if (!projectImage.filepath) {
          console.error("Error: Image filepath is undefined");
          throw new Error("Image filepath is missing or invalid");
        }
        
        // Use fs.copyFile instead of promises for better compatibility
        fs.copyFileSync(projectImage.filepath, newPath);
        console.log("Image saved successfully to:", newPath);
        
        // Set the relative path to the image for storage
        imagePath = `/uploads/${fileName}`;
      } catch (copyError) {
        console.error("Error copying file:", copyError);
        // Continue with submission without the image instead of failing completely
        console.log("Continuing submission without image due to error");
        imagePath = null;
      }
    } else {
      console.log('No image file included in submission');
    }

    // Validate required fields
    if (!fields.projectTitle) {
      console.log('Missing required field: projectTitle');
      return res.status(400).json({ error: 'Missing required field: projectTitle' });
    }
    
    if (!fields.description) {
      console.log('Missing required field: description');
      return res.status(400).json({ error: 'Missing required field: description' });
    }
    
    if (!fields.grantAmount) {
      console.log('Missing required field: grantAmount');
      return res.status(400).json({ error: 'Missing required field: grantAmount' });
    }

    // Ensure milestones is properly parsed
    let milestones = [];
    try {
      if (fields.milestones) {
        console.log('Parsing milestones:', fields.milestones);
        milestones = JSON.parse(fields.milestones);
      } else {
        console.log('No milestones field provided');
      }
    } catch (e) {
      console.error("Error parsing milestones:", e);
      console.log('Milestones raw value:', fields.milestones);
      milestones = []; // Default to empty array if parsing fails
    }

    // Create a new project object
    const newProject = {
      id: uuidv4(),
      project_title: fields.projectTitle,
      description: fields.description,
      grant_amount: fields.grantAmount,
      github_repo: fields.githubRepo || '',
      wallet_address: fields.walletAddress ? fields.walletAddress.toString().replace(/[\[\]"]/g, '') : '', // Clean any JSON formatting
      milestones: milestones,
      image_path: imagePath,
      status: 'pending', // pending, approved, rejected
      created_at: new Date().toISOString(),
      votes: 0,
      approved: false, // This controls whether it's shown on the frontend
    };
    
    // Log the wallet address for debugging
    console.log('Submitting project with wallet address:', newProject.wallet_address);
    console.log('Original wallet address from form:', fields.walletAddress);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (error) {
      console.error('Error inserting project into Supabase:', error);
      
      // Fallback to in-memory DB if Supabase fails
      projectsDB.push({
        ...newProject,
        projectTitle: newProject.project_title,
        grantAmount: newProject.grant_amount,
        githubRepo: newProject.github_repo,
        walletAddress: newProject.wallet_address,
        imagePath: newProject.image_path,
        createdAt: newProject.created_at
      });
      
      console.log('Project added to in-memory database as fallback');
      
      // We'll still return success but log the error
      return res.status(200).json({ 
        success: true, 
        message: 'Project submitted successfully (in-memory fallback)',
        projectId: newProject.id,
        warning: 'Database connection failed, using fallback storage'
      });
    }

    console.log('Project successfully inserted into Supabase');
    
    // Store in our in-memory database as well for backward compatibility
    projectsDB.push({
      ...newProject,
      projectTitle: newProject.project_title,
      grantAmount: newProject.grant_amount,
      githubRepo: newProject.github_repo,
      walletAddress: newProject.wallet_address,
      imagePath: newProject.image_path,
      createdAt: newProject.created_at
    });
    
    // Log the new project for development purposes
    console.log('New project added to database with ID:', newProject.id);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Project submitted successfully',
      projectId: newProject.id
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'An error occurred while processing your submission',
      details: error.message || 'Unknown error'
    });
  }
} 