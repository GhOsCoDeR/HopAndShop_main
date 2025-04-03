const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download an image from a URL to a file
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Ensure the directory exists
    const directory = path.dirname(filepath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Product image data with Unsplash URLs
const productImages = [
  // Phones
  {
    category: 'phones',
    product: 'iphone15pro',
    url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5'
  },
  {
    category: 'phones',
    product: 'galaxys24',
    url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd'
  },
  {
    category: 'phones',
    product: 'pixel8',
    url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97'
  },
  {
    category: 'phones',
    product: 'oneplus12',
    url: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7'
  },
  
  // Laptops
  {
    category: 'laptops',
    product: 'macbookprom3',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
  },
  {
    category: 'laptops',
    product: 'dellxps15',
    url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6'
  },
  {
    category: 'laptops',
    product: 'thinkpadx1',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'
  },
  {
    category: 'laptops',
    product: 'hpspectrex360',
    url: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f'
  },
  
  // TVs
  {
    category: 'tvs',
    product: 'oledsmarttv',
    url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6'
  },
  {
    category: 'tvs',
    product: 'qledgamingtv',
    url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1'
  },
  {
    category: 'tvs',
    product: 'miniledtv',
    url: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791'
  },
  {
    category: 'tvs',
    product: 'smartledtv',
    url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79'
  },
  
  // Appliances
  {
    category: 'appliances',
    product: 'smartrefrigerator',
    url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5'
  },
  {
    category: 'appliances',
    product: 'robotvacuum',
    url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73'
  },
  {
    category: 'appliances',
    product: 'smartwasher',
    url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1'
  },
  {
    category: 'appliances',
    product: 'smartoven',
    url: 'https://images.unsplash.com/photo-1585351923007-bf6a01cb19de'
  },
  
  // Fashion
  {
    category: 'fashion',
    product: 'designerwatch',
    url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314'
  },
  {
    category: 'fashion',
    product: 'leatherbag',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'
  },
  {
    category: 'fashion',
    product: 'sunglasses',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083'
  },
  {
    category: 'fashion',
    product: 'smartring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
  },
  
  // Furniture
  {
    category: 'furniture',
    product: 'smartsofa',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
  },
  {
    category: 'furniture',
    product: 'gamingchair',
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91'
  },
  {
    category: 'furniture',
    product: 'smartdesk',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd'
  },
  {
    category: 'furniture',
    product: 'ledbed',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'
  },
  
  // Beauty
  {
    category: 'beauty',
    product: 'smartmirror',
    url: 'https://images.unsplash.com/photo-1522338140505-bfe8927fd6d3'
  },
  {
    category: 'beauty',
    product: 'hairdryer',
    url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da'
  },
  {
    category: 'beauty',
    product: 'facemist',
    url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af'
  },
  {
    category: 'beauty',
    product: 'massagegun',
    url: 'https://images.unsplash.com/photo-1600697230063-f51e9f2d08f1'
  },
  
  // Sports
  {
    category: 'sports',
    product: 'pelotonbike',
    url: 'https://images.unsplash.com/photo-1591291621086-ffc883aa401b'
  },
  {
    category: 'sports',
    product: 'treadmill',
    url: 'https://images.unsplash.com/photo-1579364046732-c21c2177730d'
  },
  {
    category: 'sports',
    product: 'smartwatch',
    url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1'
  },
  {
    category: 'sports',
    product: 'yogamat',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a'
  }
];

// Download all images
async function downloadAllImages() {
  for (const imageData of productImages) {
    const filepath = path.join(
      process.cwd(), 
      'public', 
      'images', 
      'products', 
      imageData.category, 
      'real', 
      `${imageData.product}.jpg`
    );
    
    try {
      await downloadImage(imageData.url, filepath);
    } catch (error) {
      console.error(`Failed to download ${imageData.product}:`, error);
    }
  }
  
  console.log('All images downloaded successfully!');
}

// Run the script
downloadAllImages().catch(console.error); 