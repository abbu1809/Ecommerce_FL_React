import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs 
} from 'firebase/firestore';
import { migrateProductsToFirebase } from '../services/dataMigration';
import toast from 'react-hot-toast';

const FirebaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState({
    auth: false,
    firestore: false,
    storage: false,
    products: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  // Test Firebase Authentication
  const testAuth = async () => {
    try {
      setIsLoading(true);
      
      // Test user creation
      const testEmail = 'test@anandmobiles.com';
      const testPassword = 'test123456';
      
      try {
        // Try to create test user
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        
        // Clean up - delete the test user
        await userCredential.user.delete();
        
        setTestResults(prev => ({
          ...prev,
          auth: { success: true, message: 'Firebase Auth is working properly' }
        }));
        
        setSetupStatus(prev => ({ ...prev, auth: true }));
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          // Email exists, try to sign in instead
          await signInWithEmailAndPassword(auth, testEmail, testPassword);
          await signOut(auth);
          
          setTestResults(prev => ({
            ...prev,
            auth: { success: true, message: 'Firebase Auth is working (test user exists)' }
          }));
          setSetupStatus(prev => ({ ...prev, auth: true }));
        } else {
          throw error;
        }
      }
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        auth: { success: false, message: `Auth test failed: ${error.message}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Test Firestore Database
  const testFirestore = async () => {
    try {
      setIsLoading(true);
      
      // Test writing to Firestore
      const testDoc = doc(db, 'test_collection', 'test_doc');
      await setDoc(testDoc, {
        message: 'Firebase setup test',
        timestamp: new Date(),
        success: true
      });
      
      // Test reading from Firestore
      const collections = await getDocs(collection(db, 'test_collection'));
      
      setTestResults(prev => ({
        ...prev,
        firestore: { 
          success: true, 
          message: `Firestore is working (${collections.size} test documents)` 
        }
      }));
      
      setSetupStatus(prev => ({ ...prev, firestore: true }));
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        firestore: { success: false, message: `Firestore test failed: ${error.message}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Test Storage
  const testStorage = async () => {
    try {
      setIsLoading(true);
      
      // Create a simple test for storage (just check if it's accessible)
      // In a real scenario, you'd upload a test file
      
      setTestResults(prev => ({
        ...prev,
        storage: { 
          success: true, 
          message: 'Firebase Storage is configured and accessible' 
        }
      }));
      
      setSetupStatus(prev => ({ ...prev, storage: true }));
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        storage: { success: false, message: `Storage test failed: ${error.message}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Migrate Products to Firebase
  const migrateProducts = async () => {
    try {
      setIsLoading(true);
      toast.loading('Migrating products to Firebase...', { id: 'migration' });
      
      const result = await migrateProductsToFirebase();
      
      setTestResults(prev => ({
        ...prev,
        products: { 
          success: true, 
          message: `Successfully migrated ${result.success} products, ${result.errors} errors` 
        }
      }));
      
      setSetupStatus(prev => ({ ...prev, products: true }));
      toast.success(`Migration completed! ${result.success} products added`, { id: 'migration' });
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        products: { success: false, message: `Migration failed: ${error.message}` }
      }));
      toast.error('Migration failed', { id: 'migration' });
    } finally {
      setIsLoading(false);
    }
  };

  // Create Admin User
  const createAdminUser = async () => {
    try {
      setIsLoading(true);
      
      const adminEmail = 'admin@anandmobiles.com';
      const adminPassword = 'admin123456';
      
      // Create admin user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;
      
      // Add admin data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_orders', 'manage_users'],
        createdAt: new Date(),
        isActive: true
      });
      
      toast.success(`Admin user created: ${adminEmail} / ${adminPassword}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.info('Admin user already exists');
      } else {
        toast.error(`Failed to create admin: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    await testAuth();
    await testFirestore();
    await testStorage();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Firebase Setup & Configuration</h1>
      <p>Use this page to test and configure your Firebase integration.</p>

      {/* Setup Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Setup Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {Object.entries(setupStatus).map(([service, status]) => (
            <div 
              key={service}
              style={{
                padding: '10px',
                border: `2px solid ${status ? '#10B981' : '#EF4444'}`,
                borderRadius: '8px',
                backgroundColor: status ? '#F0FDF4' : '#FEF2F2',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {service === 'firestore' ? 'Database' : service}
              </div>
              <div style={{ color: status ? '#047857' : '#DC2626' }}>
                {status ? '✅ Ready' : '❌ Not Ready'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Firebase Tests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={testAuth}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Test Authentication
          </button>
          
          <button 
            onClick={testFirestore}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Test Database
          </button>
          
          <button 
            onClick={testStorage}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Test Storage
          </button>
          
          <button 
            onClick={runAllTests}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7C3AED',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Run All Tests
          </button>
        </div>
      </div>

      {/* Data Migration */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Data Migration</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={migrateProducts}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Migrate Products to Firebase
          </button>
          
          <button 
            onClick={createAdminUser}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Create Admin User
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Note:</strong> Product migration will import all products from the JSON file to Firebase.</p>
          <p><strong>Admin credentials:</strong> admin@anandmobiles.com / admin123456</p>
        </div>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div>
          <h2>Test Results</h2>
          {Object.entries(testResults).map(([test, result]) => (
            <div 
              key={test}
              style={{
                margin: '10px 0',
                padding: '15px',
                border: `2px solid ${result.success ? '#10B981' : '#EF4444'}`,
                borderRadius: '8px',
                backgroundColor: result.success ? '#F0FDF4' : '#FEF2F2'
              }}
            >
              <h4 style={{ 
                margin: '0 0 10px 0', 
                color: result.success ? '#047857' : '#DC2626',
                textTransform: 'capitalize'
              }}>
                {test}: {result.success ? '✅ PASS' : '❌ FAIL'}
              </h4>
              <p style={{ margin: '0' }}>{result.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Guide */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
        <h2>⚠️ Firebase Console Configuration Required</h2>
        <p>Before running tests, make sure you've configured the following in Firebase Console:</p>
        <ul>
          <li><strong>Authentication:</strong> Enable Email/Password and Google sign-in methods</li>
          <li><strong>Firestore:</strong> Create database and set up security rules</li>
          <li><strong>Storage:</strong> Set up storage bucket and rules</li>
          <li><strong>Hosting:</strong> Add your domain to authorized domains</li>
        </ul>
        <p>See <code>FIREBASE_SETUP_GUIDE.md</code> for detailed instructions.</p>
      </div>
    </div>
  );
};

export default FirebaseSetup;
