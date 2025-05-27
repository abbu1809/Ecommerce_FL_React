import { useState, useCallback } from "react";

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "warning",
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const showConfirm = useCallback((config) => {
    setModalConfig({
      title: config.title || "Confirm Action",
      message: config.message || "Are you sure you want to proceed?",
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      type: config.type || "warning",
      onConfirm: config.onConfirm || (() => {}),
    });
    setIsOpen(true);
    setIsLoading(false);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
  }, []);
  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await modalConfig.onConfirm();
      hideConfirm();
    } catch (err) {
      console.error("Error in confirm action:", err);
      setIsLoading(false);
      // Keep modal open on error
    }
  }, [modalConfig, hideConfirm]);

  return {
    isOpen,
    modalConfig,
    isLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  };
};
