'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DatabaseExplorerPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  const [fixingImages, setFixingImages] = useState(false);
  
  // Fetch the list of tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/database/tables');
        
        if (!response.ok) {
          throw new Error('Failed to fetch database tables');
        }
        
        const data = await response.json();
        setTables(data.tables);
        
        // Auto-select the first table if available
        if (data.tables && data.tables.length > 0) {
          setSelectedTable(data.tables[0]);
        }
      } catch (error: any) {
        console.error('Error fetching tables:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTables();
  }, []);
  
  // Fetch table data when a table is selected
  useEffect(() => {
    if (!selectedTable) return;
    
    const fetchTableData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/database/tables/${selectedTable}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data from table "${selectedTable}"`);
        }
        
        const data = await response.json();
        setTableData(data);
      } catch (error: any) {
        console.error('Error fetching table data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTableData();
  }, [selectedTable]);
  
  // Handle image load error
  const handleImageError = (imageUrl: string) => {
    setImageStatus(prev => ({
      ...prev,
      [imageUrl]: 'error'
    }));
  };

  // Handle image load success
  const handleImageLoad = (imageUrl: string) => {
    setImageStatus(prev => ({
      ...prev,
      [imageUrl]: 'loaded'
    }));
  };

  // Helper function to render different cell content based on data type
  const renderCellContent = (value: any, dataType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">NULL</span>;
    }
    
    // Format booleans
    if (dataType === 'tinyint' && (value === 0 || value === 1 || value === true || value === false)) {
      return (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'TRUE' : 'FALSE'}
        </span>
      );
    }
    
    // Format numbers and currency
    if ((dataType === 'decimal' || dataType === 'float' || dataType === 'double') && typeof value === 'number') {
      return value.toFixed(2);
    }
    
    // Format dates
    if (dataType === 'datetime' || dataType === 'timestamp') {
      try {
        return new Date(value).toLocaleString();
      } catch (error) {
        return value;
      }
    }
    
    // Format text
    if (typeof value === 'string' && value.length > 100) {
      return `${value.substring(0, 100)}...`;
    }
    
    // Format images
    if (typeof value === 'string' && (
      (value.startsWith('http') || value.startsWith('/')) && 
      (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png') || 
       value.endsWith('.gif') || value.endsWith('.webp') || 
       value.includes('cloudinary') || value.includes('amazonaws') || 
       value.includes('unsplash'))
    )) {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
          {imageStatus[value] !== 'error' ? (
            <img 
              src={value} 
              alt="Image" 
              className="w-12 h-12 object-contain"
              loading="lazy"
              onLoad={() => handleImageLoad(value)}
              onError={() => handleImageError(value)}
              style={{ display: imageStatus[value] === 'loaded' ? 'block' : 'none' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-xs text-gray-500">
              No Image
            </div>
          )}
          {!imageStatus[value] && (
            <div className="w-full h-full animate-pulse bg-gray-200"></div>
          )}
        </div>
      );
    }
    
    // Default rendering
    return String(value);
  };

  // Function to sync images from localStorage (homepage products)
  const syncImagesFromHomepage = async () => {
    if (fixingImages) return;
    
    try {
      setFixingImages(true);
      
      // Step 1: Check if localStorage has products
      let localStorageProducts;
      try {
        localStorageProducts = localStorage.getItem('products');
        
        if (!localStorageProducts) {
          alert('No products found in localStorage! Please visit the homepage first to load products.');
          setFixingImages(false);
          return;
        }
        
        // Try parsing it to ensure it's valid JSON
        JSON.parse(localStorageProducts);
      } catch (err) {
        alert('Invalid product data in localStorage. Please visit the homepage to reload products.');
        setFixingImages(false);
        return;
      }
      
      // Step 2: Send localStorage data to the API to update database images
      try {
        const encodedData = encodeURIComponent(localStorageProducts);
        const response = await fetch(`/api/utils/fix-images?localStorage=${encodedData}`);
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(`Error: ${data.error || 'Failed to sync images'}\n${data.suggestion || ''}`);
          setFixingImages(false);
          return;
        }
        
        // Step 3: Reload the table data if we're on the products table
        if (selectedTable === 'products') {
          const tableResponse = await fetch(`/api/database/tables/${selectedTable}`);
          if (tableResponse.ok) {
            const refreshedData = await tableResponse.json();
            setTableData(refreshedData);
            // Reset image loading states
            setImageStatus({});
          }
        }
        
        if (data.updated === 0) {
          alert('Notice: No products were updated. This might be because product names don\'t match between your homepage and database.');
        } else {
          alert(`Success: ${data.message}`);
        }
      } catch (fetchError: any) {
        console.error('Network error:', fetchError);
        alert(`Network error: ${fetchError.message}. Please check your connection and try again.`);
      }
    } catch (error: any) {
      console.error('Error syncing images:', error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setFixingImages(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Explorer</h1>
        <div className="flex gap-2">
          <button
            onClick={syncImagesFromHomepage}
            disabled={fixingImages}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-green-300"
          >
            {fixingImages ? 'Syncing Images...' : 'Sync Images from Homepage'}
          </button>
          <Link 
            href="/admin/database" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Back to Database Management
          </Link>
        </div>
      </div>
      
      {loading && !tableData ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span>Loading database information...</span>
        </div>
      ) : error && !tableData ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Error loading database</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex space-x-6">
          {/* Table List Sidebar */}
          <div className="w-64 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Database Tables</h2>
            <ul className="space-y-2">
              {tables.map((table) => (
                <li key={table}>
                  <button
                    onClick={() => setSelectedTable(table)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedTable === table
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {table}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Table Data View */}
          <div className="flex-1">
            {tableData ? (
              <div>
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                  <h2 className="text-xl font-semibold">{tableData.table}</h2>
                  <p className="text-gray-600 mt-1">{tableData.rowCount} records found</p>
                </div>
                
                {/* Table Schema */}
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                  <h3 className="text-lg font-semibold mb-3">Table Schema</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Column Name</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nullable</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Key</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Extra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tableData.columns.map((column: any) => (
                          <tr key={column.name} className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm font-medium">{column.name}</td>
                            <td className="py-2 px-3 text-sm">{column.fullType}</td>
                            <td className="py-2 px-3 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${column.nullable ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {column.nullable ? 'NULL' : 'NOT NULL'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-sm">
                              {column.key === 'PRI' && <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-purple-100 text-purple-800">PRIMARY</span>}
                              {column.key === 'MUL' && <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-indigo-100 text-indigo-800">FOREIGN</span>}
                              {column.key === 'UNI' && <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-green-100 text-green-800">UNIQUE</span>}
                              {!column.key && '-'}
                            </td>
                            <td className="py-2 px-3 text-sm">{column.extra || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Table Data */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Table Data</h3>
                  <div className="overflow-x-auto">
                    {tableData.rows.length === 0 ? (
                      <p className="text-gray-500 py-4">No data in this table</p>
                    ) : (
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {tableData.columns.map((column: any) => (
                              <th 
                                key={column.name}
                                className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                              >
                                {column.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tableData.rows.map((row: any, rowIndex: number) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {tableData.columns.map((column: any) => (
                                <td key={`${rowIndex}-${column.name}`} className="py-2 px-3 text-sm">
                                  {renderCellContent(row[column.name], column.type)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                {loading ? (
                  <div>
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                    <p>Loading table data...</p>
                  </div>
                ) : tables.length > 0 ? (
                  <p>Select a table to view its data</p>
                ) : (
                  <p>No tables found in database</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 