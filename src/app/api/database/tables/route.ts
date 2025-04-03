import { NextRequest, NextResponse } from 'next/server';
import dbUtils from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const dbName = process.env.DB_NAME || 'hopandshop';
    
    // Query to get all tables in the database
    const tables = await dbUtils.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
      ORDER BY table_name
    `, [dbName]);
    
    return NextResponse.json({ 
      tables: tables.map((t: any) => t.TABLE_NAME || t.table_name)
    });
  } catch (error: any) {
    console.error('Error fetching database tables:', error);
    return NextResponse.json({ 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
} 