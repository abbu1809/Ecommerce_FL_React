import api from "./api";

export const reviewService = {
  // Mark a review as helpful
  markReviewHelpful: async (productId, reviewId) => {
    try {
      const response = await api.post(
        `/products/${productId}/reviews/${reviewId}/helpful/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      let errorMessage = "Failed to mark review as helpful";

      if (error.response?.status === 401) {
        errorMessage = "Please log in to mark reviews as helpful";
      } else if (error.response?.status === 404) {
        errorMessage = "Review not found";
      } else if (error.response?.status === 409) {
        errorMessage = "You have already marked this review as helpful";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Report a review
  reportReview: async (productId, reviewId) => {
    try {
      const response = await api.post(
        `/products/${productId}/reviews/${reviewId}/report/`
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Review reported successfully",
      };
    } catch (error) {
      let errorMessage = "Failed to report review";

      if (error.response?.status === 401) {
        errorMessage = "Please log in to report reviews";
      } else if (error.response?.status === 404) {
        errorMessage = "Review not found";
      } else if (error.response?.status === 409) {
        errorMessage = "You have already reported this review";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
