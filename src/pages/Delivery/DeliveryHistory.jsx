import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  DeliveryLayout,
  DeliveryHistoryItem,
  DeliveryStatusModal,
} from "../../components/Delivery";
import { toast } from "../../utils/toast";
import useDeliveryPartnerStore from "../../store/Delivery/useDeliveryPartnerStore";

const DeliveryHistory = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  // Access the store
  const { fetchDeliveryHistory } = useDeliveryPartnerStore();

  // Helper function to format address
  const formatAddress = useCallback((addressObj) => {
    if (!addressObj) return "N/A";

    // If it's already a string, return it
    if (typeof addressObj === "string") return addressObj;

    // If it's an object, extract the address components
    if (typeof addressObj === "object") {
      const { street_address, city, state, postal_code } = addressObj;
      const addressParts = [street_address, city, state, postal_code]
        .filter(Boolean)
        .filter((part) => typeof part === "string" && part.trim() !== "");

      return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
    }

    return "N/A";
  }, []);

  useEffect(() => {
    // Handle success message from navigation state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state?.successMessage]);
  useEffect(() => {
    // Fetch delivery history from the store
    const getDeliveryHistory = async () => {
      setIsLoading(true);
      try {
        const history = await fetchDeliveryHistory();

        // Transform API data to match DeliveryHistoryItem component structure
        const transformedHistory = history.map((delivery) => {
          // Safely format the address
          const formattedAddress = formatAddress(
            delivery.address || delivery.delivery_address
          );

          return {
            id: delivery.order_id,
            orderId: delivery.order_id,
            customer: delivery.customer_name || "Customer",
            customer_phone: delivery.customer_phone,
            address: formattedAddress,
            delivery_address: delivery.address || delivery.delivery_address,
            status: transformStatus(delivery.delivery_status || ""),
            delivery_status: delivery.delivery_status,
            completedDate:
              delivery.delivered_at ||
              delivery.updated_at ||
              delivery.created_at,
            expectedDelivery:
              delivery.estimated_delivery || new Date().toISOString(),
            estimated_delivery: delivery.estimated_delivery,
            amount: parseFloat(delivery.total_amount || "0"),
            total_amount: delivery.total_amount,
            paymentMethod:
              delivery.payment_details?.method ||
              delivery.payment_method ||
              "Online",
            payment_method:
              delivery.payment_details?.method || delivery.payment_method,
            notes: delivery.notes || "",
            order_items: delivery.order_items || [],
            tracking_info: delivery.tracking_info || {},
            // Include payment details
            payment_details: delivery.payment_details || {
              method: delivery.payment_method || "Online",
              status: delivery.status || "payment_successful",
            },
            currency: delivery.currency || "INR",
            created_at: delivery.created_at,
            updated_at: delivery.updated_at,
            assigned_at: delivery.assigned_at,
            delivered_at: delivery.delivered_at,
            // Preserve all original data
            ...delivery,
          };
        });

        setDeliveries(transformedHistory);
        setFilteredDeliveries(transformedHistory);
      } catch (error) {
        console.error("Error fetching delivery history:", error);
        toast.error("Failed to load delivery history");
      } finally {
        setIsLoading(false);
      }
    };

    getDeliveryHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper function to transform status from API format to display format
  const transformStatus = (status) => {
    const statusMap = {
      delivered: "Delivered",
      out_for_delivery: "Out for Delivery",
      failed_final: "Failed",
      failed_attempt: "Failed",
      pending: "Pending",
      assigned: "Pending",
      cancelled: "Failed",
    };

    return statusMap[status.toLowerCase()] || "Pending";
  };

  useEffect(() => {
    // Filter and search deliveries
    const results = deliveries.filter((delivery) => {
      // Search filter
      const matchesSearch =
        (delivery.orderId || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (delivery.customer || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (delivery.address || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Date filter
      let matchesDate = true;
      const today = new Date();
      const deliveryDate = delivery.completedDate
        ? new Date(delivery.completedDate)
        : null;

      if (dateFilter === "today") {
        matchesDate =
          deliveryDate &&
          deliveryDate.getDate() === today.getDate() &&
          deliveryDate.getMonth() === today.getMonth() &&
          deliveryDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = deliveryDate && deliveryDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = deliveryDate && deliveryDate >= monthAgo;
      }

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (delivery.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesDate && matchesStatus;
    });

    setFilteredDeliveries(results);
  }, [searchTerm, dateFilter, statusFilter, deliveries]);
  // Handle viewing delivery details
  const handleViewDetails = (delivery) => {
    // Ensure address is properly formatted as string
    const customerAddress =
      typeof delivery.address === "string"
        ? delivery.address
        : formatAddress(delivery.delivery_address);

    setSelectedDelivery({
      ...delivery,
      // Ensure we have all the properties the modal expects
      customer: {
        name: delivery.customer || "Customer",
        phone: delivery.customer_phone || "N/A",
        address: customerAddress,
      },
      paymentType:
        delivery.payment_details?.method || delivery.payment_method || "Online",
      paymentStatus:
        delivery.payment_details?.status ||
        delivery.status ||
        "payment_successful",
      paymentAmount: `₹${delivery.total_amount?.toLocaleString() || 0}`,
    });
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle export to CSV
  const handleExport = () => {
    if (filteredDeliveries.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Create CSV content
    const headers = [
      "Order ID",
      "Customer",
      "Address",
      "Status",
      "Completed Date",
      "Expected Delivery",
      "Amount",
      "Payment Method",
      "Notes",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredDeliveries.map((delivery) =>
        [
          `"${delivery.orderId}"`,
          `"${delivery.customer}"`,
          `"${delivery.address}"`,
          `"${delivery.status}"`,
          `"${new Date(delivery.completedDate).toLocaleDateString()}"`,
          `"${new Date(delivery.expectedDelivery).toLocaleDateString()}"`,
          delivery.amount,
          `"${delivery.paymentMethod}"`,
          `"${delivery.notes}"`,
        ].join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `delivery_history_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Delivery history exported successfully");
  };

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        {successMessage && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: "var(--success-color)10",
              borderLeft: "4px solid var(--success-color)",
            }}
          >
            <p style={{ color: "var(--success-color)" }}>{successMessage}</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold mb-4 md:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            Delivery History
          </h1>

          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
          >
            <FiDownload className="mr-2" />
            Export History
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex flex-col md:flex-row w-full gap-3">
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
                <FiCalendar size={18} />
              </span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm appearance-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderWidth: "1px",
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="relative md:w-48">
              <span
                className="absolute inset-y-0 left-0 flex items-center pl-3"
                style={{ color: "var(--text-secondary)" }}
              >
                <FiFilter size={18} />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm appearance-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderWidth: "1px",
                }}
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="failed_final">Failed</option>
                <option value="cancelled">Cancelled</option>
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
        ) : filteredDeliveries.length > 0 ? (
          <div className="space-y-4">
            {currentItems.map((delivery) => (
              <DeliveryHistoryItem
                key={delivery.order_id || delivery.id}
                delivery={delivery}
                onViewDetails={() => handleViewDetails(delivery)}
              />
            ))}

            {/* Pagination */}
            {filteredDeliveries.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md"
                    style={{
                      backgroundColor:
                        currentPage === 1
                          ? "var(--bg-disabled)"
                          : "var(--bg-secondary)",
                      color:
                        currentPage === 1
                          ? "var(--text-disabled)"
                          : "var(--text-primary)",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    <FiChevronLeft />
                  </button>

                  {Array.from({
                    length: Math.ceil(filteredDeliveries.length / itemsPerPage),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className="px-4 py-2"
                      style={{
                        backgroundColor:
                          currentPage === index + 1
                            ? "var(--brand-primary)"
                            : "var(--bg-secondary)",
                        color:
                          currentPage === index + 1
                            ? "white"
                            : "var(--text-primary)",
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredDeliveries.length / itemsPerPage)
                    }
                    className="px-3 py-2 rounded-r-md"
                    style={{
                      backgroundColor:
                        currentPage ===
                        Math.ceil(filteredDeliveries.length / itemsPerPage)
                          ? "var(--bg-disabled)"
                          : "var(--bg-secondary)",
                      color:
                        currentPage ===
                        Math.ceil(filteredDeliveries.length / itemsPerPage)
                          ? "var(--text-disabled)"
                          : "var(--text-primary)",
                      cursor:
                        currentPage ===
                        Math.ceil(filteredDeliveries.length / itemsPerPage)
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <FiChevronRight />
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              style={{ color: "var(--text-secondary)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No delivery history found
            </h3>
            <p
              className="text-center max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              {searchTerm || dateFilter !== "all" || statusFilter !== "all"
                ? "Try changing your search terms or filters"
                : "Your completed deliveries will appear here once you've made some deliveries."}
            </p>
          </div>
        )}
      </div>

      {/* Status Modal */}
      <DeliveryStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        delivery={selectedDelivery || {}}
        isReadOnly={true}
      />
    </DeliveryLayout>
  );
};

export default DeliveryHistory;
