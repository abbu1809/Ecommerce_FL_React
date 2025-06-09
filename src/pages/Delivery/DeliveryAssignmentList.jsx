import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiFilter, FiAlertCircle } from "react-icons/fi";
import { DeliveryLayout, DeliveryStatusModal } from "../../components/Delivery";
import { DeliveryCard } from "../../components/Delivery";
import useDeliveryPartnerStore from "../../store/Delivery/useDeliveryPartnerStore";
import { toast } from "../../utils/toast";

const DeliveryAssignmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Get fetchAssignedDeliveries and updateDeliveryStatus functions from the store
  const { fetchAssignedDeliveries, updateDeliveryStatus, assignedDeliveries } =
    useDeliveryPartnerStore();

  // Helper functions for data formatting - wrapped in useCallback to prevent recreation on each render
  const formatAddress = useCallback((addressObj) => {
    if (!addressObj) return "N/A";

    const { street_address, city, state, postal_code } = addressObj;
    return [street_address, city, state, postal_code]
      .filter(Boolean)
      .join(", ");
  }, []);

  useEffect(() => {
    // Fetch assigned deliveries from API
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        await fetchAssignedDeliveries();
      } catch (error) {
        console.error("Error fetching assigned deliveries:", error);
        toast.error("Failed to load delivery assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [fetchAssignedDeliveries]);

  useEffect(() => {
    // Transform the API response to match our component's data structure
    const formattedDeliveries = assignedDeliveries?.map(
      (delivery) => ({
        id: delivery.order_id,
        orderId: delivery.order_id,
        customer: {
          name: delivery.customer_name || "Customer",
          phone: delivery.customer_phone || "N/A",
        },
        address: formatAddress(delivery.delivery_address),
        customerPhone: delivery.customer_phone || "N/A",
        items: delivery.items || [],
        status: delivery.delivery_status || "pending",
        priority: getPriority(delivery),
        distance: "N/A", // Calculate if needed
        expectedDelivery: delivery.estimated_delivery,
        assignedDate: delivery.assigned_at,
        paymentType: "N/A", // Add if available in API
        createdAt: delivery.created_at,
        total_amount: delivery.total_amount,
        currency: delivery.currency || "INR",
      })
    );

    setAssignments(formattedDeliveries);
    setFilteredAssignments(formattedDeliveries);

  console.log("DeliveryAssignmentList rendered",assignments ,filteredAssignments);
  }, [assignedDeliveries, formatAddress]);

  const getPriority = (delivery) => {
    // Determine priority based on delivery data - can be customized
    if (!delivery) return "normal";

    // Logic to determine priority - for example, based on estimated delivery time
    const estimatedDate = delivery.estimated_delivery
      ? new Date(delivery.estimated_delivery)
      : null;
    const now = new Date();

    if (estimatedDate && estimatedDate - now < 24 * 60 * 60 * 1000) {
      return "high"; // High priority if delivery is due within 24 hours
    }
    return "normal";
  };

  useEffect(() => {
    // Filter and search assignments
    const results = assignments?.filter((assignment) => {
      const matchesSearch =
        assignment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.customer.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      if (filter === "high-priority")
        return matchesSearch && assignment.priority === "high";
      if (filter === "normal-priority")
        return matchesSearch && assignment.priority === "normal";

      return matchesSearch;
    });

    setFilteredAssignments(results);
  }, [searchTerm, filter, assignments]);
  const handleAcceptDelivery = async (orderId) => {
    // Find the delivery to show in modal
    const delivery = assignments.find(
      (assignment) => assignment.id === orderId
    );
    if (delivery) {
      setSelectedDelivery(delivery);
      setIsModalOpen(true);
    }
  };
  const handleStatusUpdate = async (orderId, status, additionalData) => {
    setIsUpdatingStatus(true);
    try {
      // Update status using the store function
      await updateDeliveryStatus(orderId, status, additionalData);

      // Update local state
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === orderId
            ? { ...assignment, status: status }
            : assignment
        )
      );

      // Update filtered assignments as well
      setFilteredAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === orderId
            ? { ...assignment, status: status }
            : assignment
        )
      );

      toast.success("Delivery status updated successfully");

      // Close modal
      setIsModalOpen(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update delivery status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold mb-4 md:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            Available Delivery Assignments
          </h1>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
            <div className="relative flex-grow md:w-64">
              <span
                className="absolute inset-y-0 left-0 flex items-center pl-3"
                style={{ color: "var(--text-secondary)" }}
              >
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by order ID or customer"
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderWidth: "1px",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative md:w-48">
              <span
                className="absolute inset-y-0 left-0 flex items-center pl-3"
                style={{ color: "var(--text-secondary)" }}
              >
                <FiFilter size={18} />
              </span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm appearance-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderWidth: "1px",
                }}
              >
                <option value="all">All Assignments</option>
                <option value="high-priority">High Priority</option>
                <option value="normal-priority">Normal Priority</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: "var(--brand-primary)" }}
            ></div>
          </div>
        ) : filteredAssignments?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssignments?.map((assignment) => (
              <DeliveryCard
                key={assignment.id}
                delivery={assignment}
                onAccept={() => handleAcceptDelivery(assignment.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <FiAlertCircle
              size={48}
              style={{ color: "var(--text-secondary)" }}
              className="mb-4"
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No assignments found
            </h3>
            <p
              className="text-center max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              {searchTerm || filter !== "all"
                ? "Try changing your search terms or filters"
                : "There are currently no delivery assignments available. Check back later!"}
            </p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <DeliveryStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        delivery={selectedDelivery}
        onStatusUpdate={handleStatusUpdate}
        isSubmitting={isUpdatingStatus}
      />
    </DeliveryLayout>
  );
};

export default DeliveryAssignmentList;
