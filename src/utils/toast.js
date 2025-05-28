// Simple toast notification utility
export const showToast = (message, type = "info") => {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add styles
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    zIndex: "9999",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    transform: "translateX(100%)",
    opacity: "0",
  });

  // Set colors based on type
  const colors = {
    success: { bg: "#10b981", text: "#ffffff" },
    error: { bg: "#ef4444", text: "#ffffff" },
    warning: { bg: "#f59e0b", text: "#ffffff" },
    info: { bg: "#3b82f6", text: "#ffffff" },
  };

  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;

  // Add to DOM
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 100);

  // Remove after delay
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
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
