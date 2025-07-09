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
    <div className="featured-products">
      <div className="container mx-auto px-4">
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
