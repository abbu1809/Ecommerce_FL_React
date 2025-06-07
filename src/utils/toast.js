// Simple toast notification utility
export const showToast = (message, type = "info") => {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);
  // Animate in
  setTimeout(() => {
    toast.classList.add("toast-show");
  }, 100);

  // Remove after delay
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export const toast = {
  success: (message) => showToast(message, "success"),
  error: (message) => showToast(message, "error"),
  warning: (message) => showToast(message, "warning"),
  info: (message) => showToast(message, "info"),
};

// Cart related toasts
export const showAddToCartToast = (productName) => {
  showToast(`${productName} added to your cart!`, "success");
};

export const showRemoveFromCartToast = () => {
  showToast("Item removed from your cart", "info");
};

export const showUpdateCartToast = () => {
  showToast("Cart updated successfully", "success");
};

export const showCartErrorToast = (errorMessage) => {
  showToast(errorMessage || "Error updating cart", "error");
};

// Wishlist related toasts
export const showAddToWishlistToast = (productName) => {
  showToast(`${productName} added to your wishlist!`, "success");
};

export const showRemoveFromWishlistToast = () => {
  showToast("Item removed from your wishlist", "info");
};

export const showWishlistErrorToast = (errorMessage) => {
  showToast(errorMessage || "Error updating wishlist", "error");
};
