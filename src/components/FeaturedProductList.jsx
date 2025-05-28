import ProductCard from "./ProductList/ProductCard";

const FeaturedProductList = ({ products }) => {
  // Transform products to match ProductCard expected format
  const transformedProducts = (products || []).map((product) => ({
    ...product,
    id: product.id || product._id,
    name: product.name || `${product.brand} ${product.model || ""}`.trim(),
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : product.image || "https://via.placeholder.com/300x300?text=No+Image",
    discountPrice:
      product.discount_price || product.offer_price || product.price,
    price: product.price,
    discount:
      product.discount ||
      (product.price && product.discount_price
        ? `${Math.round(
            ((product.price - (product.discount_price || product.offer_price)) /
              product.price) *
              100
          )}%`
        : null),
    rating: product.rating || 4.0,
    reviews: product.reviews || product.reviews_count || 0,
    brand: product.brand || "Unknown",
    category: product.category || "General",
    stock: product.stock || 0,
  }));

  return (
    <div className="featured-products py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Featured Products
          </h2>
          <div
            className="h-1 w-24 mx-auto rounded-full"
            style={{
              backgroundColor: "var(--brand-primary)",
            }}
          ></div>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Discover our best-selling items handpicked for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {transformedProducts.length === 0 && (
          <div className="text-center py-8">
            <p style={{ color: "var(--text-secondary)" }}>
              No featured products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductList;
