#!/bin/bash

# Kill any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "node.*next"

# Clean up build files and caches
echo "Cleaning up build files and caches..."
rm -rf .next
rm -rf node_modules/.cache

# Create fixed _document.js
echo "Creating correct _document.js file..."
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

echo "Fix complete. Run 'npm run dev' to start the development server." 