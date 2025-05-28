import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import { useProductStore } from "../store/useProduct";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ProductImageGallery from "../components/Product/ProductImageGallery";
import ProductInfo from "../components/Product/ProductInfo";
import ProductQuantitySelector from "../components/Product/ProductQuantitySelector";
import ProductActions from "../components/Product/ProductActions";
import ProductTabs from "../components/Product/ProductTabs";

const Product = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { currentProduct, loading, error, fetchProduct, clearCurrentProduct } =
    useProductStore();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      console.log("Fetching product with ID:", id);
      fetchProduct(id);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentProduct();
    };
  }, [id, fetchProduct, clearCurrentProduct]); // Debug log for product data
  useEffect(() => {
    if (currentProduct) {
      console.log("Raw product data from API:", currentProduct);
    }
  }, [currentProduct]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchProduct(id)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Product not found</p>
              <Link
                to={ROUTES.PRODUCTS}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const product = currentProduct;

  // Normalize product data from Firebase
  const normalizedProduct = {
    ...product,
    // Handle different possible field names
    name:
      product.name ||
      product.title ||
      product.product_name ||
      "Unknown Product",
    price: product.price || product.original_price || 0,
    discountPrice:
      product.discount_price ||
      product.discountPrice ||
      product.discounted_price ||
      product.sale_price ||
      product.price ||
      0,
    discount:
      product.discount ||
      (product.price && product.discount_price
        ? Math.round(
            ((product.price - product.discount_price) / product.price) * 100
          ) + "%"
        : null),
    rating: product.rating || product.average_rating || 0,
    reviews: Array.isArray(product.reviews)
      ? product.reviews.length
      : product.reviews || product.review_count || 0,
    reviewsData: Array.isArray(product.reviews)
      ? product.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          user: review.email ? review.email.split("@")[0] : "Anonymous", // Extract username from email
          userEmail: review.email,
          date: review.created_at,
          verified: true, // Assume verified since they come from API
          helpful: review.helpful_count || 0, // Use helpful_count from API
          helpful_count: review.helpful_count || 0, // Keep both for compatibility
          is_marked_helpful: review.is_marked_helpful || false, // Track if current user marked as helpful
          title: `${review.rating} star review`, // Generate a title based on rating
          reported_count: review.reported_count || 0, // Include reported count
          helpful_users: review.helpful_users || [], // Include helpful users array
        }))
      : [],
    stock: product.stock || product.quantity || product.inventory || 1,
    images: product.images ||
      product.image_urls ||
      product.photos || ["https://via.placeholder.com/600x600?text=No+Image"],
    features: product.features || product.key_features || [],
    specifications: product.specifications || product.specs || {},
    description:
      product.description ||
      product.product_description ||
      "No description available",
    category: product.category || product.product_category || "General",
    brand: product.brand || product.manufacturer || "Unknown Brand",
    // Handle variants
    variant: product.variant || {},
    colors: product.variant?.colors || [],
    ramOptions: product.variant?.ram || [],
    storageOptions: product.variant?.storage || [],
  }; // Debug normalized product
  console.log("Normalized product data:", normalizedProduct);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= normalizedProduct.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < normalizedProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    // Add to cart functionality would be implemented here
    console.log(`Added ${quantity} of ${normalizedProduct.name} to cart`);
    // You could dispatch an action to a global store here
  };

  const addToWishlist = () => {
    // Add to wishlist functionality would be implemented here
    console.log(`Added ${normalizedProduct.name} to wishlist`); // You could dispatch an action to a global store here
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", link: ROUTES.HOME },
    { label: normalizedProduct.category, link: ROUTES.PRODUCTS },
    {
      label: normalizedProduct.brand,
      link: `/brand/${normalizedProduct.brand}`,
    },
    { label: normalizedProduct.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />

        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center text-orange-500 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
            {/* Product Images - Left Column on Desktop */}
            <div className="lg:col-span-2">
              {" "}
              <ProductImageGallery
                images={normalizedProduct.images}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
              />
            </div>

            {/* Product Details - Right Column on Desktop */}
            <div className="lg:col-span-3 flex flex-col">
              <ProductInfo product={normalizedProduct} />

              <div className="border-t border-gray-200 py-4">
                {" "}
                <ProductQuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  stock={normalizedProduct.stock}
                  handleQuantityChange={handleQuantityChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />
                <ProductActions
                  price={normalizedProduct.price}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                />
              </div>
            </div>
          </div>
          {/* Product Details Tabs */}{" "}
          <ProductTabs
            product={normalizedProduct}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
