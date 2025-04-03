import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { writeFile, readFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const isCSVUpload = !!file

    if (isCSVUpload) {
      // Handle CSV upload
      const buffer = await file.arrayBuffer()
      const content = new TextDecoder().decode(buffer)
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true
      })

      if (!records || records.length === 0) {
        return NextResponse.json(
          { error: 'No valid records found in CSV file' },
          { status: 400 }
        )
      }

      const products = records.map((record: any, index: number) => ({
        id: record.id || String(Math.random().toString(36).substr(2, 9)),
        name: record.name || '',
        description: record.description || '',
        price: parseFloat(record.price) || 0,
        discount: parseFloat(record.discount) || 0,
        image: record.image || '/images/placeholder.jpg',
        category: record.category || 'Uncategorized',
        brand: record.brand || 'Unknown',
        rating: parseFloat(record.rating) || 0,
        stock: parseInt(record.stock) || 0,
        status: record.status || 'active'
      }))

      await saveProducts(products)
      return NextResponse.json({
        message: 'Products uploaded successfully',
        count: products.length
      })
    } else {
      // Handle individual product submission
      const imageFile = formData.get('image') as File
      let imageUrl = '/images/placeholder.jpg'

      if (imageFile) {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        try {
          await mkdir(uploadsDir, { recursive: true })
        } catch (error) {
          console.error('Error creating uploads directory:', error)
        }

        // Save the image file
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const fileName = `${Date.now()}-${imageFile.name}`
        const filePath = path.join(uploadsDir, fileName)
        await writeFile(filePath, buffer)
        imageUrl = `/uploads/${fileName}`
      }

      const product = {
        id: String(Math.random().toString(36).substr(2, 9)),
        name: formData.get('name') as string || '',
        description: formData.get('description') as string || '',
        price: parseFloat(formData.get('price') as string) || 0,
        discount: parseFloat(formData.get('discount') as string) || 0,
        image: imageUrl,
        category: formData.get('category') as string || 'Uncategorized',
        brand: formData.get('brand') as string || 'Unknown',
        rating: 0,
        stock: parseInt(formData.get('stock') as string) || 0,
        status: (formData.get('status') as string) || 'active'
      }

      // Read existing products
      const dataPath = path.join(process.cwd(), 'public', 'data', 'products.json')
      let existingProducts = []
      try {
        const fileContent = await readFile(dataPath, 'utf-8')
        existingProducts = JSON.parse(fileContent)
      } catch (error) {
        // If file doesn't exist or is invalid, start with empty array
        existingProducts = []
      }

      // Add new product
      existingProducts.push(product)

      // Save updated products
      await saveProducts(existingProducts)

      return NextResponse.json({
        message: 'Product added successfully',
        product
      })
    }
  } catch (error: any) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const id = formData.get('id') as string
    const imageFile = formData.get('image') as File
    let imageUrl = formData.get('currentImage') as string || '/images/placeholder.jpg'

    if (imageFile) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        console.error('Error creating uploads directory:', error)
      }

      // Save the new image file
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const fileName = `${Date.now()}-${imageFile.name}`
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      imageUrl = `/uploads/${fileName}`

      // Delete old image if it exists and is not the placeholder
      const oldImagePath = path.join(process.cwd(), 'public', formData.get('currentImage') as string)
      const currentImage = formData.get('currentImage') as string
      if (currentImage && !currentImage.includes('placeholder')) {
        try {
          await unlink(oldImagePath)
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }
    }

    const updatedProduct = {
      id,
      name: formData.get('name') as string || '',
      description: formData.get('description') as string || '',
      price: parseFloat(formData.get('price') as string) || 0,
      discount: parseFloat(formData.get('discount') as string) || 0,
      image: imageUrl,
      category: formData.get('category') as string || 'Uncategorized',
      brand: formData.get('brand') as string || 'Unknown',
      rating: 0,
      stock: parseInt(formData.get('stock') as string) || 0,
      status: (formData.get('status') as string) || 'active'
    }

    // Read existing products
    const dataPath = path.join(process.cwd(), 'public', 'data', 'products.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const products = JSON.parse(fileContent)

    // Update the product
    const index = products.findIndex((p: any) => p.id === id)
    if (index !== -1) {
      products[index] = updatedProduct
      await saveProducts(products)
      return NextResponse.json({
        message: 'Product updated successfully',
        product: updatedProduct
      })
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Read existing products
    const dataPath = path.join(process.cwd(), 'public', 'data', 'products.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const products = JSON.parse(fileContent)

    // Find the product to delete
    const product = products.find((p: any) => p.id === id)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete the product's image if it exists and is not the placeholder
    if (product.image && !product.image.includes('placeholder')) {
      const imagePath = path.join(process.cwd(), 'public', product.image)
      try {
        await unlink(imagePath)
      } catch (error) {
        console.error('Error deleting product image:', error)
      }
    }

    // Remove the product from the array
    const updatedProducts = products.filter((p: any) => p.id !== id)
    await saveProducts(updatedProducts)

    return NextResponse.json({
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

async function saveProducts(products: any[]) {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'products.json')
  await writeFile(dataPath, JSON.stringify(products, null, 2))
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'products.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const products = JSON.parse(fileContent)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json([])
  }
} 