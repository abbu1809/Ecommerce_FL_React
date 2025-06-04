// Test data structure mapping for AdminReviews
// This shows how the API response maps to the component

const apiResponse = {
  reviews: [
    {
      comment: "dfghfghfgh",
      created_at: "2025-05-30T15:29:50.180000+00:00",
      is_verified: false,
      rating: 5.0,
      user_id: "YHmyKJrITyePG8UAluPq4f1QpA02",
      email: "priyanshudayal1504@gmail.com",
      helpful_users: [],
      reported_count: 0,
      id: "1gzus81NCBFB4YxvzeGl",
      product_id: "43yeLFAHwePgG09f1agh",
      product_name: "JBL Flip 6",
    },
  ],
  total_count: 1,
};

// Field mappings used in the components:
const fieldMappings = {
  // API Field → Component Usage
  comment: "review.comment", // Review text content
  created_at: "review.created_at", // Date and time
  is_verified: "review.is_verified", // Verified purchase badge
  rating: "review.rating", // Star rating
  user_id: "review.user_id", // Internal user ID
  email: "review.email", // User email and display name
  helpful_users: "review.helpful_users.length", // Helpful count
  reported_count: "review.reported_count", // Flagged status (> 0 = flagged)
  id: "review.id", // Review ID
  product_id: "review.product_id", // Product ID
  product_name: "review.product_name", // Product name

  // Added by store:
  status: "review.status || 'approved'", // Default status for filtering
};

// Statistics calculated:
const calculatedStats = {
  total: "reviews.list.length",
  pending: "reviews with status === 'pending'",
  approved: "reviews with status === 'approved'",
  rejected: "reviews with status === 'rejected'",
  flagged: "reviews with reported_count > 0",
  averageRating: "average of all review.rating",
  verifiedPurchases: "reviews with is_verified === true",
};

export default {
  apiResponse,
  fieldMappings,
  calculatedStats,
};
