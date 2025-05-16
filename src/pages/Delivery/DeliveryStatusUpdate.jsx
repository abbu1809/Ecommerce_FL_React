import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiCheck,
  FiAlertTriangle,
  FiCamera,
  FiImage,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { DeliveryLayout } from "../../components/Delivery";
import { StatusUpdateForm } from "../../components/Delivery";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

const DeliveryStatusUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  // Mock deliveries for the status update page when no specific ID is provided
  const mockDeliveries = [
    {
      id: "DEL-12345",
      orderId: "ORD-7890",
      customerName: "Sarah Johnson",
      customerAddress: "123 Main St, Apt 4B, Springfield",
      customerPhone: "555-123-4567",
      status: "out_for_delivery",
      items: [
        { name: "Smartphone XYZ", quantity: 1 },
        { name: "Phone Case", quantity: 1 },
      ],
      expectedDelivery: "2023-06-20T15:00:00Z",
      assignedOn: "2023-06-20T09:30:00Z",
    },
    {
      id: "DEL-12346",
      orderId: "ORD-7891",
      customerName: "Michael Brown",
      customerAddress: "456 Oak Ave, Suite 7, Rivertown",
      customerPhone: "555-234-5678",
      status: "assigned",
      items: [
        { name: "Laptop Pro", quantity: 1 },
        { name: "Wireless Mouse", quantity: 1 },
        { name: "Laptop Stand", quantity: 1 },
      ],
      expectedDelivery: "2023-06-20T17:30:00Z",
      assignedOn: "2023-06-20T10:15:00Z",
    },
    {
      id: "DEL-12347",
      orderId: "ORD-7892",
      customerName: "Emily Wilson",
      customerAddress: "789 Pine Rd, Lakeside",
      customerPhone: "555-345-6789",
      status: "out_for_delivery",
      items: [
        { name: "Wireless Headphones", quantity: 1 },
        { name: "Bluetooth Speaker", quantity: 1 },
      ],
      expectedDelivery: "2023-06-20T16:45:00Z",
      assignedOn: "2023-06-20T11:00:00Z",
    },
  ];

  // Load delivery data based on ID parameter
  useEffect(() => {
    if (id) {
      fetchDeliveryById(id);
    } else {
      // If no ID provided, show the list of deliveries
      setDeliveries(mockDeliveries);
    }
  }, [id]);

  // Fetch delivery details by ID
  const fetchDeliveryById = async (deliveryId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the delivery in mock data
      const foundDelivery = mockDeliveries.find((d) => d.id === deliveryId);

      if (foundDelivery) {
        setDelivery(foundDelivery);
      } else {
        throw new Error("Delivery not found");
      }
    } catch (error) {
      setError("Failed to load delivery information. Please try again.");
      console.error("Error fetching delivery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search for deliveries
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setDeliveries(mockDeliveries);
      return;
    }

    const filtered = mockDeliveries.filter(
      (delivery) =>
        delivery.id.toLowerCase().includes(query) ||
        delivery.orderId.toLowerCase().includes(query) ||
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.customerAddress.toLowerCase().includes(query)
    );

    setDeliveries(filtered);
  };

  // Handle selecting a delivery from the list
  const handleSelectDelivery = (deliveryId) => {
    navigate(`/delivery/update/${deliveryId}`);
  };

  // Handle status update submission
  const handleStatusUpdate = async (statusData) => {
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to assignments after successful update
      navigate("/delivery/assignments", {
        state: {
          message: "Status updated successfully!",
          type: "success",
        },
      });
    } catch (error) {
      setError("Failed to update status. Please try again.");
      console.error("Error updating status:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // If no ID is provided, show the list of deliveries for status update
  if (!id) {
    return (
      <DeliveryLayout>
        <div className="w-full">
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Update Delivery Status
          </h1>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Address..."
              value={searchQuery}
              onChange={handleSearch}
              icon={<FiSearch />}
            />
          </div>

          {deliveries.length === 0 ? (
            <div
              className="p-6 text-center rounded-lg"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
              }}
            >
              <FiPackage className="h-12 w-12 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No deliveries found</h3>
              <p className="mt-2">
                Try a different search term or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-4 rounded-lg cursor-pointer transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderLeft: "4px solid var(--brand-primary)",
                  }}
                  onClick={() => handleSelectDelivery(delivery.id)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className="text-lg font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {delivery.customerName}
                      </h3>
                      <p style={{ color: "var(--text-secondary)" }}>
                        {delivery.customerAddress}
                      </p>
                      <div className="mt-2 flex items-center">
                        <span
                          className="text-sm px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              delivery.status === "delivered"
                                ? "var(--success-color)20"
                                : delivery.status === "failed"
                                ? "var(--error-color)20"
                                : "var(--warning-color)20",
                            color:
                              delivery.status === "delivered"
                                ? "var(--success-color)"
                                : delivery.status === "failed"
                                ? "var(--error-color)"
                                : "var(--warning-color)",
                          }}
                        >
                          {delivery.status === "assigned"
                            ? "Assigned"
                            : delivery.status === "out_for_delivery"
                            ? "Out For Delivery"
                            : delivery.status === "delivered"
                            ? "Delivered"
                            : "Failed"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {delivery.id}
                      </span>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Order: {delivery.orderId}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/delivery/assignments")}
            className="flex items-center text-sm font-medium mb-4"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiArrowLeft className="mr-2" /> Back to Assignments
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Update Delivery Status
              </h1>
              <div className="flex items-center mt-2">
                <span
                  className="text-sm font-medium mr-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Delivery ID:
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {delivery.id}
                </span>
                <span
                  className="mx-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  •
                </span>
                <span
                  className="text-sm font-medium mr-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Order:
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {delivery.orderId}
                </span>
              </div>
            </div>

            <div
              className="mt-4 md:mt-0 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor:
                  delivery.status === "delivered"
                    ? "var(--success-color)20"
                    : delivery.status === "failed"
                    ? "var(--error-color)20"
                    : "var(--brand-primary)20",
                color:
                  delivery.status === "delivered"
                    ? "var(--success-color)"
                    : delivery.status === "failed"
                    ? "var(--error-color)"
                    : "var(--brand-primary)",
              }}
            >
              {delivery.status === "accepted" && "Accepted"}
              {delivery.status === "picked_up" && "Picked Up"}
              {delivery.status === "in_transit" && "In Transit"}
              {delivery.status === "arriving" && "Arriving"}
              {delivery.status === "delivered" && "Delivered"}
              {delivery.status === "failed" && "Failed"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Delivery Status Update Form */}
            <div
              className="rounded-lg p-6 mb-6"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h2
                className="text-lg font-semibold mb-4 flex items-center"
                style={{ color: "var(--text-primary)" }}
              >
                <FiPackage className="mr-2" /> Update Status
              </h2>

              <StatusUpdateForm
                currentStatus={delivery.status}
                onSubmit={handleStatusUpdate}
                isSubmitting={submitting}
                collectPayment={delivery.paymentType === "Cash on Delivery"}
                paymentAmount={delivery.paymentAmount}
              />
            </div>

            {/* Delivery Photo Section - only show if the status is about to be updated to "delivered" */}
            {delivery.status === "arriving" && (
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FiCamera className="mr-2" /> Delivery Photo
                </h2>

                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Take a photo of where you left the package as proof of
                  delivery
                </p>

                {photoPreview ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Delivery proof"
                        className="rounded-md max-h-60 max-w-full"
                      />
                      <button
                        onClick={removePhoto}
                        className="absolute top-2 right-2 rounded-full p-1"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <FiX size={16} style={{ color: "white" }} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      className="flex flex-col items-center justify-center w-full h-40 rounded-md cursor-pointer border-2 border-dashed"
                      style={{
                        borderColor: "var(--border-primary)",
                        backgroundColor: "var(--bg-primary)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiImage
                          size={36}
                          style={{ color: "var(--text-secondary)" }}
                          className="mb-3"
                        />
                        <p
                          className="mb-2 text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <span className="font-semibold">
                            Click to take a photo
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          JPG, PNG or GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delivery Details Panel */}
          <div>
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h2
                className="font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3
                    className="text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Customer Information
                  </h3>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {delivery.customer.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {delivery.customer.phone}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {delivery.customer.address}
                  </p>
                </div>

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  <h3
                    className="text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Items ({delivery.items.length})
                  </h3>
                  <ul className="space-y-2">
                    {delivery.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-primary)" }}>
                          {item.name} x{item.quantity}
                        </span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  <h3
                    className="text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Payment Information
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-primary)" }}>
                      Payment Type
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        color:
                          delivery.paymentType === "Cash on Delivery"
                            ? "var(--warning-color)"
                            : "var(--success-color)",
                      }}
                    >
                      {delivery.paymentType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span style={{ color: "var(--text-primary)" }}>Amount</span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {delivery.paymentAmount}
                    </span>
                  </div>
                </div>

                {delivery.deliveryInstructions && (
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    <h3
                      className="text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Delivery Instructions
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {delivery.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DeliveryLayout>
  );
};

// This component is missing in the code but is used in the UI
const FiX = ({ size, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

export default DeliveryStatusUpdate;
