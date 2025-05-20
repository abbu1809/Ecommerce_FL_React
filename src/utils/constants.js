// API Constants
export const API_URL = "http://127.0.0.1:8000"; // Replace with your actual API URL

// Local Storage Keys
export const TOKEN_KEY = "anand_mobiles_token";
export const USER_KEY = "anand_mobiles_user";

// Route Constants
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
};

// UI Constants
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
