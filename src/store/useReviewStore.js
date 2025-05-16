import { create } from "zustand";

const useReviewStore = create((set) => ({
  // All reviews across all products
  reviews: [],

  // Reviews filtered by product
  productReviews: {},

  // Reviews pending approval
  pendingReviews: [],

  // Flagged reviews
  flaggedReviews: [],

  // Add a new review
  addReview: (review) =>
    set((state) => {
      const newReviews = [...state.reviews, { ...review, status: "pending" }];

      // Update product specific reviews
      let updatedProductReviews = { ...state.productReviews };
      if (!updatedProductReviews[review.productId]) {
        updatedProductReviews[review.productId] = [];
      }
      updatedProductReviews[review.productId] = [
        ...updatedProductReviews[review.productId],
        { ...review, status: "pending" },
      ];

      return {
        reviews: newReviews,
        productReviews: updatedProductReviews,
        pendingReviews: [
          ...state.pendingReviews,
          { ...review, status: "pending" },
        ],
      };
    }),

  // Update review status (approve/reject)
  updateReviewStatus: (reviewId, status) =>
    set((state) => {
      const updatedReviews = state.reviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      );

      // Update product specific reviews
      let updatedProductReviews = { ...state.productReviews };
      Object.keys(updatedProductReviews).forEach((productId) => {
        updatedProductReviews[productId] = updatedProductReviews[productId].map(
          (review) => (review.id === reviewId ? { ...review, status } : review)
        );
      });

      // Update pending reviews
      const updatedPendingReviews =
        status === "pending"
          ? state.pendingReviews
          : state.pendingReviews.filter((review) => review.id !== reviewId);

      // Update flagged reviews if needed
      const updatedFlaggedReviews =
        status === "flagged"
          ? [
              ...state.flaggedReviews,
              updatedReviews.find((review) => review.id === reviewId),
            ]
          : state.flaggedReviews.filter((review) => review.id !== reviewId);

      return {
        reviews: updatedReviews,
        productReviews: updatedProductReviews,
        pendingReviews: updatedPendingReviews,
        flaggedReviews: updatedFlaggedReviews,
      };
    }),

  // Delete a review
  deleteReview: (reviewId) =>
    set((state) => {
      // Remove from all reviews
      const updatedReviews = state.reviews.filter(
        (review) => review.id !== reviewId
      );

      // Remove from product specific reviews
      let updatedProductReviews = { ...state.productReviews };
      Object.keys(updatedProductReviews).forEach((productId) => {
        updatedProductReviews[productId] = updatedProductReviews[
          productId
        ].filter((review) => review.id !== reviewId);
      });

      // Remove from pending reviews if it exists there
      const updatedPendingReviews = state.pendingReviews.filter(
        (review) => review.id !== reviewId
      );

      // Remove from flagged reviews if it exists there
      const updatedFlaggedReviews = state.flaggedReviews.filter(
        (review) => review.id !== reviewId
      );

      return {
        reviews: updatedReviews,
        productReviews: updatedProductReviews,
        pendingReviews: updatedPendingReviews,
        flaggedReviews: updatedFlaggedReviews,
      };
    }),

  // Flag or unflag a review
  toggleFlaggedStatus: (reviewId) =>
    set((state) => {
      const review = state.reviews.find((r) => r.id === reviewId);
      if (!review) return state;

      const isFlagged = state.flaggedReviews.some((r) => r.id === reviewId);

      const updatedReviews = state.reviews.map((r) =>
        r.id === reviewId ? { ...r, flagged: !isFlagged } : r
      );

      // Update product specific reviews
      let updatedProductReviews = { ...state.productReviews };
      Object.keys(updatedProductReviews).forEach((productId) => {
        updatedProductReviews[productId] = updatedProductReviews[productId].map(
          (r) => (r.id === reviewId ? { ...r, flagged: !isFlagged } : r)
        );
      });

      // Update flagged reviews list
      const updatedFlaggedReviews = isFlagged
        ? state.flaggedReviews.filter((r) => r.id !== reviewId)
        : [...state.flaggedReviews, { ...review, flagged: true }];

      return {
        reviews: updatedReviews,
        productReviews: updatedProductReviews,
        flaggedReviews: updatedFlaggedReviews,
      };
    }),

  // Mark review as helpful
  markReviewAsHelpful: (reviewId) =>
    set((state) => {
      const updatedReviews = state.reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      );

      // Update product specific reviews
      let updatedProductReviews = { ...state.productReviews };
      Object.keys(updatedProductReviews).forEach((productId) => {
        updatedProductReviews[productId] = updatedProductReviews[productId].map(
          (review) =>
            review.id === reviewId
              ? { ...review, helpful: (review.helpful || 0) + 1 }
              : review
        );
      });

      return {
        reviews: updatedReviews,
        productReviews: updatedProductReviews,
      };
    }),

  // Get reviews for a specific product
  getProductReviews: (productId) => {
    return useReviewStore.getState().productReviews[productId] || [];
  },

  // Fetch reviews (would be an API call in a real app)
  fetchReviews: () => {
    // Mock data - in a real app, this would be an API call
    const mockReviews = [
      // iPhone 13 Pro Max
      {
        id: 1,
        productId: 1,
        productName: "iPhone 13 Pro Max",
        user: "Sanjay Mehta",
        userEmail: "sanjay@example.com",
        rating: 4,
        title: "Great phone but battery could be better",
        comment:
          "I've been using this phone for 2 months now and it's really good. Camera is excellent and performance is smooth. Battery life could be a bit better though.",
        date: "2023-11-15T10:30:00",
        helpful: 12,
        verified: true,
        status: "approved",
        flagged: false,
      },
      {
        id: 2,
        productId: 1,
        user: "Priya Sharma",
        userEmail: "priya.s@example.com",
        rating: 5,
        title: "Best phone I've ever owned!",
        comment:
          "This phone exceeded all my expectations. The display is beautiful and the camera is outstanding. Very happy with my purchase.",
        date: "2023-11-10T14:22:00",
        helpful: 8,
        verified: true,
        status: "approved",
        flagged: false,
      },

      // Samsung Galaxy S22 Ultra
      {
        id: 3,
        productId: 2,
        productName: "Samsung Galaxy S22 Ultra",
        user: "Rahul Gupta",
        userEmail: "rahul.g@example.com",
        rating: 2,
        title: "Disappointing Experience",
        comment:
          "The phone heats up frequently and the battery drains too fast. Not what I expected from a premium phone.",
        date: "2023-11-12T09:15:00",
        helpful: 4,
        verified: true,
        status: "approved",
        flagged: true,
      },

      // Apple MacBook Pro M1
      {
        id: 4,
        productId: 3,
        productName: "Apple MacBook Pro M1",
        user: "Vikram Singh",
        userEmail: "vikram@example.com",
        rating: 5,
        title: "Best laptop I've ever owned",
        comment:
          "This is an amazing laptop. The M1 chip is incredibly fast and the battery life is phenomenal. I can work all day without needing to charge.",
        date: "2023-11-08T16:45:00",
        helpful: 15,
        verified: true,
        status: "approved",
        flagged: false,
      },

      // Apple AirPods Pro
      {
        id: 5,
        productId: 6,
        productName: "Apple AirPods Pro",
        user: "Sneha Patel",
        userEmail: "sneha.p@example.com",
        rating: 4,
        title: "Great sound quality",
        comment:
          "The noise cancellation is excellent and they fit comfortably. The only downside is the battery life could be better.",
        date: "2023-11-05T11:30:00",
        helpful: 9,
        verified: false,
        status: "pending",
        flagged: false,
      },
    ];

    // Process mock data
    const productReviews = {};
    mockReviews.forEach((review) => {
      if (!productReviews[review.productId]) {
        productReviews[review.productId] = [];
      }
      productReviews[review.productId].push(review);
    });

    const pendingReviews = mockReviews.filter(
      (review) => review.status === "pending"
    );
    const flaggedReviews = mockReviews.filter((review) => review.flagged);

    set({
      reviews: mockReviews,
      productReviews,
      pendingReviews,
      flaggedReviews,
    });
  },
}));

export default useReviewStore;
