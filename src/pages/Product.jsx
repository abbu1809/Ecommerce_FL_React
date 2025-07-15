import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import { useProductStore } from "../store/useProduct";
import { useCartStore } from "../store/useCart";
import { useWishlistStore } from "../store/useWishlist";
import { useAuthStore } from "../store/useAuth";
import { showAddToCartToast, showCartErrorToast } from "../utils/toast";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ProductImageGallery from "../components/Product/ProductImageGallery";
import ProductInfo from "../components/Product/ProductInfo";
import ProductQuantitySelector from "../components/Product/ProductQuantitySelector";
import ProductActions from "../components/Product/ProductActions";
import ProductTabs from "../components/Product/ProductTabs";
import ProductVariantSelector from "../components/Product/ProductVariantSelector";
import RelatedProducts from "../components/Product/RelatedProducts";
import FrequentlyBoughtTogether from "../components/Product/FrequentlyBoughtTogether";

const Product = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const {
    currentProduct,
    loading,
    error,
    fetchProduct,
    clearCurrentProduct,
    getProductsByCategory,
  } = useProductStore();
  const { addItem: addToCartStore } = useCartStore();
  const { addItem: addToWishlistStore } = useWishlistStore();
  const { user } = useAuthStore();

  // Define handleVariantChange early to avoid conditional hooks
  const handleVariantChange = useCallback((option) => {
    console.log("Variant changed to:", option);
    setSelectedVariant(option);
    // Reset quantity to 1 when variant changes
    setQuantity(1);
  }, []);

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
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize selected variant when product loads
  useEffect(() => {
    if (currentProduct?.valid_options?.length > 0) {
      setSelectedVariant(currentProduct.valid_options[0]);
    }
  }, [currentProduct]);

  // Debug log for product data
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
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
                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-hover"
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
                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-hover"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const product = currentProduct; // Normalize product data from Firebase
  const normalizedProduct = {
    ...product,
    // Handle different possible field names
    name:
      product.name ||
      product.title ||
      product.product_name ||
      "Unknown Product",
    price:
      selectedVariant?.price || product.price || product.original_price || 0,
    discountPrice:
      selectedVariant?.discounted_price ||
      product.discount_price ||
      product.discountPrice ||
      product.discounted_price ||
      product.sale_price ||
      selectedVariant?.price ||
      product.price ||
      0,
    discount:
      product.discount ||
      (selectedVariant?.price &&
      selectedVariant?.discounted_price &&
      selectedVariant.discounted_price < selectedVariant.price
        ? Math.round(
            ((selectedVariant.price - selectedVariant.discounted_price) /
              selectedVariant.price) *
              100
          ) + "%"
        : product.price &&
          product.discount_price &&
          product.discount_price < product.price
        ? Math.round(
            ((product.price - product.discount_price) / product.price) * 100
          ) + "%"
        : null),
    rating: product.rating || product.average_rating || 0,
    reviews:
      product.total_reviews ||
      (Array.isArray(product.reviews)
        ? product.reviews.length
        : product.reviews || product.review_count || 0),
    reviewsData: Array.isArray(product.reviews)
      ? product.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          user: review.email ? review.email.split("@")[0] : "Anonymous",
          userEmail: review.email,
          date: review.created_at,
          verified: true,
          helpful: review.helpful_count || 0,
          helpful_count: review.helpful_count || 0,
          is_marked_helpful: review.is_marked_helpful || false,
          title: `${review.title}`,
          reported_count: review.reported_count || 0,
          helpful_users: review.helpful_users || [],
        }))
      : [],
    stock:
      selectedVariant?.stock ||
      product.stock ||
      product.quantity ||
      product.inventory ||
      1,
    images: product.images ||
      product.image_urls ||
      product.photos || ["https://via.placeholder.com/600x600?text=No+Image"],
    videos: product.videos || [],
    features: product.features || product.key_features || [],
    specifications: product.specifications || product.specs || {},
    attributes: product.attributes || {},
    description:
      product.description ||
      product.product_description ||
      "No description available",
    category: product.category || product.product_category || "General",
    brand: product.brand || product.manufacturer || "Unknown Brand", // Handle variants
    variant: product.variant || {},
    colors: product.variant?.colors || [],
    ramOptions: product.variant?.ram || [],
    storageOptions: product.variant?.storage || [],
    validOptions: product.valid_options || [],
    selectedColor: selectedVariant?.colors || null,

    // Use variant-specific values when available
    currentPrice:
      selectedVariant?.discounted_price ||
      selectedVariant?.price ||
      product.discount_price ||
      product.discountPrice ||
      product.discounted_price ||
      product.sale_price ||
      product.price ||
      0,
    originalPrice:
      selectedVariant?.price || product.price || product.original_price || 0,
    currentStock:
      selectedVariant?.stock ||
      product.stock ||
      product.quantity ||
      product.inventory ||
      0,
  }; // Debug normalized product
  console.log("Normalized product data:", normalizedProduct);
  console.log("Selected variant:", selectedVariant);
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const maxStock = normalizedProduct.currentStock;
    if (value > 0 && value <= maxStock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    const maxStock = normalizedProduct.currentStock;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const addToCart = async () => {
    if (!user) {
      showCartErrorToast("Please log in to add items to cart");
      return;
    }
    try {
      const cartItem = {
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        price: normalizedProduct.currentPrice, // Use the computed current price
        image: normalizedProduct.images?.[0] || normalizedProduct.image,
        variant_id: selectedVariant?.id || null,
        variant: selectedVariant
          ? {
              id: selectedVariant.id,
              color: selectedVariant.colors,
              storage: selectedVariant.storage,
              ram: selectedVariant.ram,
              price: selectedVariant.discounted_price || selectedVariant.price,
            }
          : null,
      };

      await addToCartStore(cartItem, quantity); // Pass quantity as separate parameter
      showAddToCartToast(normalizedProduct.name, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showCartErrorToast("Failed to add item to cart");
    }
  };
  const addToWishlist = async () => {
    if (!user) {
      showCartErrorToast("Please log in to add items to wishlist");
      return;
    }
    try {
      const wishlistItem = {
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        price: normalizedProduct.currentPrice, // Use the computed current price
        image: normalizedProduct.images?.[0] || normalizedProduct.image,
        variant_id: selectedVariant?.id || null,
        variant: selectedVariant
          ? {
              id: selectedVariant.id,
              color: selectedVariant.colors,
              storage: selectedVariant.storage,
              ram: selectedVariant.ram,
              price: selectedVariant.discounted_price || selectedVariant.price,
            }
          : null,
      };

      await addToWishlistStore(wishlistItem);
      showAddToCartToast(`${normalizedProduct.name} added to wishlist!`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showCartErrorToast("Failed to add item to wishlist");
    }
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
          className="inline-flex items-center text-brand-primary mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
            {/* Product Images - Left Column on Desktop */}
            <div className="lg:col-span-2">
              <ProductImageGallery
                images={normalizedProduct.images}
                videos={normalizedProduct.videos}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
              />
            </div>
            {/* Product Details - Right Column on Desktop */}
            <div className="lg:col-span-3 flex flex-col">
              <ProductInfo
                product={normalizedProduct}
                selectedVariant={selectedVariant}
              />
              {/* Variant Selector */}
              {normalizedProduct.validOptions?.length > 0 && (
                <div className="border-t border-gray-200 py-4">
                  <ProductVariantSelector
                    validOptions={normalizedProduct.validOptions}
                    selectedVariant={selectedVariant}
                    onVariantChange={handleVariantChange}
                  />
                </div>
              )}
              <div className="border-t border-gray-200 py-4">
                <ProductQuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  stock={normalizedProduct.currentStock}
                  handleQuantityChange={handleQuantityChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />
                <ProductActions
                  price={normalizedProduct.currentPrice}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                />
              </div>
            </div>
          </div>
          {/* Product Details Tabs */}
          <ProductTabs
            product={normalizedProduct}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          {/* Frequently Bought Together Section */}
          <FrequentlyBoughtTogether 
            mainProduct={normalizedProduct}
            category={normalizedProduct.category}
          />
          
          {/* Related Products Section */}
          {normalizedProduct.category && (
            <RelatedProducts
              products={getProductsByCategory(normalizedProduct.category)}
              currentProductId={normalizedProduct.id}
              currentCategory={normalizedProduct.category}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
