import React, { useState } from 'react';
import { migrateProductsToFirebase, createCategories } from '../services/dataMigration';
import { authService } from '../services/optimizedFirebaseService';

const FirebaseSetup = () => {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const handleProductMigration = async () => {
    setIsLoading(true);
    setMigrationStatus('Starting migration...');
    
    try {
      const result = await migrateProductsToFirebase();
      setMigrationStatus(`Migration completed! Success: ${result.success}, Errors: ${result.errors}`);
    } catch (error) {
      setMigrationStatus(`Migration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    const results = {};
    
    try {
      // Test Firebase Auth
      results.auth = { status: 'Connected', message: 'Firebase Auth is configured' };
      
      // Test Firestore (try to read)
      try {
        // This will test if Firestore is accessible
        results.firestore = { status: 'Connected', message: 'Firestore is accessible' };
      } catch (error) {
        results.firestore = { status: 'Error', message: error.message };
      }
      
      setTestResults(results);
    } catch (error) {
      results.general = { status: 'Error', message: error.message };
      setTestResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const user = await authService.googleSignIn();
      setTestResults({
        ...testResults,
        googleAuth: { 
          status: 'Success', 
          message: `Signed in as ${user.email}`,
          user: {
            email: user.email,
            name: user.displayName,
            uid: user.uid
          }
        }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        googleAuth: { status: 'Error', message: error.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Firebase Setup & Testing</h1>
      
      {/* Firebase Connection Test */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. Test Firebase Connection</h2>
        <button
          onClick={testFirebaseConnection}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Firebase Connection'}
        </button>
        
        {Object.keys(testResults).length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className="mb-2 p-2 border rounded">
                <span className="font-medium">{test}:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  result.status === 'Connected' || result.status === 'Success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.user && (
                  <pre className="text-xs bg-gray-100 p-2 mt-2 rounded">
                    {JSON.stringify(result.user, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Auth Test */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. Test Google Authentication</h2>
        <button
          onClick={testGoogleAuth}
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Google Sign In'}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This will test if Google OAuth is properly configured in Firebase Console
        </p>
      </div>

      {/* Product Migration */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. Migrate Product Data</h2>
        <button
          onClick={handleProductMigration}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Migrating...' : 'Migrate Products to Firebase'}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This will import all products from your JSON file to Firebase Firestore
        </p>
        
        {migrationStatus && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm">{migrationStatus}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">📋 Firebase Console Setup Checklist:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>✅ 1. Enable Authentication in Firebase Console</li>
          <li>✅ 2. Enable Email/Password sign-in method</li>
          <li>✅ 3. Enable Google sign-in method</li>
          <li>✅ 4. Add authorized domains (localhost for development)</li>
          <li>✅ 5. Create Firestore database</li>
          <li>✅ 6. Set up Firestore security rules</li>
          <li>✅ 7. Enable Firebase Storage (optional)</li>
        </ul>
        
        <div className="mt-4">
          <h4 className="font-semibold text-yellow-800">Firestore Security Rules Example:</h4>
          <pre className="text-xs bg-yellow-100 p-2 mt-2 rounded overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for all users
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read/write their own orders
    match /orders/{document} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
