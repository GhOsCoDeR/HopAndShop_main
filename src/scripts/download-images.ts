import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import slugify from 'slugify';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Log environment variables for debugging
console.log('Environment variables:', {
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY ? '****' + process.env.UNSPLASH_ACCESS_KEY.slice(-4) : undefined,
  NODE_ENV: process.env.NODE_ENV
});

// Create Unsplash API client
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  fetch: fetch as any,
});

// Add delay between requests to handle rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function searchUnsplash(query: string): Promise<string | null> {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('UNSPLASH_ACCESS_KEY is not set');
    }

    console.log('Searching Unsplash for:', query);

    // Add delay between requests to prevent rate limiting
    await delay(1000);

    const result = await unsplash.search.getPhotos({
      query: query,
      perPage: 1,
      orientation: 'landscape'
    });

    // Log the raw response for debugging
    console.log('Unsplash API response type:', result.type);
    if (result.type === 'error') {
      console.error('Unsplash API errors:', result.errors);
      console.error('Unsplash API status:', result.status);
      throw new Error(`Unsplash API error: ${result.errors.join(', ')} (Status: ${result.status})`);
    }

    if (!result.response) {
      console.error('Unexpected response format:', result);
      throw new Error('Unexpected response format from Unsplash API');
    }

    if (result.response.total === 0 || !result.response.results[0]) {
      console.log('No images found for query:', query);
      return null;
    }

    return result.response.results[0].urls.regular;
  } catch (error: unknown) {
    console.error('Error searching Unsplash:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    // If we hit rate limits, wait longer
    if (typeof error === 'object' && error && error.toString().includes('rate limit') || 
        typeof error === 'object' && error && error.toString().includes('429')) {
      console.log('Rate limit hit, waiting 60 seconds...');
      await delay(60000);
    }
    return null;
  }
}

async function downloadImage(url: string, filePath: string): Promise<void> {
  try {
    console.log('Downloading image from:', url);
    const response = await fetch(url, {
      headers: {
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log('Image downloaded successfully to:', filePath);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

async function main() {
  // Ensure the directory exists
  const imageDir = path.join('public', 'images', 'products');
  fs.mkdirSync(imageDir, { recursive: true });

  // Read and parse the CSV file
  const csvPath = path.join('public', 'data', 'jumia_products.csv');
  console.log('Reading CSV file from:', csvPath);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: true
  }) as Array<{ id: string; product_name: string; price: string; reviews_count: string; avg_rate: string }>;

  console.log(`Found ${records.length} products in CSV`);

  let successCount = 0;
  let failureCount = 0;

  for (const record of records) {
    try {
      console.log('\nProcessing product:', record.product_name);

      if (!record.product_name) {
        console.log('Product name not found in record:', record);
        failureCount++;
        continue;
      }

      const searchQuery = `${record.product_name} product`;
      const imageUrl = await searchUnsplash(searchQuery);

      if (!imageUrl) {
        console.log('No image found, using placeholder');
        failureCount++;
        continue;
      }

      const fileName = `${slugify(record.product_name, { lower: true, strict: true })}.jpg`;
      const filePath = path.join(imageDir, fileName);

      await downloadImage(imageUrl, filePath);
      successCount++;
    } catch (error) {
      console.error('Error processing product:', error);
      failureCount++;
    }
  }

  console.log('\nProcessing complete:');
  console.log(`- Total products: ${records.length}`);
  console.log(`- Successfully downloaded images: ${successCount}`);
  console.log(`- Failed/placeholder images: ${failureCount}`);
}

main().catch(console.error); 