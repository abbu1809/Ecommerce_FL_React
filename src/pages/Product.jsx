import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ROUTES } from "../utils/constants";
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

  // Mock product data based on ID
  // In a real application, this would be fetched from an API
  const product = {
    id,
    name: "Samsung Galaxy S25 Edge",
    price: 89999,
    discountPrice: 84999,
    discount: "5%",
    rating: 4.5,
    reviews: 128,
    stock: 10,
    category: "Smartphones",
    brand: "Samsung",
    description:
      "Experience the next generation of Samsung Galaxy with the new S25 Edge. Featuring a stunning edge display, powerful performance, and incredible camera capabilities.",
    images: [
      "https://via.placeholder.com/600x600?text=Samsung+S25+Front",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Back",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Side",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Detail",
    ],
    features: [
      "6.7-inch Dynamic AMOLED 2X display",
      "Qualcomm Snapdragon 8 Gen 3 processor",
      "8GB RAM, 256GB storage",
      "50MP + 12MP + 10MP triple rear camera system",
      "4,500mAh battery with fast charging",
      "Android 16 with One UI 6.0",
      "IP68 water and dust resistance",
    ],
    specifications: {
      Display: "6.7-inch Dynamic AMOLED 2X, 3200 x 1440 pixels",
      Processor: "Qualcomm Snapdragon 8 Gen 3",
      RAM: "8GB LPDDR5X",
      Storage: "256GB UFS 4.0",
      "Rear Camera": "50MP (main) + 12MP (ultrawide) + 10MP (telephoto)",
      "Front Camera": "12MP",
      Battery: "4,500mAh",
      Charging: "45W wired, 15W wireless",
      "Operating System": "Android 16 with One UI 6.0",
      Dimensions: "157.4 x 75.8 x 7.6 mm",
      Weight: "195g",
      Connectivity: "5G, Wi-Fi 7, Bluetooth 5.3, NFC",
    },
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
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
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // You could dispatch an action to a global store here
  };

  const addToWishlist = () => {
    // Add to wishlist functionality would be implemented here
    console.log(`Added ${product.name} to wishlist`);
    // You could dispatch an action to a global store here
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", link: ROUTES.HOME },
    { label: product.category, link: ROUTES.PRODUCTS },
    { label: product.brand, link: `/brand/${product.brand}` },
    { label: product.name },
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
              <ProductImageGallery
                images={product.images}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
              />
            </div>

            {/* Product Details - Right Column on Desktop */}
            <div className="lg:col-span-3 flex flex-col">
              <ProductInfo product={product} />

              <div className="border-t border-gray-200 py-4">
                <ProductQuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  stock={product.stock}
                  handleQuantityChange={handleQuantityChange}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />

                <ProductActions
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                />
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
