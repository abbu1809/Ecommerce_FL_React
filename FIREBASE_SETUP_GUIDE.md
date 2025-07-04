# Firebase Console Setup Guide

## 1. Authentication Configuration

### Enable Authentication Methods:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the following providers:
   - **Email/Password**: ✅ Enable
   - **Google**: ✅ Enable (configure OAuth consent screen)

### Configure Google OAuth:
1. In Google Sign-in settings, add your domain:
   - `localhost` (for development)
   - Your production domain
2. Download the OAuth client configuration

## 2. Firestore Database Setup

### Create Collections:
1. Go to Firestore Database → Create database
2. Start in **production mode** (or test mode for development)
3. Create the following collections:

```
/products
/users
/orders
/categories
/reviews
/cart_items
/wishlist
/admin_settings
```

### Set up Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders readable by owner and admin
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Categories readable by all, writable by admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reviews readable by all, writable by authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 3. Storage Configuration

### Set up Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images (admin only)
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User uploads (profile pics, etc.)
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Required Actions

### A. Create Admin User in Firebase:
1. Go to Authentication → Users → Add user
2. Create user with email/password
3. Add custom claims: `{"role": "admin"}`

### B. Import Product Data:
Run the migration script to populate Firestore with products from JSON

### C. Configure CORS for Web App:
Add your domains to Firebase hosting or configure CORS rules

## 5. Environment Variables

Update your `.env` file:
```
VITE_FIREBASE_API_KEY=AIzaSyDsPZsRwk4uFh7r-IN8NCzAca_mxPe67OE
VITE_FIREBASE_AUTH_DOMAIN=anandmobiles-daa8b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anandmobiles-daa8b
VITE_FIREBASE_STORAGE_BUCKET=anandmobiles-daa8b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=403268549781
VITE_FIREBASE_APP_ID=1:403268549781:web:4aa820dddb7db1fa076f9c
```

## 6. Testing the Setup

After configuration, test these features:
- User registration/login
- Google Sign-in
- Product data loading
- Admin panel access
- Image uploads
