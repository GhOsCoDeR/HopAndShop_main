import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const paths = request.nextUrl.searchParams.get('path')?.split(',') || ['/']
    
    // Revalidate all requested paths
    paths.forEach(path => {
      revalidatePath(path)
    })

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths
    })
  } catch (err) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      error: 'Error revalidating'
    }, { status: 500 })
  }
} 