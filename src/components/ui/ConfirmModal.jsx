import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info, success
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <FiX className="text-red-500" size={24} />;
      case "info":
        return <FiInfo className="text-blue-500" size={24} />;
      case "success":
        return <FiCheckCircle className="text-green-500" size={24} />;
      case "warning":
      default:
        return <FiAlertTriangle className="text-yellow-500" size={24} />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case "danger":
        return "danger";
      case "success":
        return "primary";
      case "info":
        return "primary";
      case "warning":
      default:
        return "primary";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnBackdropClick={!isLoading}
    >
      <div className="p-6">
        {/* Icon and Title */}
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 mr-4 mt-1">{getIcon()}</div>
          <div className="flex-1">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            fullWidth={false}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            isLoading={isLoading}
            fullWidth={false}
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
