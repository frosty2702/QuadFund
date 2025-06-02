import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  console.log('Fetching all projects from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`Found ${data.length} projects in Supabase.`);
    
    const projectDetails = data.map(project => ({
      id: project.id,
      title: project.project_title,
      walletAddress: project.wallet_address,
      addressLength: project.wallet_address ? project.wallet_address.length : 0,
      startsWithOx: project.wallet_address ? project.wallet_address.startsWith('0x') : false
    }));
    
    return res.status(200).json({ 
      success: true,
      count: data.length,
      projects: projectDetails
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
} 