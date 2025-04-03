import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req: NextRequest) {
  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT || '3306')
    });
    
    // Create the database if it doesn't exist
    const dbName = process.env.DB_NAME || 'hopandshop';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    await connection.end();
    
    return NextResponse.json({ 
      message: `Database '${dbName}' created successfully`,
      dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        port: process.env.DB_PORT || '3306',
      } 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating database:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      code: error.code
    }, { status: 500 });
  }
} 