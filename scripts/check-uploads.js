// This script checks and creates necessary directories for file uploads
const fs = require('fs');
const path = require('path');

// Define the directories we need
const directories = [
  path.join(process.cwd(), 'tmp'),
  path.join(process.cwd(), 'public', 'uploads')
];

// Check and create each directory
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.error(`❌ Error creating directory ${dir}:`, error);
    }
  } else {
    // Check if the directory is writable
    try {
      const testFile = path.join(dir, '.write-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ Directory exists and is writable: ${dir}`);
    } catch (error) {
      console.error(`❌ Directory ${dir} exists but is not writable:`, error);
    }
  }
});

console.log('Directory check complete'); 