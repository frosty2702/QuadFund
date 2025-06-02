// Debug script to check wallet addresses
const supabase = require('./lib/supabase').default;

async function debugWalletAddresses() {
  console.log('Fetching all projects from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return;
    }
    
    console.log(`Found ${data.length} projects in Supabase.`);
    
    data.forEach(project => {
      console.log(`Project ID: ${project.id}`);
      console.log(`Project Title: ${project.project_title}`);
      console.log(`Wallet Address: ${project.wallet_address}`);
      console.log('---');
    });
    
    console.log('\nExample address format check:');
    if (data.length > 0) {
      const exampleAddress = data[0].wallet_address;
      console.log(`Example wallet address: ${exampleAddress}`);
      console.log(`Address starts with 0x: ${exampleAddress.startsWith('0x')}`);
      console.log(`Address length: ${exampleAddress.length}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugWalletAddresses(); 