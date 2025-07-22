/**
 * 🗑️ Firebase User Data Deletion Utility
 * Comprehensive tool for deleting user data from Firebase Auth and Firestore
 */

import { doc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';

/**
 * Delete complete user data from Firebase
 * @param {string} userEmail - Email of the user to delete
 * @param {boolean} includeAuthUser - Whether to delete Firebase Auth user
 * @returns {Promise<Object>} Result object with success status
 */
export const deleteCompleteUserData = async (userEmail, includeAuthUser = false) => {
  try {
    console.log(`🗑️ Starting deletion process for: ${userEmail}`);
    const batch = writeBatch(db);
    let deletedItems = {
      users: 0,
      orders: 0,
      cart_items: 0,
      wishlist: 0,
      reviews: 0,
      addresses: 0,
      other: 0
    };
    
    // 1. Find and delete user documents in users collection
    console.log('📝 Searching for user documents...');
    const usersQuery = query(collection(db, 'users'), where('email', '==', userEmail));
    const userDocs = await getDocs(usersQuery);
    
    let userId = null;
    userDocs.forEach((userDoc) => {
      userId = userDoc.data().uid || userDoc.id;
      batch.delete(userDoc.ref);
      deletedItems.users++;
      console.log(`   ✅ Marked user document for deletion: ${userDoc.id}`);
    });
    
    // 2. Delete data associated with email
    const emailCollections = [
      'orders',
      'cart_items', 
      'wishlist',
      'reviews',
      'support_tickets',
      'invoices'
    ];
    
    for (const collectionName of emailCollections) {
      console.log(`📝 Searching ${collectionName} by email...`);
      const emailQuery = query(
        collection(db, collectionName), 
        where('userEmail', '==', userEmail)
      );
      const emailDocs = await getDocs(emailQuery);
      
      emailDocs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedItems[collectionName] = (deletedItems[collectionName] || 0) + 1;
        console.log(`   ✅ Marked ${collectionName} document for deletion: ${doc.id}`);
      });
    }
    
    // 3. Delete data associated with userId (if found)
    if (userId) {
      const userIdCollections = [
        'orders',
        'cart_items',
        'wishlist', 
        'reviews',
        'addresses'
      ];
      
      for (const collectionName of userIdCollections) {
        console.log(`📝 Searching ${collectionName} by userId...`);
        const userIdQuery = query(
          collection(db, collectionName), 
          where('userId', '==', userId)
        );
        const userIdDocs = await getDocs(userIdQuery);
        
        userIdDocs.forEach((doc) => {
          batch.delete(doc.ref);
          deletedItems[collectionName] = (deletedItems[collectionName] || 0) + 1;
          console.log(`   ✅ Marked ${collectionName} document for deletion: ${doc.id}`);
        });
      }
      
      // 4. Delete user subcollections
      const subCollections = ['addresses', 'invoices', 'notifications'];
      for (const subCol of subCollections) {
        console.log(`📝 Searching user subcollection: ${subCol}...`);
        try {
          const subCollectionRef = collection(db, 'users', userId, subCol);
          const subDocs = await getDocs(subCollectionRef);
          
          subDocs.forEach((doc) => {
            batch.delete(doc.ref);
            deletedItems.other++;
            console.log(`   ✅ Marked subcollection document for deletion: ${subCol}/${doc.id}`);
          });
        } catch {
          console.log(`   ⚠️ Subcollection ${subCol} not found or empty`);
        }
      }
    }
    
    // 5. Commit all Firestore deletions
    console.log('🔥 Executing Firestore deletions...');
    await batch.commit();
    console.log('✅ All Firestore data deleted successfully');
    
    // 6. Delete Firebase Auth user (optional)
    if (includeAuthUser) {
      console.log('🔐 Attempting to delete Firebase Auth user...');
      if (auth.currentUser && auth.currentUser.email === userEmail) {
        await deleteUser(auth.currentUser);
        console.log('✅ Firebase Auth user deleted');
      } else {
        console.log('⚠️ User not currently signed in - Auth user not deleted');
        console.log('   Manual deletion required in Firebase Console');
      }
    }
    
    // 7. Generate summary
    const totalDeleted = Object.values(deletedItems).reduce((sum, count) => sum + count, 0);
    
    return {
      success: true,
      message: `Successfully deleted ${totalDeleted} documents for ${userEmail}`,
      details: deletedItems,
      userEmail,
      userId,
      authUserDeleted: includeAuthUser && auth.currentUser?.email === userEmail
    };
    
  } catch (error) {
    console.error('❌ Error deleting user data:', error);
    return {
      success: false,
      error: error.message,
      userEmail
    };
  }
};

/**
 * Delete only Firestore user data (keep Auth user)
 * @param {string} userEmail - Email of the user
 * @returns {Promise<Object>} Result object
 */
export const deleteFirestoreUserData = async (userEmail) => {
  return deleteCompleteUserData(userEmail, false);
};

/**
 * Delete everything including Auth user
 * @param {string} userEmail - Email of the user
 * @returns {Promise<Object>} Result object
 */
export const deleteEverything = async (userEmail) => {
  return deleteCompleteUserData(userEmail, true);
};

/**
 * List all data associated with a user (preview before deletion)
 * @param {string} userEmail - Email of the user
 * @returns {Promise<Object>} Data summary
 */
export const previewUserData = async (userEmail) => {
  try {
    console.log(`🔍 Previewing data for: ${userEmail}`);
    const preview = {
      users: [],
      orders: [],
      cart_items: [],
      wishlist: [],
      reviews: [],
      addresses: [],
      other: []
    };
    
    // Search in users collection
    const usersQuery = query(collection(db, 'users'), where('email', '==', userEmail));
    const userDocs = await getDocs(usersQuery);
    userDocs.forEach((doc) => {
      preview.users.push({ id: doc.id, ...doc.data() });
    });
    
    // Search in other collections by email
    const collections = ['orders', 'cart_items', 'wishlist', 'reviews'];
    for (const collectionName of collections) {
      const emailQuery = query(
        collection(db, collectionName), 
        where('userEmail', '==', userEmail)
      );
      const docs = await getDocs(emailQuery);
      docs.forEach((doc) => {
        preview[collectionName].push({ id: doc.id, ...doc.data() });
      });
    }
    
    // Calculate totals
    const totals = {};
    Object.keys(preview).forEach(key => {
      totals[key] = preview[key].length;
    });
    
    return {
      success: true,
      userEmail,
      preview,
      totals,
      totalDocuments: Object.values(totals).reduce((sum, count) => sum + count, 0)
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      userEmail
    };
  }
};

/**
 * Delete user data by Firebase UID
 * @param {string} userId - Firebase UID
 * @returns {Promise<Object>} Result object
 */
export const deleteUserDataByUID = async (userId) => {
  try {
    console.log(`🗑️ Deleting data for UID: ${userId}`);
    const batch = writeBatch(db);
    let deletedItems = { users: 0, orders: 0, cart_items: 0, wishlist: 0, other: 0 };
    
    // Delete user document
    const userDocRef = doc(db, 'users', userId);
    batch.delete(userDocRef);
    deletedItems.users++;
    
    // Delete associated data
    const collections = ['orders', 'cart_items', 'wishlist', 'reviews', 'addresses'];
    for (const collectionName of collections) {
      const userQuery = query(
        collection(db, collectionName), 
        where('userId', '==', userId)
      );
      const docs = await getDocs(userQuery);
      docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedItems[collectionName] = (deletedItems[collectionName] || 0) + 1;
      });
    }
    
    await batch.commit();
    
    return {
      success: true,
      message: `Deleted data for UID: ${userId}`,
      details: deletedItems,
      userId
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      userId
    };
  }
};

// Export utility functions for browser console usage
if (typeof window !== 'undefined') {
  window.firebaseUserDeletion = {
    deleteCompleteUserData,
    deleteFirestoreUserData,
    deleteEverything,
    previewUserData,
    deleteUserDataByUID
  };
  
  console.log('🗑️ Firebase User Deletion Utilities loaded');
  console.log('Usage examples:');
  console.log('  window.firebaseUserDeletion.previewUserData("user@example.com")');
  console.log('  window.firebaseUserDeletion.deleteFirestoreUserData("user@example.com")');
  console.log('  window.firebaseUserDeletion.deleteEverything("user@example.com")');
}

export default {
  deleteCompleteUserData,
  deleteFirestoreUserData,
  deleteEverything,
  previewUserData,
  deleteUserDataByUID
};
