// ==================================================
// PRODUCTION CONSTANTS - REPLACE BEFORE DEPLOYMENT
// ==================================================

// 🚨 CRITICAL: Update these values before building for production

// ==================================================
// API CONFIGURATION
// ==================================================

// Production API URL - REPLACE with your actual domain
export const API_URL = "https://yourdomain.com/api";

// Development API URL (keep for reference)
// export const API_URL = "http://127.0.0.1:8000/api";

// ==================================================
// RAZORPAY CONFIGURATION
// ==================================================

// Live Razorpay Key ID - REPLACE with your live key after KYC
export const RAZORPAY_KEY_ID = "rzp_live_XXXXXXXXXXXXXXXXXX";

// Test key (keep for reference)
// export const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXXXXXXXX";

// ==================================================
// ENVIRONMENT DETECTION
// ==================================================

export const ENVIRONMENT = "production";
export const IS_DEVELOPMENT = false;
export const IS_PRODUCTION = true;

// ==================================================
// SECURITY CONFIGURATIONS
// ==================================================

// Enable security features in production
export const ENABLE_CONSOLE_LOGS = false;
export const ENABLE_DEVTOOLS = false;
export const STRICT_MODE = true;

// ==================================================
// PERFORMANCE CONFIGURATIONS
// ==================================================

// API timeout (in milliseconds)
export const API_TIMEOUT = 10000;

// Retry configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

// ==================================================
// BUSINESS INFORMATION
// ==================================================

export const BUSINESS_INFO = {
  name: "Anand Mobiles",
  email: "info@yourdomain.com",
  phone: "+91-XXXXXXXXXX",
  address: "Your Business Address",
  website: "https://yourdomain.com",
  supportEmail: "support@yourdomain.com",
};

// ==================================================
// PAYMENT CONFIGURATION
// ==================================================

export const PAYMENT_CONFIG = {
  currency: "INR",
  minAmount: 1, // Minimum payment amount in rupees
  maxAmount: 500000, // Maximum payment amount in rupees
  theme: {
    color: "#4F46E5", // Brand primary color
  },
};

// ==================================================
// LOCAL STORAGE KEYS (Keep same as development)
// ==================================================

export const TOKEN_KEY = "anand_mobiles_token";
export const USER_KEY = "anand_mobiles_user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const DELIVERY_TOKEN_KEY = "delivery_partner_token";

// ==================================================
// ROUTE CONSTANTS (Keep same as development)
// ==================================================

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  PROFILE_SECTION: "/profile/:section",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  WISHLIST: "/wishlist",
  ABOUT: "/about",
  CONTACT: "/contact",
  TRACK_ORDER: "/track-order",
  BULK_ORDER: "/bulk-order",
  TERMS_CONDITIONS: "/terms-conditions",
  CANCELLATION_REFUND_POLICY: "/cancellation-refund-policy",
  PRIVACY_POLICY: "/privacy-policy",
  SHIPPING_DELIVERY_POLICY: "/shipping-delivery-policy",
  OUR_STORES: "/our-stores",
  WARRANTY_POLICY: "/warranty-policy",
};

// ==================================================
// UI THEME (Keep same as development)
// ==================================================

export const THEME = {
  PRIMARY_COLOR: "#4F46E5", // indigo-600
  SECONDARY_COLOR: "#F59E0B", // amber-500
  SUCCESS_COLOR: "#10B981", // emerald-500
  ERROR_COLOR: "#EF4444", // red-500
  WARNING_COLOR: "#F59E0B", // amber-500
  INFO_COLOR: "#3B82F6", // blue-500
};

// Pagination
export const ITEMS_PER_PAGE = 10;

/*
DEPLOYMENT CHECKLIST:

✅ 1. Update API_URL with your actual domain
✅ 2. Update RAZORPAY_KEY_ID with live key after KYC
✅ 3. Test all payment flows with live credentials
✅ 4. Verify SSL certificate is installed
✅ 5. Run production build: npm run build
✅ 6. Deploy to web server
✅ 7. Test live website thoroughly
*/
