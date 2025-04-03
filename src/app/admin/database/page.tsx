'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DatabaseManagementPage() {
  const router = useRouter();
  const [isCreatingDb, setIsCreatingDb] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMigratingProducts, setIsMigratingProducts] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);

  // Create database
  const createDatabase = async () => {
    setIsCreatingDb(true);
    
    try {
      const response = await fetch('/api/init/create-db', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Database created successfully');
      } else {
        toast.error(`Failed to create database: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error creating database:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsCreatingDb(false);
    }
  };

  // Initialize database tables
  const initializeDatabase = async () => {
    setIsInitializing(true);
    
    try {
      const response = await fetch('/api/init', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Database initialized successfully');
      } else {
        toast.error(`Failed to initialize database: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error initializing database:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  // Migrate products from localStorage to MySQL
  const migrateProducts = async () => {
    setIsMigratingProducts(true);
    setMigrationResults(null);
    
    try {
      // Get products from localStorage
      const productsJson = localStorage.getItem('products');
      if (!productsJson) {
        toast.error('No products found in localStorage');
        setIsMigratingProducts(false);
        return;
      }
      
      const products = JSON.parse(productsJson);
      
      // Send products to migration API
      const response = await fetch('/api/migration/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      });
      
      if (response.ok) {
        const results = await response.json();
        setMigrationResults(results);
        toast.success(`Migration completed: ${results.success} succeeded, ${results.failed} failed`);
      } else {
        const errorData = await response.json();
        toast.error(`Migration failed: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error migrating products:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsMigratingProducts(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Management</h1>
        <div className="space-x-3">
          <Link 
            href="/admin/database/view" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            View Database Contents
          </Link>
          <Link 
            href="/admin/database/explorer" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Advanced Explorer
          </Link>
        </div>
      </div>
      
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Step 1: Create Database</h2>
        <p className="mb-4 text-gray-600">
          This will create the MySQL database if it doesn't already exist. Run this first.
        </p>
        <button
          onClick={createDatabase}
          disabled={isCreatingDb}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
        >
          {isCreatingDb ? 'Creating Database...' : 'Create Database'}
        </button>
      </div>
      
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Step 2: Initialize Tables</h2>
        <p className="mb-4 text-gray-600">
          This will create all necessary tables in your MySQL database. Run this after creating the database.
        </p>
        <button
          onClick={initializeDatabase}
          disabled={isInitializing}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-purple-300"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Tables'}
        </button>
      </div>
      
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Step 3: Migrate Products</h2>
        <p className="mb-4 text-gray-600">
          This will migrate all products from your browser's localStorage to the MySQL database.
        </p>
        <button
          onClick={migrateProducts}
          disabled={isMigratingProducts}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-green-300"
        >
          {isMigratingProducts ? 'Migrating...' : 'Migrate Products from LocalStorage'}
        </button>
        
        {migrationResults && (
          <div className="mt-4 p-4 border border-gray-200 rounded">
            <h3 className="font-semibold mb-2">Migration Results</h3>
            <p>Total: {migrationResults.total}</p>
            <p className="text-green-600">Success: {migrationResults.success}</p>
            <p className="text-red-600">Failed: {migrationResults.failed}</p>
            
            {migrationResults.failed > 0 && (
              <div className="mt-2">
                <h4 className="font-medium">Errors:</h4>
                <ul className="list-disc pl-5 mt-1">
                  {migrationResults.errors.map((error: any, index: number) => (
                    <li key={index} className="text-sm text-red-500">
                      Product ID {error.id}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 