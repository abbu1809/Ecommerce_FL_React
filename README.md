# E-commerce Frontend Development Plan (React.js)

This document outlines the detailed steps and technical implementations required to build the frontend for the e-commerce platform using React.js, Tailwind CSS, Framer Motion, React Icons, React Hot Toast, Axios, Zustand, and React Router DOM.

## 1. Project Setup & Dependencies

Your project seems to be already initialized with Vite and has a basic structure.

**Dependencies to ensure are installed:**

*   **React & ReactDOM:** Core React libraries.
*   **Vite:** Build tool (already in use).
*   **React Router DOM (`react-router-dom`):** For client-side routing.
    ```bash
    npm install react-router-dom
    ```
*   **Axios (`axios`):** For making HTTP requests to the backend API.
    ```bash
    npm install axios
    ```
*   **Zustand (`zustand`):** For global state management.
    ```bash
    npm install zustand
    ```
*   **Tailwind CSS (`tailwindcss`):** Utility-first CSS framework (assumed to be set up, ensure `tailwind.config.js` and `postcss.config.js` are configured).
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    Configure `tailwind.config.js` `content` array to include your source files:
    ```javascript
    // tailwind.config.js
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
    Import Tailwind directives in `src/index.css`:
    ```css
    /* src/index.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
*   **Framer Motion (`framer-motion`):** For animations and transitions.
    ```bash
    npm install framer-motion
    ```
*   **React Icons (`react-icons`):** For SVG icons.
    ```bash
    npm install react-icons
    ```
*   **React Hot Toast (`react-hot-toast`):** For notifications.
    ```bash
    npm install react-hot-toast
    ```

## 2. Folder Structure (Review and Refine)

The existing folder structure is a good foundation. Here's a slightly expanded version for clarity:

```
public/
  logo.jpg
  # other static assets
src/
  assets/
    # images, fonts, etc.
  components/
    common/ # Reusable basic UI components (Button, Input, Modal, etc.)
            # (Can merge existing ui/ components here or keep separate)
    layout/ # Header, Footer, Navbar, Sidebar, MobileMenu (already good)
    product/ # ProductCard, ProductList, ProductFilters, ImageGallery
    cart/    # CartItem, CartSummary
    checkout/ # ShippingForm, PaymentForm, OrderReview
    auth/     # LoginForm, RegisterForm
    admin/    # Admin-specific components (e.g., DashboardWidgets, DataTables)
    delivery/ # Delivery-specific components
    ui/       # (Existing UI components, can be merged into common or kept)
  constants/
    # App-wide constants, e.g., API_URL, route paths
  hooks/
    # Custom React hooks (e.g., useAuth, useCart)
  layouts/
    MainLayout.jsx # For general user-facing pages
    AdminLayout.jsx # For admin panel pages
    AuthLayout.jsx # For login/register pages
  pages/
    Home.jsx
    Products.jsx
    ProductDetail.jsx
    Cart.jsx
    Checkout.jsx
    OrderConfirmation.jsx
    OrderHistory.jsx
    LoginPage.jsx
    RegisterPage.jsx
    ProfilePage.jsx
    WishlistPage.jsx
    admin/
      AdminDashboard.jsx
      AdminProducts.jsx
      AdminOrders.jsx
      AdminUsers.jsx
      # ... other admin pages
    delivery/
      DeliveryLogin.jsx
      DeliveryDashboard.jsx
      # ... other delivery partner pages
  routes/
    index.jsx       # Main router configuration
    ProtectedRoutes.jsx # Component for handling protected routes
  services/
    api.js          # Axios instance configuration
    authService.js
    productService.js
    orderService.js
    # ... other API service modules
  store/
    authStore.js
    cartStore.js    # (already present)
    productStore.js
    orderStore.js
    uiStore.js      # For managing UI state like modals, sidebars
    # ... other Zustand stores
  theme/
    index.js        # Tailwind theme customizations (if extensive)
  utils/
    # Helper functions, validators, formatters
  App.jsx
  index.css
  main.jsx
```

## 3. Core E-commerce Features Implementation

### 3.1. User Registration & Login (OAuth, email/phone-based)
*   **Pages:** `src/pages/LoginPage.jsx`, `src/pages/RegisterPage.jsx`.
*   **Layout:** `src/layouts/AuthLayout.jsx` for a centered form experience.
*   **Components:**
    *   `src/components/auth/LoginForm.jsx`: Email/password fields, login button.
    *   `src/components/auth/RegisterForm.jsx`: Name, email, phone, password fields, register button.
    *   `src/components/auth/SocialLoginButtons.jsx`: Buttons for OAuth providers (Google, Facebook, etc.).
*   **State (Zustand):** `src/store/authStore.js`
    *   State: `user`, `token`, `isLoading`, `error`.
    *   Actions: `login(credentials)`, `register(userData)`, `logout()`, `loadUser()`, `loginWithOAuth(provider)`.
*   **API (`src/services/authService.js`):**
    *   Functions using `axios` to hit backend endpoints: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/oauth/:provider`.
*   **Routing (`src/routes/index.jsx`):**
    *   Public routes for `/login`, `/register`.
    *   Protected routes for user-specific areas.
*   **Libraries:**
    *   `axios` for API calls.
    *   `react-router-dom` for navigation and protected routes.
    *   `react-hot-toast` for success/error notifications.
    *   `react-icons` for input field icons or social media icons.
*   **Implementation Details:**
    *   Form validation (e.g., using a library like `react-hook-form` or custom validation).
    *   Store JWT token in localStorage/sessionStorage and in Zustand store.
    *   Set Axios default headers to include the auth token.
    *   Implement `src/routes/ProtectedRoutes.jsx` to redirect unauthenticated users.

### 3.2. Product Catalog (mobiles, laptops, accessories)
*   **Pages:**
    *   `src/pages/Home.jsx`: Display featured products, categories, promotional banners.
    *   `src/pages/Products.jsx`: Display all products with filtering and sorting.
*   **Components:**
    *   `src/components/product/ProductCard.jsx` (already present): Display product image, name, price, add to cart button.
    *   `src/components/product/ProductList.jsx`: Renders a list/grid of `ProductCard` components.
    *   `src/components/common/CategoryNavigation.jsx`: Links or dropdown for product categories.
*   **State (Zustand):** `src/store/productStore.js`
    *   State: `products`, `categories`, `featuredProducts`, `isLoading`, `error`, `filters`, `sortBy`.
    *   Actions: `fetchProducts()`, `fetchCategories()`, `fetchProductById(id)`, `setFilters()`, `setSortBy()`.
*   **API (`src/services/productService.js`):**
    *   Functions for `/products`, `/products/:id`, `/categories`.
*   **Libraries:**
    *   `axios` for data fetching.
    *   `framer-motion` for subtle animations on product card hover or list loading.
    *   `react-icons` for category icons or UI elements.
*   **Implementation Details:**
    *   Use Tailwind CSS for responsive grid layouts.
    *   Implement pagination or infinite scrolling on `ProductsPage`.

### 3.3. Product Search and Filtering
*   **Components:**
    *   `src/components/layout/SearchBar.jsx` (already present): Input field for text search.
    *   `src/components/product/FilterSidebar.jsx`: Filters for brand, specifications (RAM, storage, etc.), price range.
*   **State (Zustand):** `productStore.js` will manage filter state and update product list accordingly.
*   **API (`src/services/productService.js`):**
    *   Backend API for `/products` should accept query parameters for search term, brands, specs, price range.
*   **Implementation Details:**
    *   Debounce search input to avoid excessive API calls.
    *   Update product list dynamically as filters change.
    *   Use `react-router-dom` to update URL query params with filter state for shareable links.

### 3.4. Product Details Page
*   **Page:** `src/pages/ProductDetail.jsx` (already present).
*   **Components:**
    *   `src/components/product/ImageGallery.jsx`: Main image and thumbnails, potentially with zoom or carousel (e.g., using `swiper.js` or a simple `framer-motion` carousel).
    *   `src/components/product/ProductInfo.jsx`: Name, price, description, detailed specifications, stock status.
    *   `src/components/product/AddToCartButton.jsx`: Button to add product to cart, potentially with quantity selector.
    *   `src/components/reviews/ReviewSection.jsx`: Display product reviews and ratings (see section 8).
*   **State (Zustand):** `productStore.js` action `fetchProductById(id)`.
*   **API (`src/services/productService.js`):** Endpoint `/products/:id`.
*   **Libraries:**
    *   `axios`.
    *   `framer-motion` for image transitions or gallery animations.
    *   `react-icons`.

### 3.5. Add to Cart and Wishlist
*   **Pages:** `src/pages/Cart.jsx` (already present), `src/pages/WishlistPage.jsx`.
*   **Components:**
    *   `src/components/product/AddToCartButton.jsx`.
    *   `src/components/product/WishlistButton.jsx` (often an icon button).
    *   `src/components/layout/CartIcon.jsx` (already present): Displays cart item count, links to cart page.
    *   `src/components/cart/CartItem.jsx`: Displays product in cart with quantity adjustment and remove option.
    *   `src/components/cart/CartSummary.jsx`: Shows subtotal, total, and checkout button.
*   **State (Zustand):**
    *   `src/store/cartStore.js` (already present):
        *   State: `items`, `totalQuantity`, `totalPrice`.
        *   Actions: `addItem(product, quantity)`, `removeItem(productId)`, `updateQuantity(productId, quantity)`, `clearCart()`.
    *   `src/store/wishlistStore.js`: Similar structure for wishlist items.
*   **API:** Backend endpoints if cart/wishlist needs to be persisted across sessions/devices.
*   **Libraries:**
    *   `zustand`.
    *   `react-hot-toast` for notifications ("Item added to cart", "Item removed from wishlist").
    *   `react-icons` for cart, wishlist, plus/minus, trash icons.
*   **Implementation Details:**
    *   Update `CartIcon` badge dynamically.
    *   Persist cart in localStorage for guest users, sync with backend for logged-in users.

### 3.6. Secure Checkout Process
*   **Page:** `src/pages/Checkout.jsx`.
*   **Layout:** Could be a multi-step wizard or a single page.
*   **Components:**
    *   `src/components/checkout/ShippingAddressForm.jsx`: Form for user's shipping details.
    *   `src/components/checkout/PaymentMethodSelection.jsx`: Options for UPI, cards, wallets.
    *   `src/components/checkout/OrderSummary.jsx`: Review of items, prices, shipping costs.
*   **State (Zustand):** `src/store/checkoutStore.js`
    *   State: `shippingAddress`, `paymentMethod`, `orderSummary`.
    *   Actions: `setShippingAddress()`, `setPaymentMethod()`.
*   **API (`src/services/orderService.js`):** Endpoint `/orders/create` to submit the order.
*   **Libraries:** `axios`, `react-router-dom` for navigation through checkout steps.
*   **Implementation Details:**
    *   Form validation for all inputs.
    *   Clear cart after successful order placement.

### 3.7. Payment Gateway Integration
*   **Frontend Role:** Primarily to collect payment information securely using the Payment Gateway's (PG) SDK (e.g., Stripe Elements, Razorpay Web SDK).
*   **Components:** Payment form elements provided by the PG SDK.
*   **API:**
    *   Frontend sends payment details (or a token generated by the SDK) to your backend.
    *   Backend communicates with the PG to process the payment.
*   **Implementation Details:**
    *   This is highly dependent on the chosen PG. Follow their documentation carefully.
    *   Ensure PCI compliance if handling card data directly (usually avoided by using SDKs).
    *   Handle payment success and failure callbacks from the PG.

### 3.8. Order Confirmation and Invoice Generation
*   **Page:** `src/pages/OrderConfirmation.jsx`.
*   **Components:** `src/components/checkout/OrderDetailsDisplay.jsx`: Shows order ID, summary, shipping info, estimated delivery.
*   **API (`src/services/orderService.js`):** Fetch order details using order ID.
*   **Implementation Details:**
    *   Invoice generation is typically a backend task. Frontend can provide a link to download the PDF invoice or display an HTML version.
    *   Use `react-hot-toast` for a success message upon order placement.

## 4. Delivery Status & Order Tracking
*   **Pages:**
    *   `src/pages/OrderHistory.jsx`: Lists all user orders.
    *   `src/pages/OrderDetailPage.jsx` (can be part of OrderHistory or a separate route): Shows details of a specific order, including tracking.
*   **Components:**
    *   `src/components/order/OrderListItem.jsx`: Summary of an order in the history list.
    *   `src/components/order/TrackingTimeline.jsx`: Visual representation of order status (Ordered, Packed, Shipped, Out for Delivery, Delivered).
*   **State (Zustand):** `src/store/orderStore.js`
    *   State: `orders`, `currentOrderDetails`, `isLoading`.
    *   Actions: `fetchOrders()`, `fetchOrderDetails(orderId)`.
*   **API (`src/services/orderService.js`):** Endpoints `/orders` (for user's orders), `/orders/:id/status`.
*   **Libraries:** `axios`, `react-icons` for status indicators (e.g., checkmark, truck icon).
*   **Implementation Details:**
    *   Display statuses clearly.
    *   Potentially integrate with a third-party shipping API for real-time tracking if available.

## 5. Admin Panel
*   **Layout:** `src/layouts/AdminLayout.jsx` with a dedicated sidebar navigation.
*   **Routing:** Nested routes under `/admin` (e.g., `/admin/dashboard`, `/admin/products`). Use `ProtectedRoutes.jsx` to ensure only admin users can access.
*   **Pages (under `src/pages/admin/`):**
    *   `AdminDashboard.jsx`: Sales summary, user stats, etc. (use charting libraries like `recharts` or `chart.js` wrapped in React components).
    *   `AdminProducts.jsx`: Table of products with CRUD (Create, Read, Update, Delete) operations. Forms for adding/editing products.
    *   `AdminInventory.jsx`: Interface to manage stock levels.
    *   `AdminOrders.jsx`: View all orders, update status, cancel orders.
    *   `AdminUsers.jsx`: Manage users (view, ban, promote to admin).
    *   `AdminReturns.jsx`: Handle return/refund requests.
    *   `AdminContent.jsx`: Manage home banners, ads, etc.
*   **Components (under `src/components/admin/`):**
    *   `DataTable.jsx`: Reusable component for displaying and managing tabular data (products, orders, users). Could use a library like `react-table`.
    *   `ProductForm.jsx`, `OrderUpdateForm.jsx`, etc.
    *   `DashboardChart.jsx`.
*   **State (Zustand):** Consider separate stores like `adminProductStore`, `adminOrderStore` or extend existing stores with admin-specific actions and data.
*   **API:** Dedicated admin API endpoints (e.g., `/api/admin/products`, `/api/admin/orders`).
*   **Libraries:** `axios`, `react-router-dom`, `react-icons`, `framer-motion` for transitions, `react-hot-toast`.
*   **Implementation Details:**
    *   Robust access control on both frontend and backend.
    *   User-friendly forms with validation.
    *   Clear data visualization for the dashboard.

## 6. Delivery Partner Module
*   **Layout:** `src/layouts/DeliveryLayout.jsx` (if different from Admin).
*   **Routing:** Nested routes under `/delivery` (e.g., `/delivery/login`, `/delivery/dashboard`). Protected by auth.
*   **Pages (under `src/pages/delivery/`):**
    *   `DeliveryLogin.jsx`.
    *   `DeliveryDashboard.jsx`: Overview of assigned deliveries.
    *   `AssignedDeliveries.jsx`: List of current deliveries.
    *   `DeliveryHistory.jsx`.
*   **Components (under `src/components/delivery/`):**
    *   `DeliveryLoginForm.jsx`.
    *   `DeliveryAssignmentCard.jsx`.
    *   `DeliveryStatusUpdater.jsx`: Interface to update status (e.g., picked up, out for delivery, delivered, OTP verified).
*   **State (Zustand):** `src/store/deliveryStore.js`.
*   **API:** Endpoints for delivery partner login, fetching assignments, updating delivery status.
*   **Implementation Details:**
    *   Admin verification of partners is a backend process; frontend reflects status.
    *   Simple interface for delivery partners to manage their tasks.
    *   OTP verification input if done via the app.

## 7. Product Reviews & Ratings
*   **Components:**
    *   `src/components/reviews/ReviewForm.jsx`: For verified buyers to submit reviews (star rating + text).
    *   `src/components/reviews/ReviewList.jsx`: Displays existing reviews for a product.
    *   `src/components/reviews/StarRatingInput.jsx`: Interactive star component for form.
    *   `src/components/reviews/StarRatingDisplay.jsx`: Non-interactive stars for showing average/individual ratings.
*   **API (`src/services/productService.js` or `reviewService.js`):**
    *   `/products/:id/reviews` (GET to fetch, POST to submit).
    *   Admin API for managing/adding reviews.
*   **Libraries:** `react-icons` for star icons.
*   **Implementation Details:**
    *   Display average rating prominently on product page.
    *   Allow sorting/filtering of reviews (e.g., by rating, date).
    *   "Verified Buyer" badges.

## 8. Styling and UI
*   **Tailwind CSS:**
    *   Utilize utility classes extensively for styling.
    *   Customize `tailwind.config.js` for project-specific theme (colors, fonts, breakpoints).
    *   Keep `src/index.css` minimal, primarily for Tailwind directives and base global styles.
*   **Framer Motion:**
    *   Page transitions: Wrap routes in `<AnimatePresence>` and use `motion` components on page containers.
    *   Component animations: Subtle hover effects, list item entrance, modal pop-ups.
    *   Example: `motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}`.
*   **React Icons:**
    *   Use consistently across the application for UI elements (e.g., `FaShoppingCart`, `IoMdHeartEmpty`, `MdStar`).
    *   Import only the icons you need to keep bundle size down: `import { FaBeer } from 'react-icons/fa';`.
*   **React Hot Toast:**
    *   Use `toast.success('Message')`, `toast.error('Message')` for user feedback.
    *   Add `<Toaster />` component at the root of your app (e.g., in `App.jsx` or `MainLayout.jsx`).

## 9. State Management (Zustand)
*   **Store Design:**
    *   Create separate stores for logical domains (auth, cart, products, UI state, etc.).
    *   Example `src/store/cartStore.js`:
        ```javascript
        import {create} from 'zustand';
        import { persist } from 'zustand/middleware'; // For localStorage persistence

        const useCartStore = create(
          persist(
            (set, get) => ({
              items: [],
              addItem: (product, quantity = 1) => { /* ...logic... */ },
              removeItem: (productId) => { /* ...logic... */ },
              // ...other actions and state
            }),
            {
              name: 'cart-storage', // Name for localStorage key
            }
          )
        );
        export default useCartStore;
        ```
*   **Usage in Components:**
    ```javascript
    import useCartStore from '../store/cartStore';

    function MyComponent() {
      const items = useCartStore((state) => state.items);
      const addItem = useCartStore((state) => state.addItem);
      // ...
    }
    ```
*   Use selectors to pick specific pieces of state to optimize re-renders.

## 10. Routing (React Router DOM v6)
*   **Main Router (`src/routes/index.jsx`):**
    ```javascript
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import HomePage from '../pages/Home';
    // ... import other pages and layouts
    import ProtectedRoute from './ProtectedRoute'; // Custom component

    function AppRouter() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}> {/* Or directly on pages */}
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              {/* ... other public routes */}
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}> {/* Wrapper for protected routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              {/* ... other user-specific routes */}
            </Route>

            <Route path="/admin" element={<ProtectedRoute adminOnly />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* ... other admin routes */}
              </Route>
            </Route>
            {/* ... delivery partner routes */}
          </Routes>
        </BrowserRouter>
      );
    }
    export default AppRouter;
    ```
*   **Protected Routes (`src/routes/ProtectedRoute.jsx`):**
    ```javascript
    import { Navigate, Outlet } from 'react-router-dom';
    import useAuthStore from '../store/authStore';

    const ProtectedRoute = ({ adminOnly = false }) => {
      const { user, token } = useAuthStore((state) => ({ user: state.user, token: state.token }));

      if (!token) {
        return <Navigate to="/login" replace />;
      }

      if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />; // Or an unauthorized page
      }

      return <Outlet />; // Renders child routes
    };
    export default ProtectedRoute;
    ```
*   Integrate `AppRouter` into `src/App.jsx`.

## 11. API Integration (Axios)
*   **Axios Instance (`src/services/api.js`):**
    ```javascript
    import axios from 'axios';
    import useAuthStore from '../store/authStore'; // To get token

    const apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Set in .env
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor to add auth token to requests
    apiClient.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Optional: Interceptor for response error handling (e.g., 401 for logout)
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          useAuthStore.getState().logout(); // Example: auto-logout on 401
        }
        return Promise.reject(error);
      }
    );

    export default apiClient;
    ```
*   **Service Files (e.g., `src/services/productService.js`):**
    ```javascript
    import apiClient from './api';

    export const getProducts = (params) => apiClient.get('/products', { params });
    export const getProductById = (id) => apiClient.get(`/products/${id}`);
    // ... other product related API calls
    ```
*   **Error Handling:** Use `try...catch` blocks or `.catch()` with API calls. Display user-friendly errors using `react-hot-toast`.

## 12. Handling Product Data (Mock Data for Development)
Since actual product details are not yet available:
*   Create mock JSON files in `src/assets/mockData/` (e.g., `products.json`, `categories.json`).
    *   `products.json` should include fields like `id`, `name`, `brand`, `category`, `price`, `description`, `specifications` (object), `images` (array of URLs), `stock`.
    *   Include data for the specified brands: Apple, Samsung, Oppo, Vivo, MI, OnePlus, Nothing, Motorola, iQOO, Lava, Nokia (Mobiles); Samsung, HP (Laptops); Samsung, OnePlus, MI, Motorola (Tablets); Xiaomi, Mi, Nvw, Cellecor (TVs); Zebronics, JBL, etc. (Speakers).
*   In your `productStore.js` or services, initially load data from these JSON files if an API is not ready.
    ```javascript
    // Example in productService.js
    import mockProducts from '../assets/mockData/products.json';

    export const getProducts = async (params) => {
      if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) { // Use mock in dev if no API URL
        console.warn("Using mock product data");
        // Add filtering/pagination logic for mock data if needed
        return Promise.resolve({ data: mockProducts });
      }
      return apiClient.get('/products', { params });
    };
    ```

## 13. Important Policies & Operational Details
*   **No Return Policy:**
    *   Display this information clearly:
        *   During the checkout process (e.g., near the final "Place Order" button).
        *   On product detail pages.
        *   In a dedicated "Terms and Conditions" or "Shipping & Returns" page.
*   **OTP Verification Before Delivery:**
    *   This is primarily a backend and operational process.
    *   Frontend might need to:
        *   Inform the user about this step (e.g., in order confirmation, order tracking).
        *   If OTP is entered via a customer-facing app (less common for delivery OTP), provide an input field.
*   **Product Unboxing in Front of Customer:**
    *   Inform the user about this policy (e.g., on product pages, order confirmation, delivery notifications). This builds trust and manages expectations.
*   **Terms and Conditions:**
    *   Create a static page (e.g., `src/pages/TermsAndConditions.jsx`) with the T&C content. Link to it from the footer.

## 14. Development Workflow
1.  **Setup:** Ensure all tools and dependencies are installed. Configure Tailwind.
2.  **Base Layouts & Routing:** Implement `MainLayout`, `AuthLayout`, and basic routing structure.
3.  **Authentication:** Build login and registration pages and `authStore`.
4.  **Core Product Features:**
    *   Develop `productStore` with mock data.
    *   Build `ProductCard`, `ProductList`, `ProductDetailPage`.
    *   Implement search and filtering UI.
5.  **Cart & Checkout:** Develop `cartStore`, cart page, and checkout flow (without actual payment integration initially).
6.  **API Service Layers:** Create `axios` instance and service files. Start replacing mock data calls with API calls as backend endpoints become available.
7.  **Admin Panel:** Start with admin layout, routing, and one or two key management modules (e.g., product management).
8.  **Styling & Animations:** Continuously apply Tailwind CSS. Add `framer-motion` animations for better UX once components are functional.
9.  **Notifications:** Integrate `react-hot-toast` for user feedback.
10. **Iterate:** Implement other features (wishlist, order tracking, reviews, delivery module) iteratively.
11. **Refinement & Testing:** Refactor code, test thoroughly (manual testing, consider unit/integration tests with Jest/React Testing Library if time permits).

This detailed plan should guide you through building a comprehensive e-commerce frontend. Remember to collaborate closely with your backend team for API specifications and integration.
