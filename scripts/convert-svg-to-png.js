const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  try {
    const inputPath = path.join(__dirname, '../public/walletforsui.svg');
    const outputPath = path.join(__dirname, '../public/walletforsui.png');
    
    const svgBuffer = fs.readFileSync(inputPath);
    
    await sharp(svgBuffer)
      .resize(256, 256)
      .png()
      .toFile(outputPath);
    
    console.log('✅ Successfully converted walletforsui.svg to walletforsui.png');
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error);
  }
}

convertSvgToPng(); 