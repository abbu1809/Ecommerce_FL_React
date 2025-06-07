import React, { useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import Button from "../ui/Button";

const StatusUpdateForm = ({ delivery, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(delivery.status);
  const [otp, setOtp] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Status options for delivery partner
  const statusOptions = [
    {
      value: "Pending",
      label: "Pending",
      icon: <FiPackage />,
      color: "var(--warning-color)",
    },
    {
      value: "Out for Delivery",
      label: "Out for Delivery",
      icon: <FiTruck />,
      color: "var(--brand-secondary)",
    },
    {
      value: "Delivered",
      label: "Delivered",
      icon: <FiCheckCircle />,
      color: "var(--success-color)",
      requiresOtp: true,
    },
    {
      value: "Failed",
      label: "Failed",
      icon: <FiX />,
      color: "var(--error-color)",
      requiresNotes: true,
    },
  ];

  // Find selected status option
  const selectedStatus = statusOptions.find(
    (option) => option.value === newStatus
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate form based on selected status
    if (selectedStatus.requiresOtp && !otp) {
      setError("OTP is required for delivered status");
      return;
    }

    if (selectedStatus.requiresNotes && !notes) {
      setError("Please provide a reason for delivery failure");
      return;
    }

    // Submit status update
    onStatusUpdate({
      status: newStatus,
      otp,
      notes,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="border rounded-lg p-6"
      style={{ borderColor: "var(--border-primary)" }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Update Delivery Status
        </h3>

        {/* Status Selection */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Select Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-3 rounded-lg flex items-center border transition-all duration-200 ${
                  newStatus === option.value
                    ? "border-2"
                    : "hover:border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    newStatus === option.value
                      ? `${option.color}10`
                      : "var(--bg-primary)",
                  borderColor:
                    newStatus === option.value
                      ? option.color
                      : "var(--border-primary)",
                }}
                onClick={() => setNewStatus(option.value)}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{
                    backgroundColor:
                      newStatus === option.value
                        ? `${option.color}20`
                        : "var(--bg-secondary)",
                    color: option.color,
                  }}
                >
                  {option.icon}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* OTP field shown only for delivered status */}
        {selectedStatus?.requiresOtp && (
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Delivery OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-md text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              placeholder="Enter OTP provided by the customer"
            />
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Please collect the OTP from the customer upon delivery
            </p>
          </div>
        )}

        {/* Notes field - always shown but only required for failed delivery */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Notes {selectedStatus?.requiresNotes && "(Required)"}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-md text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
            placeholder={
              selectedStatus?.requiresNotes
                ? "Please provide a reason for delivery failure"
                : "Add any relevant notes (optional)"
            }
            rows={3}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            className="p-3 rounded-md flex items-start"
            style={{
              backgroundColor: "var(--error-color)10",
              color: "var(--error-color)",
            }}
          >
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="transition-transform hover:scale-105"
          >
            Update Status
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StatusUpdateForm;
