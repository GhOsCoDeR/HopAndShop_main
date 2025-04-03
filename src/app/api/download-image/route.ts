import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import https from 'https'

// Function to download an image from a URL to a file
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Ensure the directory exists
    const directory = path.dirname(filepath)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    const file = fs.createWriteStream(filepath)
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
        return
      }

      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete the file on error
      reject(err)
    })
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  const category = searchParams.get('category')
  const productName = searchParams.get('product')
  
  if (!imageUrl || !category || !productName) {
    return NextResponse.json({ 
      error: 'Missing parameters. Required: url, category, product' 
    }, { status: 400 })
  }

  try {
    const filepath = path.join(process.cwd(), 'public', 'images', 'products', category, 'real', `${productName}.jpg`)
    await downloadImage(imageUrl, filepath)
    
    return NextResponse.json({ 
      success: true, 
      filepath: filepath,
      publicUrl: `/images/products/${category}/real/${productName}.jpg`
    })
  } catch (error) {
    console.error('Error downloading image:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
} 