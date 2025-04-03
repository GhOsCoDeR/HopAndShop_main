import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Read the test data
const testData = JSON.parse(
  fs.readFileSync(path.join('public', 'data', 'test_products.json'), 'utf-8')
);

// Function to download an image
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve());
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

// Function to generate a placeholder image URL
function getPlaceholderImageUrl(productName: string): string {
  // Using placehold.co service with random colors
  const width = 800;
  const height = 600;
  const colors = ['f44336', '2196f3', '4caf50', 'ff9800', '9c27b0'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://placehold.co/${width}x${height}/${randomColor}/ffffff?text=${encodeURIComponent(productName)}`;
}

// Main function to download images for all products
async function main() {
  try {
    console.log('Starting to download placeholder images...');
    
    for (const category of testData.categories) {
      console.log(`Processing category: ${category.name}`);
      
      for (const product of category.products) {
        const imageUrl = getPlaceholderImageUrl(product.name);
        const imagePath = path.join('public', product.imageUrl);
        
        // Ensure directory exists
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
        
        try {
          await downloadImage(imageUrl, imagePath);
          console.log(`Downloaded image for: ${product.name}`);
        } catch (error) {
          console.error(`Failed to download image for ${product.name}:`, error);
        }
        
        // Add a small delay to avoid overwhelming the placeholder service
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('Finished downloading placeholder images!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main().catch(console.error); 