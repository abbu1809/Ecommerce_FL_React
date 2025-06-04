import { create } from "zustand";
import { adminApi } from "../../services/api";

const useAdminReviews = create((set) => ({
  // State for all reviews
  reviews: {
    list: [],
    loading: false,
    error: null,
  },

  // State for reported reviews
  reportedReviews: {
    list: [],
    loading: false,
    error: null,
  },

  // Currently selected review for viewing details
  selectedReview: null,

  // Derived state
  pendingReviews: [],
  flaggedReviews: [],

  // Fetch all product reviews from the API
  fetchReviews: async () => {
    set((state) => ({
      reviews: {
        ...state.reviews,
        loading: true,
        error: null,
      },
    }));
    try {
      const response = await adminApi.get("/admin/reviews/");
      const reviews = response.data.reviews.map((review) => ({
        ...review,
        // Add default status if not present
        status: review.status || "approved",
      }));

      // Process reviews to extract pending and flagged reviews
      // Since the API doesn't include status field, we'll assume all reviews are approved for now
      // You can modify this logic based on your business rules
      const pendingReviews = reviews.filter(
        (review) => review.status === "pending"
      );
      const flaggedReviews = reviews.filter(
        (review) => review.reported_count > 0
      );

      set({
        reviews: {
          list: reviews,
          loading: false,
          error: null,
        },
        pendingReviews,
        flaggedReviews,
      });

      return {
        success: true,
        data: reviews,
      };
    } catch (error) {
      set((state) => ({
        reviews: {
          ...state.reviews,
          loading: false,
          error: error.response?.data?.error || "Failed to fetch reviews",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch reviews",
      };
    }
  },

  // Fetch reported reviews from the API
  fetchReportedReviews: async () => {
    set((state) => ({
      reportedReviews: {
        ...state.reportedReviews,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await adminApi.get("/admin/reviews/reported/");
      const reportedReviews = response.data.reported_reviews;

      set({
        reportedReviews: {
          list: reportedReviews,
          loading: false,
          error: null,
        },
        flaggedReviews: reportedReviews,
      });

      return {
        success: true,
        data: reportedReviews,
      };
    } catch (error) {
      set((state) => ({
        reportedReviews: {
          ...state.reportedReviews,
          loading: false,
          error:
            error.response?.data?.error || "Failed to fetch reported reviews",
        },
      }));

      return {
        success: false,
        error:
          error.response?.data?.error || "Failed to fetch reported reviews",
      };
    }
  },
  // Delete a review by product ID and review ID
  deleteReview: async (productId, reviewId) => {
    set((state) => ({
      reviews: {
        ...state.reviews,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await adminApi.delete(
        `/admin/reviews/${productId}/${reviewId}/delete/`
      );

      if (response.status === 200) {
        // Update all three lists: reviews, pending reviews, and flagged reviews
        set((state) => {
          const updatedReviewsList = state.reviews.list.filter(
            (review) =>
              !(review.id === reviewId && review.product_id === productId)
          );

          // Update pending and flagged reviews based on the updated main list
          const updatedPendingReviews = updatedReviewsList.filter(
            (review) => review.status === "pending"
          );
          const updatedFlaggedReviews = updatedReviewsList.filter(
            (review) => review.reported_count > 0
          );

          return {
            reviews: {
              ...state.reviews,
              list: updatedReviewsList,
              loading: false,
              error: null,
            },
            reportedReviews: {
              ...state.reportedReviews,
              list: state.reportedReviews.list.filter(
                (review) =>
                  !(review.id === reviewId && review.product_id === productId)
              ),
            },
            pendingReviews: updatedPendingReviews,
            flaggedReviews: updatedFlaggedReviews,
          };
        });

        return {
          success: true,
          message: response.data.message,
          updated_rating: response.data.updated_rating,
          total_reviews: response.data.total_reviews,
        };
      }
    } catch (error) {
      set((state) => ({
        reviews: {
          ...state.reviews,
          loading: false,
          error: error.response?.data?.error || "Failed to delete review",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete review",
      };
    }
  },
  // Update review status (approve/reject)
  updateReviewStatus: async (productId, reviewId, newStatus) => {
    set((state) => ({
      reviews: {
        ...state.reviews,
        loading: true,
        error: null,
      },
    }));

    try {
      // In a real application, this would be an API call to update the status
      // Since the backend API for this is not provided in the request, we'll update the state directly
      const response = await adminApi.patch(
        `/admin/reviews/${productId}/${reviewId}/status/`,
        { status: newStatus }
      );

      if (response.status === 200) {
        set((state) => {
          // First, update the review in the main list
          const updatedReviewsList = state.reviews.list.map((review) => {
            if (review.id === reviewId && review.product_id === productId) {
              return { ...review, status: newStatus };
            }
            return review;
          });

          // Update pending and flagged reviews based on the updated list
          const updatedPendingReviews = updatedReviewsList.filter(
            (review) => review.status === "pending"
          );
          const updatedFlaggedReviews = updatedReviewsList.filter(
            (review) => review.reported_count > 0
          );

          return {
            reviews: {
              ...state.reviews,
              list: updatedReviewsList,
              loading: false,
              error: null,
            },
            pendingReviews: updatedPendingReviews,
            flaggedReviews: updatedFlaggedReviews,
          };
        });

        return {
          success: true,
          message: response.data.message || `Review ${newStatus} successfully`,
        };
      }
    } catch (error) {
      set((state) => ({
        reviews: {
          ...state.reviews,
          loading: false,
          error:
            error.response?.data?.error || "Failed to update review status",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to update review status",
      };
    }
  },
  // Set selected review for viewing details
  setSelectedReview: (review) => {
    set({ selectedReview: review });
  },

  // Clear selected review
  clearSelectedReview: () => {
    set({ selectedReview: null });
  },

  // Toggle flagged status of a review
  toggleFlaggedStatus: async (productId, reviewId) => {
    set((state) => ({
      reviews: {
        ...state.reviews,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await adminApi.patch(
        `/admin/reviews/${productId}/${reviewId}/flag/`,
        { toggle: true }
      );

      if (response.status === 200) {
        const isFlagged = response.data.is_flagged;

        set((state) => {
          // Update the review in the main list
          const updatedReviewsList = state.reviews.list.map((review) => {
            if (review.id === reviewId && review.product_id === productId) {
              return {
                ...review,
                flagged: isFlagged,
                reported_count: isFlagged ? review.reported_count || 1 : 0,
              };
            }
            return review;
          });

          // Update flagged reviews based on the updated list
          const updatedFlaggedReviews = updatedReviewsList.filter(
            (review) => review.reported_count > 0 || review.flagged
          );

          return {
            reviews: {
              ...state.reviews,
              list: updatedReviewsList,
              loading: false,
              error: null,
            },
            flaggedReviews: updatedFlaggedReviews,
            reportedReviews: {
              ...state.reportedReviews,
              list: isFlagged
                ? [
                    ...state.reportedReviews.list,
                    updatedReviewsList.find(
                      (r) => r.id === reviewId && r.product_id === productId
                    ),
                  ]
                : state.reportedReviews.list.filter(
                    (r) => !(r.id === reviewId && r.product_id === productId)
                  ),
            },
          };
        });

        return {
          success: true,
          message: isFlagged
            ? "Review flagged successfully"
            : "Review unflagged successfully",
          is_flagged: isFlagged,
        };
      }
    } catch (error) {
      set((state) => ({
        reviews: {
          ...state.reviews,
          loading: false,
          error: error.response?.data?.error || "Failed to toggle flag status",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to toggle flag status",
      };
    }
  },
}));

export default useAdminReviews;
