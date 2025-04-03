import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const PLACEHOLDER_SVG = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f3f4f6"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
    No Image Available
  </text>
</svg>
`

async function main() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(imagesDir, { recursive: true })
    
    const placeholderPath = path.join(imagesDir, 'placeholder.svg')
    await writeFile(placeholderPath, PLACEHOLDER_SVG)
    console.log('Created placeholder image')
  } catch (error) {
    console.error('Error creating placeholder image:', error)
  }
}

main() 