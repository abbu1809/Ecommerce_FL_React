import { productService } from './optimizedFirebaseService';
import productsData from '../utils/Products_firebase_data.json';

/**
 * Migration utility to import products from JSON to Firebase Firestore
 * Run this once to populate your Firebase database with product data
 */
export const migrateProductsToFirebase = async () => {
  console.log('Starting product migration to Firebase...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of productsData) {
      try {
        // Transform JSON data to Firebase-compatible format
        const firebaseProduct = {
          category: product.Category?.toLowerCase() || 'general',
          brand: product.Brand?.trim() || 'Unknown',
          name: product['Model Name'] || 'Unknown Product',
          model: product['Model Name'] || '',
          specifications: product['Specs (RAM/ROM/Display/etc)'] || '',
          price: parseFloat(product.Price?.toString().replace(/[₹,]/g, '')) || 0,
          offerPrice: parseFloat(product['Offer Price']?.toString().replace(/[₹,]/g, '')) || 0,
          stock: parseInt(product.Stock) || 0,
          imageUrl: product['Product Image URL'] || '',
          description: product.Description || '',
          warranty: product.Warranty || '',
          emiOptions: product['EMI Options'] === 'Yes',
          
          // Additional fields for better functionality
          isActive: true,
          featured: Math.random() > 0.8, // Randomly mark 20% as featured
          rating: Math.floor(Math.random() * 2) + 3, // Random rating 3-5
          totalReviews: Math.floor(Math.random() * 100),
          
          // SEO and search fields
          searchTags: [
            product.Brand?.toLowerCase(),
            product['Model Name']?.toLowerCase(),
            product.Category?.toLowerCase()
          ].filter(Boolean),
          
          // Timestamps
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Calculate discount percentage
        if (firebaseProduct.price > 0 && firebaseProduct.offerPrice > 0) {
          firebaseProduct.discountPercentage = Math.round(
            ((firebaseProduct.price - firebaseProduct.offerPrice) / firebaseProduct.price) * 100
          );
        }
        
        // Add to Firebase
        const productId = await productService.addProduct(firebaseProduct);
        console.log(`✅ Added product: ${firebaseProduct.name} (ID: ${productId})`);
        successCount++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error adding product ${product['Model Name']}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Successfully added: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Create sample categories in Firebase
 */
export const createCategories = async () => {
  const categories = [
    {
      id: 'mobile',
      name: 'Smartphones',
      description: 'Latest smartphones and mobile devices',
      image: '/images/categories/mobile.jpg',
      isActive: true
    },
    {
      id: 'laptop',
      name: 'Laptops',
      description: 'Laptops and computers for work and gaming',
      image: '/images/categories/laptop.jpg',
      isActive: true
    },
    {
      id: 'tablet',
      name: 'Tablets',
      description: 'Tablets and iPad devices',
      image: '/images/categories/tablet.jpg',
      isActive: true
    },
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Mobile and laptop accessories',
      image: '/images/categories/accessories.jpg',
      isActive: true
    }
  ];
  
  // Note: You'll need to create a categories collection in Firestore
  // This is just sample data structure
  console.log('Categories to create:', categories);
  return categories;
};

/**
 * Create admin user in Firebase
 */
export const createAdminUser = async (adminData) => {
  try {
    // This would typically be done through Firebase Admin SDK
    // For now, just log the structure
    const adminUser = {
      ...adminData,
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_orders', 'manage_users'],
      createdAt: new Date()
    };
    
    console.log('Admin user structure:', adminUser);
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};
