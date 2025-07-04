import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, auth, provider, storage } from "../firebase";

// Auth Services
export const authService = {
  // Register with email/password
  register: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        ...userData,
        createdAt: new Date(),
        role: "customer"
      });
      
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Login with email/password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Google Sign In
  googleSignIn: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not create profile
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          role: "customer",
          authProvider: "google"
        });
      }
      
      return user;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  },

  // Logout
  logout: () => signOut(auth),

  // Auth state observer
  onAuthStateChange: (callback) => onAuthStateChanged(auth, callback),

  // Get current user
  getCurrentUser: () => auth.currentUser
};

// Product Services
export const productService = {
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      let q = collection(db, "products");
      
      // Apply filters
      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }
      if (filters.brand) {
        q = query(q, where("brand", "==", filters.brand));
      }
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Add new product (admin)
  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  // Update product (admin)
  updateProduct: async (id, updates) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
};

// Order Services
export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: new Date(),
        status: "pending"
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
};

// User Profile Services
export const userService = {
  // Get user profile
  getUserProfile: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid, profileData) => {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
};

// Storage Services
export const storageService = {
  // Upload file
  uploadFile: async (file, path) => {
    try {
      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // Delete file
  deleteFile: async (path) => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
};

// Real-time listeners
export const realtimeService = {
  // Listen to products
  listenToProducts: (callback, filters = {}) => {
    let q = collection(db, "products");
    
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }
    
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(products);
    });
  },

  // Listen to user orders
  listenToUserOrders: (userId, callback) => {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(orders);
    });
  }
};
