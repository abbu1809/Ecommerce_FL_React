import { FiX, FiStar, FiEdit } from "react-icons/fi";

const ViewProductModal = ({ product, onClose, onEdit }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
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
            Product Details
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center px-3 py-1.5 rounded-md text-sm"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              <FiEdit size={16} className="mr-1" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="mb-3 aspect-square rounded-lg overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/400"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images?.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden"
                  >
                    <img
                      src={img || "https://via.placeholder.com/80"}
                      alt={`${product.name} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1
                  className="text-2xl font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {product.name}
                </h1>
                <div className="flex items-center mb-2">
                  <span
                    style={{ color: "var(--text-secondary)" }}
                    className="text-sm"
                  >
                    Brand: <span className="font-medium">{product.brand}</span>
                  </span>
                  <span
                    className="mx-2"
                    style={{ color: "var(--border-primary)" }}
                  >
                    |
                  </span>
                  <span
                    style={{ color: "var(--text-secondary)" }}
                    className="text-sm"
                  >
                    Category:{" "}
                    <span className="font-medium">{product.category}</span>
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <div
                    className="flex items-center"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    <FiStar className="fill-current" />
                    <span className="ml-1">{product.rating}</span>
                  </div>
                  <span
                    className="mx-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.reviews} reviews
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <span
                    className="text-2xl font-bold mr-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{product.discount_price?.toLocaleString()}
                  </span>
                  {product.discount && (
                    <>
                      <span
                        className="text-lg line-through mr-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          color: "var(--success-color)",
                        }}
                      >
                        {product.discount} OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="mb-4">
                  <span
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Stock:
                  </span>
                  <div className="flex items-center">
                    <span
                      className="px-2 py-1 rounded text-sm font-medium"
                      style={{
                        backgroundColor:
                          product.stock > 0
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                        color:
                          product.stock > 0
                            ? "var(--success-color)"
                            : "var(--error-color)",
                      }}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Description
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Key Features
                  </h3>
                  <ul
                    className="list-disc pl-5 text-sm space-y-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3
                      className="text-lg font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span
                              className="font-medium capitalize"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Variants */}
              {product.variant && (
                <div className="space-y-4">
                  {product.variant.colors &&
                    product.variant.colors.length > 0 && (
                      <div>
                        <h3
                          className="text-sm font-medium mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Available Colors
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.variant.colors.map((color) => (
                            <span
                              key={color}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid",
                                borderColor: "var(--border-primary)",
                              }}
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {product.variant.storage &&
                    product.variant.storage.length > 0 && (
                      <div>
                        <h3
                          className="text-sm font-medium mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Available Storage Options
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.variant.storage.map((option) => (
                            <span
                              key={option}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid",
                                borderColor: "var(--border-primary)",
                              }}
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
