import React, { useState, useEffect, useCallback } from "react";
import { FiCheck, FiInfo } from "react-icons/fi";

const ProductVariantSelector = ({
  validOptions = [],
  selectedVariant,
  onVariantChange,
}) => {
  const [variantSelections, setVariantSelections] = useState({});
  const [availableOptions, setAvailableOptions] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);

  // Extract all possible variant keys and their values from valid options
  useEffect(() => {
    if (validOptions.length === 0) return;
    const options = {}; // Find all variant keys that exist in valid options
    const allKeys = new Set();
    validOptions.forEach((option) => {
      Object.keys(option).forEach((key) => {
        // Filter out system fields and empty/invalid variant fields
        if (
          !["price", "discounted_price", "stock", "id", "product_id"].includes(
            key
          ) &&
          option[key] !== undefined &&
          option[key] !== null &&
          option[key] !== "" &&
          typeof option[key] === "string" &&
          option[key].trim() !== ""
        ) {
          allKeys.add(key);
        }
      });
    }); // Get unique values for each variant key
    allKeys.forEach((key) => {
      const values = [
        ...new Set(
          validOptions
            .map((option) => option[key])
            .filter(
              (value) =>
                value !== undefined &&
                value !== null &&
                value !== "" &&
                typeof value === "string" &&
                value.trim() !== "" &&
                value.length < 100 // Reasonable length limit
            )
        ),
      ];

      if (values.length > 0) {
        options[key] = values;
      }
    });
    setAvailableOptions(options);
    console.log("Available options:", options);

    // Initialize with first valid option if no variant is selected
    if (!selectedVariant && validOptions.length > 0) {
      const firstOption = validOptions[0];
      console.log("Initializing with first option:", firstOption);
      const initialSelections = {};
      Object.keys(options).forEach((key) => {
        if (firstOption[key] !== undefined) {
          initialSelections[key] = firstOption[key];
        }
      });
      console.log("Initial selections:", initialSelections);
      setVariantSelections(initialSelections);
      // Also call onVariantChange to set the initial variant in parent
      onVariantChange(firstOption);
    }
  }, [validOptions, selectedVariant, onVariantChange]);

  // Update selections when selectedVariant changes
  useEffect(() => {
    console.log("Selected variant changed:", selectedVariant);
    console.log("Available options:", availableOptions);
    if (selectedVariant) {
      const newSelections = {};
      Object.keys(availableOptions).forEach((key) => {
        if (selectedVariant[key] !== undefined) {
          newSelections[key] = selectedVariant[key];
        }
      });
      console.log("Updating variant selections to:", newSelections);
      setVariantSelections(newSelections);
    }
  }, [selectedVariant, availableOptions]);

  const handleSelectionChange = useCallback((key, value) => {
    console.log("Selection change:", key, value);
    const newSelections = { ...variantSelections, [key]: value };
    console.log("New selections:", newSelections);
    setVariantSelections(newSelections);

    // First try to find an exact match
    let matchingOption = validOptions.find((option) => {
      return Object.keys(newSelections).every((selectionKey) => {
        return option[selectionKey] === newSelections[selectionKey];
      });
    });

    // If no exact match, find the option that has the selected key-value pair
    if (!matchingOption) {
      console.log(
        "No exact match found, looking for option with selected value..."
      );
      matchingOption = validOptions.find((option) => {
        return option[key] === value;
      });
    }

    // If still no match, use the first available option
    if (!matchingOption && validOptions.length > 0) {
      console.log("Using first available option as fallback");
      matchingOption = validOptions[0];
    }

    console.log("Selected option:", matchingOption);
    if (matchingOption) {
      console.log("Calling onVariantChange with:", matchingOption);
      onVariantChange(matchingOption);

      // Update all selections to match the found option
      const updatedSelections = {};
      Object.keys(availableOptions).forEach((optionKey) => {
        if (
          matchingOption[optionKey] !== undefined &&
          matchingOption[optionKey] !== null &&
          matchingOption[optionKey] !== ""
        ) {
          updatedSelections[optionKey] = matchingOption[optionKey];
        }
      });
      setVariantSelections(updatedSelections);
    }
  }, [variantSelections, validOptions, availableOptions, onVariantChange]);

  const getDisplayName = (key) => {
    // Just format the key name properly - no custom renaming
    return (
      key.charAt(0).toUpperCase() +
      key
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim()
    );
  };

  const formatValue = (key, value) => {
    if (key === "storage") {
      return value.toString().toUpperCase();
    }
    if (key === "ram") {
      return value.toString().includes("GB") ? value : `${value}GB`;
    }
    if (key === "size") {
      return value.toString().includes("p") ? value : `${value}`;
    }
    if (key === "colors") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    // For any other key, just return the value as is
    return value.toString();
  };

  // Get the current variant's details for the selected options
  const getCurrentVariantDetails = () => {
    if (!selectedVariant) return null;
    
    return {
      price: selectedVariant.price || 0,
      discountedPrice: selectedVariant.discounted_price || selectedVariant.price || 0,
      stock: selectedVariant.stock || 0,
      savings: selectedVariant.price && selectedVariant.discounted_price && selectedVariant.price > selectedVariant.discounted_price 
        ? selectedVariant.price - selectedVariant.discounted_price 
        : 0
    };
  };

  const variantDetails = getCurrentVariantDetails();

  console.log("ProductVariantSelector rendered with:", {
    validOptions,
    selectedVariant,
    variantSelections,
    availableOptions,
  });

  if (!validOptions.length || !Object.keys(availableOptions).length) {
    console.log("No valid options or available options, returning null");
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(availableOptions).map(([key, values]) => (
        <div key={key}>
          <h4 className="text-sm font-medium mb-3 flex items-center" style={{ color: "var(--text-primary)" }}>
            {getDisplayName(key)}:
            {variantSelections[key] && (
              <span className="ml-2 font-normal" style={{ color: "var(--brand-primary)" }}>
                {formatValue(key, variantSelections[key])}
              </span>
            )}
            {variantDetails && key === 'storage' && (
              <div className="ml-auto flex items-center text-xs">
                <span style={{ color: "var(--text-secondary)" }}>
                  Stock: {variantDetails.stock} units
                </span>
              </div>
            )}
          </h4>
          <div className="flex flex-wrap gap-3">
            {values.map((value) => {
              const isSelected = variantSelections[key] === value;
              
              // Find if this specific value has stock by checking valid options
              const optionWithThisValue = validOptions.find(option => option[key] === value);
              const hasStock = optionWithThisValue?.stock > 0;
              const stockCount = optionWithThisValue?.stock || 0;

              return (
                <div key={value} className="relative">
                  <button
                    onClick={() => handleSelectionChange(key, value)}
                    onMouseEnter={() => setShowTooltip(`${key}-${value}`)}
                    onMouseLeave={() => setShowTooltip(null)}
                    disabled={!hasStock}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 relative hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : hasStock 
                          ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    style={{
                      ...(isSelected && {
                        borderColor: "var(--brand-primary)",
                        backgroundColor: "var(--bg-accent-light)",
                        color: "var(--brand-primary)",
                      }),
                      ...(hasStock && !isSelected && {
                        borderColor: "var(--border-primary)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                      })
                    }}
                  >
                    {formatValue(key, value)}
                    {isSelected && (
                      <FiCheck className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full p-1" 
                             style={{ backgroundColor: "var(--brand-primary)" }} />
                    )}
                    {!hasStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </button>
                  
                  {/* Tooltip for variant info */}
                  {showTooltip === `${key}-${value}` && optionWithThisValue && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <FiInfo className="w-3 h-3" />
                          <span>
                            ₹{optionWithThisValue.discounted_price?.toLocaleString() || optionWithThisValue.price?.toLocaleString()}
                            {optionWithThisValue.price && optionWithThisValue.discounted_price && optionWithThisValue.price > optionWithThisValue.discounted_price && (
                              <span className="ml-1 line-through text-gray-400">
                                ₹{optionWithThisValue.price.toLocaleString()}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="text-center mt-1">
                          Stock: {stockCount} units
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Price Summary for selected variant */}
      {variantDetails && (
        <div className="mt-4 p-4 rounded-lg border" style={{ 
          backgroundColor: "var(--bg-secondary)", 
          borderColor: "var(--border-primary)" 
        }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Selected variant price:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
                  ₹{variantDetails.discountedPrice.toLocaleString()}
                </span>
                {variantDetails.savings > 0 && (
                  <>
                    <span className="text-sm line-through" style={{ color: "var(--text-secondary)" }}>
                      ₹{variantDetails.price.toLocaleString()}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Save ₹{variantDetails.savings.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                variantDetails.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {variantDetails.stock > 0 ? `${variantDetails.stock} in stock` : 'Out of stock'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
