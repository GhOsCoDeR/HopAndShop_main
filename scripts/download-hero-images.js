const https = require('https')
const fs = require('fs')
const path = require('path')

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath))
      } else {
        response.resume()
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`))
      }
    })
  })
}

// Create directories if they don't exist
const bannersDir = path.join(__dirname, '../public/images/banners')
const productsDir = path.join(__dirname, '../public/images/products')

if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true })
}

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true })
}

// Create category directories
const categories = [
  'phones', 'laptops', 'tvs', 'audio', 'gaming', 
  'appliances', 'fashion', 'furniture', 'beauty', 
  'sports', 'toys', 'books'
]

categories.forEach(category => {
  const categoryDir = path.join(productsDir, category)
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }
})

// Hero banner images
const heroImages = [
  {
    name: 'electronics-sale',
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
    description: 'Electronics Sale Banner'
  },
  {
    name: 'smartphones',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop',
    description: 'Smartphones Banner'
  },
  {
    name: 'laptops',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop',
    description: 'Laptops Banner'
  }
]

// Promo banner images
const promoImages = [
  {
    name: 'flash-sale',
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1000&auto=format&fit=crop',
    description: 'Flash sale banner with special offers'
  },
  {
    name: 'brand-festival',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    description: 'Brand festival banner with top brands'
  },
  {
    name: 'phones-banner1',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    description: 'Smartphone banner with latest phones'
  },
  {
    name: 'electronics-banner1',
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop',
    description: 'Electronics banner with gadgets'
  },
  {
    name: 'computing-banner1',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
    description: 'Computing banner with laptops'
  },
  {
    name: 'fashion-banner1',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop',
    description: 'Fashion banner with trendy clothes'
  }
]

// Product images by category
const productImages = {
  phones: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      description: 'iPhone 15'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
      description: 'Samsung Galaxy S24'
    },
    {
      name: '3',
      url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
      description: 'Google Pixel 8'
    }
  ],
  laptops: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
      description: 'MacBook Air'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop',
      description: 'HP Laptop'
    },
    {
      name: '3',
      url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
      description: 'Dell Laptop'
    }
  ],
  tvs: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop',
      description: 'Samsung TV'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=500&h=500&fit=crop',
      description: 'LG TV'
    },
    {
      name: '3',
      url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&h=500&fit=crop',
      description: 'Sony TV'
    }
  ],
  appliances: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop',
      description: 'Refrigerator'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop',
      description: 'Washing Machine'
    },
    {
      name: '3',
      url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&h=500&fit=crop',
      description: 'Air Conditioner'
    }
  ],
  fashion: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop',
      description: 'Men\'s Shirt'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop',
      description: 'Women\'s Dress'
    },
    {
      name: '3',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      description: 'Shoes'
    }
  ],
  gaming: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&h=500&fit=crop',
      description: 'Gaming Console'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&h=500&fit=crop',
      description: 'Gaming Controller'
    }
  ],
  audio: [
    {
      name: '1',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      description: 'Headphones'
    },
    {
      name: '2',
      url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
      description: 'Wireless Earbuds'
    }
  ]
}

// Download all images
async function downloadAllImages() {
  // Download banner images
  console.log('\nDownloading banner images...')
  for (const image of promoImages) {
    try {
      await downloadImage(
        image.url,
        path.join(bannersDir, `${image.name}.jpg`)
      )
      console.log(`✓ Downloaded ${image.name}`)
    } catch (error) {
      console.error(`✗ Failed to download ${image.name}:`, error.message)
    }
  }

  // Download product images
  console.log('\nDownloading product images...')
  for (const [category, images] of Object.entries(productImages)) {
    console.log(`\nDownloading ${category} images...`)
    for (const image of images) {
      try {
        await downloadImage(
          image.url,
          path.join(productsDir, category, `${image.name}.jpg`)
        )
        console.log(`✓ Downloaded ${category}/${image.name}`)
      } catch (error) {
        console.error(`✗ Failed to download ${category}/${image.name}:`, error.message)
      }
    }
  }
}

downloadAllImages() 