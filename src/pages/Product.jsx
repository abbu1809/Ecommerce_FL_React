import React, { useState, useEffect } from "react";
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

const Product = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { currentProduct, loading, error, fetchProduct, clearCurrentProduct } =
    useProductStore();
  const { addItem: addToCartStore } = useCartStore();
  const { addItem: addToWishlistStore } = useWishlistStore();
  const { user } = useAuthStore();

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
  }, [id, fetchProduct, clearCurrentProduct]);

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
    price:
      selectedVariant?.price || product.price || product.original_price || 0,
    discountPrice:
      selectedVariant?.discounted_price ||
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
          title: `${review.rating} star review`,
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
    validOptions: product.valid_options || [],
    selectedColor: selectedVariant?.colors || null,
  }; // Debug normalized product
  console.log("Normalized product data:", normalizedProduct);
  console.log("Selected variant:", selectedVariant);
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const maxStock = selectedVariant?.stock || normalizedProduct.stock;
    if (value > 0 && value <= maxStock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    const maxStock = selectedVariant?.stock || normalizedProduct.stock;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleVariantChange = (option) => {
    console.log("Variant changed to:", option);
    setSelectedVariant(option);
    // Reset quantity to 1 when variant changes
    setQuantity(1);
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
        price: normalizedProduct.discountPrice || normalizedProduct.price,
        image: normalizedProduct.images?.[0] || normalizedProduct.image,
        quantity: quantity,
        variant: selectedVariant
          ? {
              color: selectedVariant.colors,
              price: selectedVariant.discounted_price || selectedVariant.price,
            }
          : null,
      };

      await addToCartStore(cartItem);
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
        price: normalizedProduct.discountPrice || normalizedProduct.price,
        image: normalizedProduct.images?.[0] || normalizedProduct.image,
        variant: selectedVariant
          ? {
              color: selectedVariant.colors,
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
            {/* Product Details - Right Column on Desktop */}{" "}
            <div className="lg:col-span-3 flex flex-col">
              <ProductInfo
                product={normalizedProduct}
                selectedVariant={selectedVariant}
              />{" "}
              {/* Variant Selector */}
              {normalizedProduct.validOptions?.length > 0 ? (
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Available Options
                  </h3>
                  <div className="space-y-2">
                    {normalizedProduct.validOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedVariant?.colors === option.colors
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleVariantChange(option)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{
                                backgroundColor: option.colors.toLowerCase(),
                              }}
                            ></div>
                            <span className="font-medium">{option.colors}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-orange-600">
                              ₹{option.discounted_price?.toLocaleString()}
                            </div>
                            {option.price !== option.discounted_price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{option.price?.toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-gray-600">
                              Stock: {option.stock}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                normalizedProduct.colors?.length > 0 && (
                  <div className="border-t border-gray-200 py-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Available Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {normalizedProduct.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium rounded-full border border-gray-200 bg-gray-50"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
              <div className="border-t border-gray-200 py-4">
                {" "}
                <ProductQuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  stock={normalizedProduct.stock}
                  handleQuantityChange={handleQuantityChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />{" "}
                <ProductActions
                  price={
                    normalizedProduct.discountPrice || normalizedProduct.price
                  }
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
