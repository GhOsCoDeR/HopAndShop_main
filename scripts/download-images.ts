import fs from 'fs'
import path from 'path'
import https from 'https'
import { dummyProducts, products } from '../src/data/products'

const imageUrls = {
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
  ],
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
  ],
  appliances: [
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5'
  ],
  tvs: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1'
  ],
  fashion: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49'
  ],
  furniture: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348'
  ],
  sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b'
  ],
  toys: [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088'
  ],
  books: [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
  ],
  gaming: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e'
  ]
}

const categoryImages = {
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  tvs: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e'
}

function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve())
      } else {
        response.resume()
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`))
      }
    })
  })
}

async function main() {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products')
  
  // Create category directories
  Object.keys(dummyProducts).forEach(category => {
    const dir = path.join(baseDir, category)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  // Create categories directory
  const categoriesDir = path.join(baseDir, 'categories')
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true })
  }

  // Download images for main products array (IDs 1-5)
  console.log('Downloading images for main products...')
  for (const product of products.slice(0, 5)) {
    const category = product.category as keyof typeof imageUrls
    const url = imageUrls[category]?.[0] || imageUrls.phones[0]
    const filepath = path.join(baseDir, category, `${product.id}.jpg`)
    
    try {
      await downloadImage(url, filepath)
      console.log(`Downloaded ${filepath}`)
    } catch (error) {
      console.error(`Error downloading ${filepath}:`, error)
    }
  }

  // Download product images from dummyProducts
  for (const [category, products] of Object.entries(dummyProducts)) {
    console.log(`Downloading images for ${category}...`)
    const urls = imageUrls[category as keyof typeof imageUrls]
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const url = urls[i]
      const filepath = path.join(baseDir, category, `${product.id}.jpg`)
      
      try {
        await downloadImage(url, filepath)
        console.log(`Downloaded ${filepath}`)
      } catch (error) {
        console.error(`Error downloading ${filepath}:`, error)
      }
    }
  }

  // Download category images
  console.log('Downloading category images...')
  for (const [category, url] of Object.entries(categoryImages)) {
    const filepath = path.join(categoriesDir, `${category}.jpg`)
    try {
      await downloadImage(url, filepath)
      console.log(`Downloaded ${filepath}`)
    } catch (error) {
      console.error(`Error downloading ${filepath}:`, error)
    }
  }
}

main().catch(console.error) 