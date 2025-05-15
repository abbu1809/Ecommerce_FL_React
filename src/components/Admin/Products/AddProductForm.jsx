import React, { useState } from "react";
import { FiX, FiUpload, FiPlus } from "react-icons/fi";

const AddProductForm = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountedPrice: "",
    stockQuantity: "",
    images: [],
    specifications: [{ key: "", value: "" }],
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({
      ...formData,
      specifications: newSpecs,
    });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: "", value: "" }],
    });
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      specifications: newSpecs,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (API call in real app)
    console.log(formData);
    onClose(); // Close modal after submission
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
        }}
      >
        <div
          className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {step === 1
              ? "Add New Product - Basic Information"
              : "Add New Product - Specifications & Media"}
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
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: "var(--border-primary)",
                      borderRadius: "var(--rounded-md)",
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
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: "var(--border-primary)",
                      borderRadius: "var(--rounded-md)",
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Audio">Audio Devices</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: "var(--border-primary)",
                      borderRadius: "var(--rounded-md)",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="discountedPrice"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Discounted Price (₹)
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: "var(--border-primary)",
                      borderRadius: "var(--rounded-md)",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    required
                    min="0"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{
                      borderColor: "var(--border-primary)",
                      borderRadius: "var(--rounded-md)",
                    }}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Feature this product on homepage
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border rounded-md"
                  style={{
                    borderColor: "var(--border-primary)",
                    borderRadius: "var(--rounded-md)",
                  }}
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Product Media */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Images
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center"
                  style={{
                    borderColor: "var(--border-primary)",
                    borderRadius: "var(--rounded-lg)",
                  }}
                >
                  <div className="space-y-1">
                    <div
                      className="mx-auto flex items-center justify-center w-12 h-12 rounded-full"
                      style={{ backgroundColor: "var(--bg-accent-light)" }}
                    >
                      <FiUpload
                        size={24}
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <label
                        htmlFor="file-upload"
                        className="font-medium cursor-pointer"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        Click to upload
                      </label>{" "}
                      or drag and drop
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      PNG, JPG or WEBP (max. 2MB each)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Specifications
                </label>

                {formData.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Feature (e.g. RAM)"
                        value={spec.key}
                        onChange={(e) =>
                          handleSpecChange(index, "key", e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                        style={{
                          borderColor: "var(--border-primary)",
                          borderRadius: "var(--rounded-md)",
                        }}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Value (e.g. 8GB)"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(index, "value", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          style={{
                            borderColor: "var(--border-primary)",
                            borderRadius: "var(--rounded-md)",
                          }}
                        />
                        {formData.specifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="p-2 rounded-md"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--error-color)",
                              borderRadius: "var(--rounded-md)",
                            }}
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSpecification}
                  className="mt-3 flex items-center space-x-1 text-sm"
                  style={{ color: "var(--brand-primary)" }}
                >
                  <FiPlus size={16} /> <span>Add Specification</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Controls */}
          <div
            className="p-6 border-t flex justify-between items-center"
            style={{ borderColor: "var(--border-primary)" }}
          >
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-sm font-medium"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border rounded-md text-sm font-medium"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                Back
              </button>
            )}

            <button
              type={step === 1 ? "button" : "submit"}
              onClick={step === 1 ? () => setStep(2) : undefined}
              className="px-6 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              {step === 1 ? "Next" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
