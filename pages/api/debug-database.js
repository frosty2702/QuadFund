import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('Running database diagnostic...');
    
    // Check if projects table exists
    const { error: tableError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
      
    const tableExists = !tableError || !tableError.message.includes('does not exist');
    
    // Get list of all projects
    let projects = [];
    let projectsError = null;
    
    if (tableExists) {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
        
      if (error) {
        projectsError = error;
      } else {
        projects = data;
      }
    }
    
    // Check the wallet address from the request
    const requestWallet = req.query.wallet || '';
    
    // Try to find a project with this wallet
    let matchedByExact = [];
    let matchedByNoPrefix = [];
    let matchedByAddPrefix = [];
    
    if (requestWallet && projects.length > 0) {
      // Exact match
      matchedByExact = projects.filter(p => 
        p.wallet_address === requestWallet
      );
      
      // Without 0x prefix
      if (requestWallet.startsWith('0x')) {
        const noPrefix = requestWallet.substring(2);
        matchedByNoPrefix = projects.filter(p => 
          p.wallet_address === noPrefix
        );
      }
      
      // With 0x prefix
      if (!requestWallet.startsWith('0x')) {
        const withPrefix = `0x${requestWallet}`;
        matchedByAddPrefix = projects.filter(p => 
          p.wallet_address === withPrefix
        );
      }
    }

    // Show the first project's raw data to understand the schema
    const sampleProject = projects.length > 0 ? projects[0] : null;
    const columnNames = sampleProject ? Object.keys(sampleProject) : [];
    
    return res.status(200).json({
      success: true,
      diagnostics: {
        tableExists,
        tableError: tableError ? tableError.message : null,
        projectsCount: projects.length,
        projectsError: projectsError ? projectsError.message : null,
        columnNames: columnNames,
        sampleProject: sampleProject,
        projects: projects.map(p => ({
          id: p.id,
          columnNames: Object.keys(p),
          rawProject: p
        })),
      },
      walletCheck: {
        requestWallet,
        matchedByExact: matchedByExact.length,
        matchedByNoPrefix: matchedByNoPrefix.length, 
        matchedByAddPrefix: matchedByAddPrefix.length
      }
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return res.status(500).json({ 
      error: 'Server error during diagnostics',
      message: error.message
    });
  }
} 