import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { usePageContentStore } from "../store/usePageContentStore";
import {
  FiPackage,
  FiUsers,
  FiSend,
  FiFilePlus,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const BulkOrder = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    additionalInfo: "",
  });

  const [products, setProducts] = useState([
    { id: 1, name: "", model: "", quantity: "", remarks: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const {
    content,
    loading: contentLoading,
    fetchPageContent,
    clearContent,
  } = usePageContentStore();

  useEffect(() => {
    fetchPageContent("bulk-order");

    return () => {
      clearContent();
    };
  }, [fetchPageContent, clearContent]);

  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Bulk Order", link: ROUTES.BULK_ORDER },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: "",
        model: "",
        quantity: "",
        remarks: "",
      },
    ]);
  };

  const removeProductRow = (index) => {
    if (products.length > 1) {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    } else {
      toast.error("At least one product is required");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const isFormValid =
      formData.name &&
      formData.email &&
      formData.phone &&
      products.every((p) => p.name && p.quantity);

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Mock API call - replace with actual API
    setTimeout(() => {
      toast.success(
        "Your bulk order inquiry has been submitted. We'll contact you shortly!"
      );

      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstin: "",
        additionalInfo: "",
      });

      setProducts([{ id: 1, name: "", model: "", quantity: "", remarks: "" }]);

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-500">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.link}
                    className="text-gray-500 hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {" "}
            {contentLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : content ? (
              <div
                className="prose max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "white",
                    }}
                  >
                    <FiUsers className="text-2xl" />
                  </div>
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Bulk Orders
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Get special pricing and dedicated support for your business or
                  large quantity orders. Fill out the form below and our team
                  will get in touch with you.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Benefits of Bulk Ordering
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Special Pricing",
                  description:
                    "Get competitive discounts on bulk purchases across all our product categories.",
                },
                {
                  title: "Dedicated Support",
                  description:
                    "Enjoy personalized assistance from our business team throughout the ordering process.",
                },
                {
                  title: "Customized Solutions",
                  description:
                    "Get solutions tailored to your business needs with flexible delivery options.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <h3 className="text-lg font-medium mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">
                Bulk Order Inquiry Form
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Contact Person Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="city"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                          style={{ focusRing: "var(--brand-primary)" }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                          style={{ focusRing: "var(--brand-primary)" }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="pincode"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          PIN Code
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                          style={{ focusRing: "var(--brand-primary)" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="gstin"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        GSTIN (for business customers)
                      </label>
                      <input
                        type="text"
                        id="gstin"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                        style={{ focusRing: "var(--brand-primary)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <h3 className="text-lg font-medium">Product Information</h3>
                    <button
                      type="button"
                      onClick={addProductRow}
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                    >
                      <FiFilePlus className="mr-1" /> Add Product
                    </button>
                  </div>

                  <div className="space-y-6">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className="border border-gray-200 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Product #{index + 1}</h4>
                          {products.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProductRow(index)}
                              className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="mr-1" /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Product Name
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                              style={{ focusRing: "var(--brand-primary)" }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Model/Variant
                            </label>
                            <input
                              type="text"
                              value={product.model}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "model",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                              style={{ focusRing: "var(--brand-primary)" }}
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              min="1"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                              style={{ focusRing: "var(--brand-primary)" }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Special Requirements
                            </label>
                            <input
                              type="text"
                              value={product.remarks}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                              style={{ focusRing: "var(--brand-primary)" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mb-8">
                  <label
                    htmlFor="additionalInfo"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Additional Information or Requirements
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                    style={{ focusRing: "var(--brand-primary)" }}
                    placeholder="Please provide any other details that might help us understand your requirements better."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition duration-300"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Submit Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "What is the minimum quantity for bulk orders?",
                  answer:
                    "We typically consider orders of 10+ units as bulk orders, but this can vary based on the product category and specific items.",
                },
                {
                  question: "How long does it take to process bulk orders?",
                  answer:
                    "Processing time depends on the quantity and product availability. Our team will provide you with an estimated timeline after reviewing your inquiry.",
                },
                {
                  question:
                    "Do you provide installation services for bulk orders?",
                  answer:
                    "Yes, we offer installation and setup services for most products when ordered in bulk. Additional charges may apply based on the scope of work.",
                },
                {
                  question: "Can I get customized products for my business?",
                  answer:
                    "In some cases, we can arrange for customization like company branding or pre-loaded software. Please mention your specific requirements in the inquiry form.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrder;
