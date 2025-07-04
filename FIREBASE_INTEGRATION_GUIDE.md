# Firebase Integration Setup - Complete Guide

## 🎯 Current Status

Your React ecommerce application has:
- ✅ Firebase credentials configured
- ✅ Firebase SDK properly initialized
- ✅ Hybrid architecture (Django backend + Firebase)
- ✅ Product migration scripts ready
- ✅ Firebase setup testing page available

## 🚀 Required Firebase Console Configuration

### 1. Authentication Setup
Go to Firebase Console → Authentication → Sign-in method:

#### Enable Authentication Methods:
- ✅ **Email/Password**: Enable this provider
- ✅ **Google**: Enable and configure OAuth consent screen
  - Add authorized domains: `localhost`, your production domain
  - Configure OAuth consent screen in Google Cloud Console

#### Add Test Users:
1. Go to Authentication → Users → Add user
2. Create admin user: `admin@anandmobiles.com` / `admin123456`
3. Add custom claims: `{"role": "admin"}` (via Firebase Admin SDK or console)

### 2. Firestore Database Setup

#### Create Database:
1. Go to Firestore Database → Create database
2. Choose **Start in production mode** (recommended)
3. Select nearest region

#### Apply Security Rules:
Copy the rules from `FIREBASE_SECURITY_RULES.md` and apply them in:
Firebase Console → Firestore Database → Rules

#### Required Collections:
The system expects these collections (will be created automatically):
```
/users          - User profiles and authentication data
/products       - Product catalog
/orders         - Customer orders
/categories     - Product categories
/reviews        - Product reviews
/cart_items     - Shopping cart data
/wishlist       - User wishlists
/admin_settings - Site configuration
/promotions     - Banners and promotions
```

### 3. Storage Configuration

#### Setup Storage Bucket:
1. Go to Storage → Get started
2. Apply security rules from `FIREBASE_SECURITY_RULES.md`

#### Folder Structure:
```
/products/      - Product images
/categories/    - Category images
/users/         - User profile images
/banners/       - Promotional banners
/orders/        - Order-related files
```

### 4. Project Configuration

#### Add Authorized Domains:
1. Go to Authentication → Settings → Authorized domains
2. Add your domains:
   - `localhost` (for development)
   - Your production domain

#### Configure OAuth Consent:
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Configure app information and authorized domains

## 🔧 Testing Your Setup

### Using the Firebase Setup Page:
1. Navigate to: `http://localhost:5174/firebase-setup`
2. Run the following tests:
   - **Test Authentication**: Verifies user creation/login
   - **Test Database**: Checks Firestore read/write permissions
   - **Test Storage**: Validates storage access
   - **Migrate Products**: Imports product data from JSON

### Manual Testing:
1. **Authentication Test**:
   ```javascript
   // In browser console
   import { auth } from './firebase';
   import { createUserWithEmailAndPassword } from 'firebase/auth';
   
   createUserWithEmailAndPassword(auth, 'test@test.com', 'password123')
     .then(user => console.log('Auth working:', user))
     .catch(error => console.error('Auth error:', error));
   ```

2. **Firestore Test**:
   ```javascript
   // In browser console
   import { db } from './firebase';
   import { doc, setDoc } from 'firebase/firestore';
   
   setDoc(doc(db, 'test', 'doc1'), { test: 'data' })
     .then(() => console.log('Firestore working'))
     .catch(error => console.error('Firestore error:', error));
   ```

## 🔄 Data Migration Process

### 1. Product Data Migration:
Your app includes a migration script to import products from JSON:
- **File**: `src/utils/Products_firebase_data.json` (4474+ products)
- **Script**: `src/services/dataMigration.js`
- **Usage**: Click "Migrate Products to Firebase" on setup page

### 2. Categories Setup:
Predefined categories will be created:
- Mobile/Smartphones
- Laptops
- Tablets  
- Accessories

### 3. Admin User Creation:
- **Email**: `admin@anandmobiles.com`
- **Password**: `admin123456`
- **Role**: Admin with full permissions

## 🔐 Security Considerations

### Production Security Rules:
- Users can only read/write their own data
- Admin users have full access
- Public data (products, categories) readable by all
- Proper validation and authentication checks

### Development vs Production:
- **Development**: More permissive rules for testing
- **Production**: Strict rules as defined in security guide

## 🚨 Troubleshooting Common Issues

### 1. "Permission Denied" Errors:
- Check Firestore security rules
- Verify user authentication status
- Ensure admin users have correct role assignment

### 2. Authentication Issues:
- Verify OAuth consent screen configuration
- Check authorized domains in Firebase Console
- Ensure correct Firebase config in app

### 3. CORS Errors:
- Add your domain to authorized domains
- Configure proper CORS headers if using custom hosting

### 4. Storage Upload Failures:
- Check storage security rules
- Verify user permissions
- Ensure proper file size limits

## 📱 Current App Features Using Firebase

### Authentication:
- ✅ Email/Password login/signup
- ✅ Google OAuth integration
- ✅ User profile management
- ✅ Admin authentication

### Database Operations:
- ✅ Product catalog management
- ✅ Order processing
- ✅ User data storage
- ✅ Shopping cart persistence
- ✅ Wishlist functionality

### File Storage:
- ✅ Product image uploads
- ✅ User profile pictures
- ✅ Category images
- ✅ Promotional banners

## 📋 Next Steps

1. **Complete Firebase Console setup** using this guide
2. **Test Firebase integration** using the setup page
3. **Migrate product data** to populate the store
4. **Create admin users** for management access
5. **Test end-to-end functionality** (signup, login, shopping)
6. **Deploy with proper security rules** for production

## 🆘 Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Review Firebase Console logs
3. Test individual components using setup page
4. Verify all configuration steps completed
5. Check network connectivity and CORS settings

Your Firebase project ID: `anandmobiles-daa8b`
Setup page: `http://localhost:5174/firebase-setup`
