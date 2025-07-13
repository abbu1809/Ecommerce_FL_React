import React, { useState, useEffect } from "react";
import { FiPlus, FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "../../store/useCart";
import { useProductStore } from "../../store/useProduct";
import toast from "react-hot-toast";

const FrequentlyBoughtTogether = ({ currentProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { addItem: addToCart } = useCartStore();
  const { products } = useProductStore();

  useEffect(() => {
    // Get products from the same category as frequently bought together
    if (currentProduct && products.length > 0) {
      const related = products
        .filter(product => 
          product.id !== currentProduct.id && 
          product.category === currentProduct.category
        )
        .sort(() => 0.5 - Math.random()) // Random shuffle
        .slice(0, 3); // Take first 3

      setRelatedProducts(related);
      
      // Initially select the current product and first related product
      const initialSelection = [currentProduct];
      if (related.length > 0) {
        initialSelection.push(related[0]);
      }
      setSelectedProducts(initialSelection);
    }
  }, [currentProduct, products]);

  useEffect(() => {
    // Calculate total price whenever selection changes
    const total = selectedProducts.reduce((sum, product) => {
      const price = product.discountPrice || product.discount_price || product.price || 0;
      return sum + price;
    }, 0);
    setTotalPrice(total);
  }, [selectedProducts]);

  const toggleProductSelection = (product) => {
    if (product.id === currentProduct.id) return; // Can't deselect main product

    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const addAllToCart = () => {
    try {
      selectedProducts.forEach(product => {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.discountPrice || product.discount_price || product.price || 0,
          image: product.images?.[0] || product.image || '',
          quantity: 1
        });
      });
      toast.success(`Added ${selectedProducts.length} items to cart!`);
    } catch (error) {
      toast.error('Failed to add items to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const getProductPrice = (product) => {
    return product.discountPrice || product.discount_price || product.price || 0;
  };

  if (!currentProduct || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Frequently Bought Together
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Selection Area */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4">
            {/* Current Product (always selected) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 border-2 border-blue-500 rounded-lg overflow-hidden bg-blue-50">
                  <img
                    src={currentProduct.images?.[0] || currentProduct.image || '/placeholder.jpg'}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              </div>
              <p className="text-xs text-center mt-2 max-w-20 truncate">
                {currentProduct.name}
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
                ₹{getProductPrice(currentProduct).toLocaleString()}
              </p>
            </div>

            {/* Plus Icon */}
            <FiPlus className="text-gray-400 text-xl" />

            {/* Related Products */}
            {relatedProducts.map((product, index) => {
              const isSelected = selectedProducts.some(p => p.id === product.id);
              
              return (
                <React.Fragment key={product.id}>
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => toggleProductSelection(product)}
                    >
                      <div className={`w-24 h-24 border-2 rounded-lg overflow-hidden transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <img
                          src={product.images?.[0] || product.image || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-center mt-2 max-w-20 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
                      ₹{getProductPrice(product).toLocaleString()}
                    </p>
                  </div>
                  {index < relatedProducts.length - 1 && (
                    <FiPlus className="text-gray-400 text-xl" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="lg:w-80 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-4" style={{ color: "var(--text-primary)" }}>
            Bundle Summary
          </h3>
          
          <div className="space-y-2 mb-4">
            {selectedProducts.map(product => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="truncate mr-2">{product.name}</span>
                <span className="font-medium">
                  ₹{getProductPrice(product).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Total:
              </span>
              <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={addAllToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              disabled={selectedProducts.length === 0}
            >
              <FiShoppingCart />
              Add {selectedProducts.length} Items to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
