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
  const handleSelectionChange = (key, value) => {
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
  };

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

              return (
                <button
                  key={value}
                  onClick={() => handleSelectionChange(key, value)}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
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
