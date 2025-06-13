import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiPlus, FiTrash2, FiCamera } from "react-icons/fi";
import useAdminProducts from "../../../store/Admin/useAdminProducts";
import { toast } from "../../../utils/toast";

const AddProductForm = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { uploadProductImage } = useAdminProducts();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discount_price: "",
    discount: "",
    stock: "",
    images: [],
    specifications: {},
    attributes: {},
    features: [],
    variant: {
      colors: [],
      storage: [],
    },
    valid_options: [],
    featured: false,
    rating: 0,
    reviews: 0,
  });

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const result = await uploadProductImage(file);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result.imageUrl].slice(0, 5),
        }));
        toast.info("Image uploaded successfully.");
      } else {
        toast.error("Failed to upload image: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle specification change
  const handleSpecChange = (key, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [key]: value,
      },
    });
  };

  // Add new specification
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        "": "",
      },
    });
  };
  // Remove specification
  const removeSpecification = (keyToRemove) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[keyToRemove];
    setFormData({
      ...formData,
      specifications: newSpecs,
    });
  };

  // Handle attribute change
  const handleAttributeChange = (key, value) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [key]: value,
      },
    });
  };

  // Handle attribute key update (when the user changes the name of an attribute key)
  const handleAttributeKeyUpdate = (oldKey, newKey, currentValue) => {
    setFormData((prevFormData) => {
      if (oldKey === newKey) {
        // Key hasn't actually changed, no update needed.
        return prevFormData;
      }

      const currentAttributes = { ...prevFormData.attributes };

      // Check if the new key already exists and is different from the old key.
      // This prevents overwriting another attribute.
      if (Object.prototype.hasOwnProperty.call(currentAttributes, newKey)) {
        toast.error(
          `Attribute key "${newKey}" already exists. Please use a unique key.`
        );
        return prevFormData;
      }

      // Delete the old attribute key and add the new one with the existing value.
      delete currentAttributes[oldKey];
      currentAttributes[newKey] = currentValue;

      return {
        ...prevFormData,
        attributes: currentAttributes,
      };
    });
  };

  // Add new attribute
  const addAttribute = () => {
    setFormData((prevFormData) => {
      const currentAttributes = prevFormData.attributes;
      let baseName = "";
      let newKey = baseName;
      let counter = 0;

      // Generate a unique key (e.g., NewKey, NewKey1, NewKey2, ...)
      while (Object.prototype.hasOwnProperty.call(currentAttributes, newKey)) {
        counter++;
        newKey = `${baseName}${counter}`;
      }

      return {
        ...prevFormData,
        attributes: {
          ...currentAttributes,
          [newKey]: "", // Add new attribute with a unique placeholder key
        },
      };
    });
  };

  // Remove attribute
  const removeAttribute = (keyToRemove) => {
    const newAttributes = { ...formData.attributes };
    delete newAttributes[keyToRemove];
    setFormData({
      ...formData,
      attributes: newAttributes,
    });
  };

  // Handle feature array changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  // Handle variant changes
  const handleVariantChange = (type, index, value) => {
    const newVariant = { ...formData.variant };
    newVariant[type][index] = value;
    setFormData({
      ...formData,
      variant: newVariant,
    });
  };

  const addVariantOption = (type) => {
    const newVariant = { ...formData.variant };
    newVariant[type] = [...(newVariant[type] || []), ""];

    setFormData({
      ...formData,
      variant: newVariant,
    });
  };
  const removeVariantOption = (type, index) => {
    const newVariant = { ...formData.variant };
    newVariant[type] = newVariant[type].filter((_, i) => i !== index);

    setFormData({
      ...formData,
      variant: newVariant,
    });
  };

  // Valid Options handlers
  const addValidOption = () => {
    const newOption = {
      colors: "",
      storage: "",
      ram: "",
      size: "",
      price: 0,
      discounted_price: 0,
      stock: 0,
    };
    setFormData({
      ...formData,
      valid_options: [...formData.valid_options, newOption],
    });
  };

  const removeValidOption = (index) => {
    const newValidOptions = formData.valid_options.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      valid_options: newValidOptions,
    });
  };

  const handleValidOptionChange = (index, field, value) => {
    const newValidOptions = [...formData.valid_options];
    newValidOptions[index] = {
      ...newValidOptions[index],
      [field]:
        field === "price" || field === "discounted_price" || field === "stock"
          ? parseFloat(value) || 0
          : value,
    };
    setFormData({
      ...formData,
      valid_options: newValidOptions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      discount_price: parseFloat(formData.discount_price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviews: parseInt(formData.reviews, 10) || 0,
    };

    if (onSave) {
      onSave(processedData);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
        }}
      >
        <div
          className="flex justify-between items-center p-6 border-b sticky top-0 z-10"
          style={{
            borderColor: "var(--border-primary)",
            backgroundColor: "var(--bg-primary)",
          }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {step === 1
              ? "Add New Product - Basic Information"
              : "Add New Product - Details & Media"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    <option value="">Select a category</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="TV">TV</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      MRP (₹) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount_price"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="discount_price"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Discount %
                    </label>
                    <input
                      type="text"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  ></textarea>
                </div>
              </div>

              <div
                className="flex justify-end pt-4 border-t"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    Next: Details & Images
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Features */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Key Features
                  </h3>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Feature
                  </button>
                </div>

                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="flex-grow p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 p-1.5 rounded-md"
                      style={{ color: "var(--error-color)" }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Specifications */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Specifications
                  </h3>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Specification
                  </button>
                </div>
                {Object.entries(formData.specifications).map(
                  ([key, value], index) => (
                    <div key={index} className="flex items-center mb-2 gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...formData.specifications };
                          const oldValue = newSpecs[key];
                          delete newSpecs[key];
                          setFormData({
                            ...formData,
                            specifications: {
                              ...newSpecs,
                              [e.target.value]: oldValue,
                            },
                          });
                        }}
                        className="flex-grow p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Specification name"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        className="flex-grow p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Specification value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="p-1.5 rounded-md"
                        style={{ color: "var(--error-color)" }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )
                )}{" "}
              </div>

              {/* Attributes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Attributes
                  </h3>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Attribute
                  </button>
                </div>

                <div className="space-y-4">
                  <h4
                    className="text-md font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Attributes
                  </h4>
                  {Object.entries(formData.attributes).map(([key, value]) => (
                    <EditableAttributeRow
                      key={key} // React key is still the attribute name from formData
                      initialKey={key}
                      initialValue={value}
                      onKeyCommit={handleAttributeKeyUpdate}
                      onValueChange={handleAttributeChange}
                      onDelete={removeAttribute}
                      styleProps={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    <FiPlus /> Add Attribute
                  </button>
                </div>
              </div>

              {/* Valid Options Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Valid Options (Variants with Price & Stock)
                  </h3>
                  <button
                    type="button"
                    onClick={addValidOption}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Option
                  </button>
                </div>

                {formData.valid_options.map((option, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md mb-3"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={option.colors || ""}
                        onChange={(e) =>
                          handleValidOptionChange(
                            index,
                            "colors",
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Color"
                      />
                      <input
                        type="text"
                        value={option.storage || ""}
                        onChange={(e) =>
                          handleValidOptionChange(
                            index,
                            "storage",
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Storage"
                      />
                      <input
                        type="text"
                        value={option.ram || ""}
                        onChange={(e) =>
                          handleValidOptionChange(index, "ram", e.target.value)
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="RAM"
                      />
                      <input
                        type="text"
                        value={option.size || ""}
                        onChange={(e) =>
                          handleValidOptionChange(index, "size", e.target.value)
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Size/Resolution"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={option.price || ""}
                        onChange={(e) =>
                          handleValidOptionChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={option.discounted_price || ""}
                        onChange={(e) =>
                          handleValidOptionChange(
                            index,
                            "discounted_price",
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Discounted Price"
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={option.stock || ""}
                        onChange={(e) =>
                          handleValidOptionChange(
                            index,
                            "stock",
                            e.target.value
                          )
                        }
                        className="p-2 border rounded-md text-sm"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                        placeholder="Stock"
                        min="0"
                        step="1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeValidOption(index)}
                      className="mt-2 p-1.5 rounded-md"
                      style={{ color: "var(--error-color)" }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Legacy Variants: Colors (for backward compatibility) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Available Colors
                  </h3>
                  <button
                    type="button"
                    onClick={() => addVariantOption("colors")}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Color
                  </button>
                </div>

                {formData.variant.colors.map((color, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) =>
                        handleVariantChange("colors", index, e.target.value)
                      }
                      className="flex-grow p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                      placeholder="Color name"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantOption("colors", index)}
                      className="ml-2 p-1.5 rounded-md"
                      style={{ color: "var(--error-color)" }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Variants: Storage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Storage Options
                  </h3>
                  <button
                    type="button"
                    onClick={() => addVariantOption("storage")}
                    className="text-xs flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiPlus size={14} className="mr-1" /> Add Storage Option
                  </button>
                </div>

                {formData.variant.storage?.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleVariantChange("storage", index, e.target.value)
                      }
                      className="flex-grow p-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-primary)",
                      }}
                      placeholder="Storage option"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantOption("storage", index)}
                      className="ml-2 p-1.5 rounded-md"
                      style={{ color: "var(--error-color)" }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Images */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Images
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square border rounded-md overflow-hidden"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...formData.images];
                          newImages.splice(index, 1);
                          setFormData({
                            ...formData,
                            images: newImages,
                          });
                        }}
                        className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white rounded-bl-md"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}{" "}
                  {formData.images.length < 5 && (
                    <div
                      className="aspect-square border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: "var(--border-primary)",
                        borderStyle: "dashed",
                      }}
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        ) : (
                          <FiCamera
                            size={20}
                            style={{ color: "var(--text-secondary)" }}
                          />
                        )}
                        <span
                          className="text-xs mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {uploadingImage ? "Uploading..." : "Add Image"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Featured product (show on homepage)
                  </label>
                </div>
              </div>

              <div
                className="flex justify-between pt-4 border-t"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Component for rendering and managing an individual attribute row
const EditableAttributeRow = ({
  initialKey,
  initialValue,
  onKeyCommit,
  onValueChange,
  onDelete,
  styleProps,
}) => {
  const [draftKey, setDraftKey] = useState(initialKey);
  const [draftValue, setDraftValue] = useState(initialValue);

  useEffect(() => {
    setDraftKey(initialKey);
  }, [initialKey]);

  useEffect(() => {
    setDraftValue(initialValue);
  }, [initialValue]);

  const handleKeyInputChange = (e) => {
    setDraftKey(e.target.value);
  };

  const handleKeyCommitOnBlur = () => {
    if (draftKey !== initialKey) {
      onKeyCommit(initialKey, draftKey, draftValue);
    }
  };

  const handleValueInputChange = (e) => {
    setDraftValue(e.target.value); // Only update local draft state
  };

  const handleValueCommitOnBlur = () => {
    // Commit the drafted value to the parent state if it has changed
    if (draftValue !== initialValue) {
      onValueChange(initialKey, draftValue); // Use initialKey as the key for this value
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={draftKey}
        onChange={handleKeyInputChange}
        onBlur={handleKeyCommitOnBlur}
        placeholder="Attribute Name"
        className="w-1/2 p-2 border rounded-md text-sm"
        style={styleProps}
      />
      <input
        type="text"
        value={draftValue}
        onChange={handleValueInputChange} // Changed to only update local state
        onBlur={handleValueCommitOnBlur} // Added: commits to parent on blur
        placeholder="Attribute Value"
        className="w-1/2 p-2 border rounded-md text-sm"
        style={styleProps}
      />
      <button
        type="button"
        onClick={() => onDelete(initialKey)}
        className="p-2 text-red-500 hover:text-red-700"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default AddProductForm;
