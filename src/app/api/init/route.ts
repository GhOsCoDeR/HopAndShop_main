import { NextRequest, NextResponse } from 'next/server';
import dbUtils from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Check if database connection is available
    const pool = dbUtils.getPool();
    if (!pool) {
      return NextResponse.json({
        error: 'Database connection not available. Check your MySQL connection settings.',
        checkpoints: {
          'DB_HOST': process.env.DB_HOST || 'localhost',
          'DB_USER': process.env.DB_USER || 'root',
          'DB_NAME': process.env.DB_NAME || 'hopandshop',
          'DB_PORT': process.env.DB_PORT || '3306',
        }
      }, { status: 500 });
    }
    
    // Initialize the database tables
    await dbUtils.initializeDatabase();
    
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'hopandshop',
        port: process.env.DB_PORT || '3306',
      } 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      code: error.code
    }, { status: 500 });
  }
} 