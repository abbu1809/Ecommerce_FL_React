# Firebase Security Rules

## Firestore Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection - users can read/write their own data, admin can read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
    }
    
    // Products collection - readable by all, writable by admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Categories collection - readable by all, writable by admin only
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Orders collection - users can read/write their own orders, admin can access all
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.auth.uid == resource.data.userId;
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Cart items - users can manage their own cart items
    match /cart_items/{cartItemId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
    }
    
    // Wishlist items - users can manage their own wishlist
    match /wishlist/{wishlistItemId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
    }
    
    // Reviews - authenticated users can create reviews, all can read
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Admin settings - admin only
    match /admin_settings/{settingId} {
      allow read: if true; // Public settings like store info
      allow write: if isAdmin();
    }
    
    // Promotions/Banners - readable by all, writable by admin
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Delivery partners - special rules for delivery management
    match /delivery_partners/{partnerId} {
      allow read: if isAdmin() || (isAuthenticated() && request.auth.uid == partnerId);
      allow write: if isAdmin();
    }
    
    // Support tickets - users can create and read their own tickets
    match /support_tickets/{ticketId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
      allow update: if isAdmin();
    }
    
    // Analytics data - admin only
    match /analytics/{analyticsId} {
      allow read, write: if isAdmin();
    }
    
    // Test collection - for development only
    match /test/{testId} {
      allow read, write: if true;
    }
  }
}
```

## Storage Rules (storage.rules)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Product images - readable by all, writable by admin
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Category images - readable by all, writable by admin
    match /categories/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User profile images - users can upload/read their own images
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Banner/promotion images - readable by all, writable by admin
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Order attachments - accessible by order owner and admin
    match /orders/{orderId}/{allPaths=**} {
      allow read, write: if request.auth != null && (
        get(/databases/(default)/documents/orders/$(orderId)).data.userId == request.auth.uid ||
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Temporary uploads - authenticated users only
    match /temp/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Apply These Rules

### 1. Firestore Rules:
1. Go to Firebase Console → Firestore Database → Rules
2. Replace the existing rules with the Firestore rules above
3. Click "Publish"

### 2. Storage Rules:
1. Go to Firebase Console → Storage → Rules
2. Replace the existing rules with the Storage rules above
3. Click "Publish"

## Important Notes:

1. **Development vs Production**: 
   - For development, you might want to allow broader access
   - For production, these rules provide proper security

2. **Admin User Setup**: 
   - Make sure to create admin users with `role: 'admin'` in Firestore
   - Admin users have full access to all collections

3. **Testing**: 
   - Test these rules thoroughly before deploying to production
   - Use Firebase emulator for local testing

4. **Backup**: 
   - Always backup your existing rules before applying new ones
   - Firebase keeps a history of rule changes

## Rule Customization:

You can modify these rules based on your specific needs:
- Add more granular permissions
- Create custom functions for complex logic
- Add rate limiting for specific operations
- Implement time-based restrictions
