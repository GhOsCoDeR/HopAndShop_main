import { NextRequest, NextResponse } from 'next/server';
import dbUtils from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { tableName: string } }) {
  const tableName = params.tableName;
  
  try {
    // Validate table name
    const allowedTables = ['products', 'users', 'orders', 'order_items', 'cart'];
    if (!allowedTables.includes(tableName)) {
      return NextResponse.json({ 
        error: 'Invalid table name. Allowed tables: ' + allowedTables.join(', ')
      }, { status: 400 });
    }
    
    // Get limit parameter from query string
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    // Get data from the specified table
    const data = await dbUtils.query(`SELECT * FROM ${tableName} LIMIT ?`, [limit]);
    
    // Get column information
    const columns = await dbUtils.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'hopandshop', tableName]);
    
    return NextResponse.json({ 
      table: tableName,
      columns: columns.map((col: any) => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        fullType: col.COLUMN_TYPE,
        nullable: col.IS_NULLABLE === 'YES',
        key: col.COLUMN_KEY,
        extra: col.EXTRA,
        comment: col.COLUMN_COMMENT
      })),
      rowCount: data.length,
      rows: data
    });
  } catch (error: any) {
    console.error(`Error fetching data from table "${tableName}":`, error);
    return NextResponse.json({ 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
} 