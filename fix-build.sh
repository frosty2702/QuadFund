#!/bin/bash

# Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "node.*next" || true

# Clear all caches and build files
echo "Cleaning up build files and caches..."
rm -rf .next
rm -rf node_modules/.cache

# Create proper _document.js file
echo "Creating proper _document.js file for Next.js 13..."
cat > pages/_document.js << 'EOF'
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
EOF

# Fix environment variable for Supabase in API files
echo "Fixing Supabase environment variable references..."
find pages/api -type f -name "*.js" -exec sed -i '' 's/NEXT_PUBLIC_SUPABASE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY/g' {} \;
find scripts -type f -name "*.js" -exec sed -i '' 's/NEXT_PUBLIC_SUPABASE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY/g' {} \;

# Start the development server
echo "Starting development server..."
NODE_ENV=development npm run dev 