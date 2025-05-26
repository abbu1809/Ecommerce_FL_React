import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiPlus, FiTrash2 } from "react-icons/fi";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [step, setStep] = useState(1);
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
    features: [],
    variant: {
      colors: [],
      storage: [],
    },
    featured: false,
  });

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      // Convert specifications object to our format
      const formattedSpecs = product.specifications || {};

      // Format features as array
      const featuresArray = Array.isArray(product.features)
        ? product.features
        : [];

      // Parse price, discount_price and stock to numbers
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat(product.price || 0);
      const discount_price =
        typeof product.discount_price === "number"
          ? product.discount_price
          : parseFloat(product.discount_price || 0);
      const stock =
        typeof product.stock === "number"
          ? product.stock
          : parseInt(product.stock || 0, 10);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category || "",
        price: price,
        discount_price: discount_price,
        discount: product.discount || "",
        stock: stock,
        images: product.images || [],
        specifications: formattedSpecs,
        features: featuresArray,
        variant: product.variant || { colors: [], storage: [] },
        featured: product.featured || false,
      });
    }
  }, [product]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              ? "Edit Product - Basic Information"
              : "Edit Product - Details & Media"}
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
                )}
              </div>

              {/* Variants: Colors */}
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

                {formData.variant.storage.map((option, index) => (
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
                  ))}

                  {formData.images.length < 5 && (
                    <div
                      className="aspect-square border rounded-md flex items-center justify-center"
                      style={{
                        borderColor: "var(--border-primary)",
                        borderStyle: "dashed",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <FiUpload
                          size={20}
                          style={{ color: "var(--text-secondary)" }}
                        />
                        <span
                          className="text-xs mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Add Image
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
                    Save Changes
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

export default EditProductModal;
