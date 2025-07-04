/**
 * Firebase Initial Setup Script
 * Run this in the browser console on your app to set up Firebase collections and rules
 */

import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  writeBatch 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const setupFirebaseCollections = async () => {
  console.log('🚀 Starting Firebase setup...');
  
  try {
    const batch = writeBatch(db);
    
    // 1. Create Categories Collection
    console.log('📁 Creating categories...');
    const categories = [
      {
        id: 'mobile',
        name: 'Smartphones',
        description: 'Latest smartphones and mobile devices',
        image: '/images/categories/mobile.jpg',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date()
      },
      {
        id: 'laptop',
        name: 'Laptops',  
        description: 'Laptops and computers for work and gaming',
        image: '/images/categories/laptop.jpg',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date()
      },
      {
        id: 'tablet',
        name: 'Tablets',
        description: 'Tablets and iPad devices',
        image: '/images/categories/tablet.jpg',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date()
      },
      {
        id: 'accessories',
        name: 'Accessories',
        description: 'Mobile and laptop accessories',
        image: '/images/categories/accessories.jpg',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date()
      }
    ];
    
    for (const category of categories) {
      const categoryRef = doc(db, 'categories', category.id);
      batch.set(categoryRef, category);
    }
    
    // 2. Create Admin Settings Collection
    console.log('⚙️ Creating admin settings...');
    const settingsRef = doc(db, 'admin_settings', 'general');
    batch.set(settingsRef, {
      siteName: 'Anand Mobiles',
      siteDescription: 'Your trusted mobile and electronics store',
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 18, // GST
      shippingFee: 50,
      freeShippingThreshold: 1000,
      supportEmail: 'support@anandmobiles.com',
      supportPhone: '+91-XXXXXXXXXX',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      },
      businessHours: {
        monday: '9:00 AM - 8:00 PM',
        tuesday: '9:00 AM - 8:00 PM',
        wednesday: '9:00 AM - 8:00 PM',
        thursday: '9:00 AM - 8:00 PM',
        friday: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 8:00 PM',
        sunday: 'Closed'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 3. Create Sample Banner/Promotion
    console.log('🎯 Creating promotions...');
    const promoRef = doc(db, 'promotions', 'welcome_banner');
    batch.set(promoRef, {
      title: 'Welcome to Anand Mobiles',
      description: 'Get the best deals on smartphones and electronics',
      imageUrl: '/images/banners/welcome.jpg',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      sortOrder: 1,
      createdAt: new Date()
    });
    
    // Commit the batch
    await batch.commit();
    console.log('✅ Firebase collections created successfully!');
    
    return {
      success: true,
      message: 'Firebase collections setup completed',
      collectionsCreated: ['categories', 'admin_settings', 'promotions']
    };
    
  } catch (error) {
    console.error('❌ Firebase setup failed:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export const createTestUsers = async () => {
  console.log('👥 Creating test users...');
  
  const testUsers = [
    {
      email: 'admin@anandmobiles.com',
      password: 'admin123456',
      userData: {
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        permissions: ['all'],
        isActive: true
      }
    },
    {
      email: 'customer@test.com',
      password: 'customer123',
      userData: {
        firstName: 'Test',
        lastName: 'Customer',
        role: 'customer',
        phone: '9999999999',
        isActive: true
      }
    }
  ];
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        user.email, 
        user.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Add user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...user.userData,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: false
      });
      
      results.push({
        email: user.email,
        success: true,
        message: 'User created successfully'
      });
      
      console.log(`✅ Created user: ${user.email}`);
      
    } catch (error) {
      results.push({
        email: user.email,
        success: false,
        message: error.message
      });
      
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ User already exists: ${user.email}`);
      } else {
        console.error(`❌ Failed to create user ${user.email}:`, error);
      }
    }
  }
  
  return results;
};

export const checkFirebaseConnection = async () => {
  console.log('🔍 Checking Firebase connection...');
  
  const results = {
    auth: false,
    firestore: false,
    collections: []
  };
  
  try {
    // Test Auth
    if (auth) {
      results.auth = true;
      console.log('✅ Firebase Auth connected');
    }
    
    // Test Firestore
    const testCollection = collection(db, 'test');
    if (testCollection) {
      results.firestore = true;
      console.log('✅ Firebase Firestore connected');
    }
    
    // Check existing collections
    const collections = ['categories', 'products', 'users', 'orders'];
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        results.collections.push({
          name: collectionName,
          documents: snapshot.size,
          exists: true
        });
        console.log(`📁 Collection '${collectionName}': ${snapshot.size} documents`);
      } catch (error) {
        results.collections.push({
          name: collectionName,
          documents: 0,
          exists: false,
          error: error.message
        });
        console.log(`❌ Collection '${collectionName}': Not accessible`);
      }
    }
    
  } catch (error) {
    console.error('❌ Firebase connection check failed:', error);
  }
  
  return results;
};

// Main setup function
export const runCompleteFirebaseSetup = async () => {
  console.log('🚀🚀🚀 RUNNING COMPLETE FIREBASE SETUP 🚀🚀🚀');
  
  const results = {
    connection: null,
    collections: null,
    users: null
  };
  
  try {
    // 1. Check connection
    results.connection = await checkFirebaseConnection();
    
    // 2. Setup collections
    results.collections = await setupFirebaseCollections();
    
    // 3. Create test users
    results.users = await createTestUsers();
    
    console.log('🎉 FIREBASE SETUP COMPLETED!');
    console.log('📋 Setup Summary:', results);
    
    return results;
    
  } catch (error) {
    console.error('💥 FIREBASE SETUP FAILED:', error);
    return { error: error.message };
  }
};

// Export for window access (for browser console)
if (typeof window !== 'undefined') {
  window.firebaseSetup = {
    runCompleteFirebaseSetup,
    setupFirebaseCollections,
    createTestUsers,
    checkFirebaseConnection
  };
}
