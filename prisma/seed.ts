import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.8,
    reviews: 128,
    stock: 50
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking features',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.6,
    reviews: 89,
    stock: 30
  },
  {
    name: 'Professional Camera Kit',
    description: 'Complete camera kit for professional photography',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.9,
    reviews: 45,
    stock: 15
  },
  {
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics',
    price: 1999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.7,
    reviews: 67,
    stock: 20
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse for comfortable use',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.5,
    reviews: 156,
    stock: 100
  },
  {
    name: 'Smart Home Hub',
    description: 'Control your smart home devices with ease',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.4,
    reviews: 92,
    stock: 40
  },
  {
    name: 'Tablet Pro',
    description: 'Powerful tablet for work and entertainment',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.6,
    reviews: 78,
    stock: 25
  },
  {
    name: 'Wireless Keyboard',
    description: 'Mechanical wireless keyboard for typing comfort',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.7,
    reviews: 112,
    stock: 60
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  
  // Clear existing products
  await prisma.product.deleteMany()
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 