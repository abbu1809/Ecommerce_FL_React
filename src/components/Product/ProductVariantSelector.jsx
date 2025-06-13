import React, { useState, useEffect } from "react";

const ProductVariantSelector = ({
  validOptions = [],
  selectedVariant,
  onVariantChange,
}) => {
  const [variantSelections, setVariantSelections] = useState({});
  const [availableOptions, setAvailableOptions] = useState({});

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
                !value.includes("fgh") && // Filter out test data
                !value.includes("dfg") && // Filter out test data
                value.length < 50 // Reasonable length limit
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
  const handleSelectionChange = (key, value) => {
    console.log("Selection change:", key, value);
    const newSelections = { ...variantSelections, [key]: value };
    console.log("New selections:", newSelections);
    setVariantSelections(newSelections);

    // Find matching valid option
    const matchingOption = validOptions.find((option) => {
      return Object.keys(newSelections).every((selectionKey) => {
        return option[selectionKey] === newSelections[selectionKey];
      });
    });

    console.log("Matching option found:", matchingOption);
    if (matchingOption) {
      console.log("Calling onVariantChange with:", matchingOption);
      onVariantChange(matchingOption);
    } else {
      console.log("No exact match found, looking for partial match...");
      // Try to find a partial match or fallback
      const partialMatch = validOptions.find((option) => {
        return option[key] === value;
      });
      if (partialMatch) {
        console.log("Using partial match:", partialMatch);
        onVariantChange(partialMatch);
        // Update selections to match the partial match
        const updatedSelections = {};
        Object.keys(availableOptions).forEach((optionKey) => {
          if (partialMatch[optionKey] !== undefined) {
            updatedSelections[optionKey] = partialMatch[optionKey];
          }
        });
        setVariantSelections(updatedSelections);
      }
    }
  };

  const isOptionAvailable = (key, value) => {
    // Check if this combination would result in a valid option
    const testSelections = { ...variantSelections, [key]: value };

    return validOptions.some((option) => {
      return Object.keys(testSelections).every((selectionKey) => {
        return option[selectionKey] === testSelections[selectionKey];
      });
    });
  };
  const getDisplayName = (key) => {
    const displayNames = {
      colors: "Color",
      storage: "Storage",
      ram: "RAM",
      size: "Screen Size",
      resolution: "Resolution",
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
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
    return value;
  };
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
    <div className="space-y-4">
      {Object.entries(availableOptions).map(([key, values]) => (
        <div key={key}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {getDisplayName(key)}:
          </h4>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = variantSelections[key] === value;
              const isAvailable = isOptionAvailable(key, value);

              return (
                <button
                  key={value}
                  onClick={() => handleSelectionChange(key, value)}
                  disabled={!isAvailable}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : isAvailable
                      ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {key === "colors" && (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: value.toLowerCase() }}
                      />
                      <span>{formatValue(key, value)}</span>
                    </div>
                  )}
                  {key !== "colors" && formatValue(key, value)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
