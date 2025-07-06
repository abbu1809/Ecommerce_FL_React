// Production API Constants
export const API_URL = "https://yourdomain.com/api";  // Replace with your production domain

// Development fallback (for local testing)
// export const API_URL = "http://127.0.0.1:8000/api";

// Local Storage Keys (same as development)
export const TOKEN_KEY = "anand_mobiles_token";
export const USER_KEY = "anand_mobiles_user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const DELIVERY_TOKEN_KEY = "delivery_partner_token";

// Production Settings
export const ENVIRONMENT = "production";
export const RAZORPAY_KEY_ID = "rzp_live_XXXXXXXXXX"; // Your live Razorpay key

// Security Settings
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// Route Constants (same as before)
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

// UI Constants (same as before)
export const THEME = {
  PRIMARY_COLOR: "#4F46E5",
  SECONDARY_COLOR: "#F59E0B", 
  SUCCESS_COLOR: "#10B981",
  ERROR_COLOR: "#EF4444",
  WARNING_COLOR: "#F59E0B",
  INFO_COLOR: "#3B82F6",
};

export const ITEMS_PER_PAGE = 10;
