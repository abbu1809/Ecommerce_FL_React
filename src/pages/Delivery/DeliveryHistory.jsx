import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiFilter, FiDownload, FiCalendar } from "react-icons/fi";
import { DeliveryLayout, DeliveryHistoryItem } from "../../components/Delivery";
import { toast } from "../../utils/toast";
import { useDeliveryPartnerStore } from "../../store/Delivery";

const DeliveryHistory = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Access the store
  const { fetchDeliveryHistory } = useDeliveryPartnerStore();

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
        setDeliveries(history || []);
        setFilteredDeliveries(history || []);
      } catch (error) {
        console.error("Error fetching delivery history:", error);
        toast.error("Failed to load delivery history");
      } finally {
        setIsLoading(false);
      }
    };

    getDeliveryHistory();
  }, [fetchDeliveryHistory]);

  useEffect(() => {
    // Filter and search deliveries
    const results = deliveries.filter((delivery) => {
      // Search filter
      const matchesSearch =
        (delivery.order_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (delivery.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (delivery.address?.street_address || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      let matchesDate = true;
      const today = new Date();
      const deliveryDate = delivery.delivered_at ? new Date(delivery.delivered_at) : null;

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
        (delivery.delivery_status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesDate && matchesStatus;
    });

    setFilteredDeliveries(results);
  }, [searchTerm, dateFilter, statusFilter, deliveries]);

  // Handle export to CSV
  const handleExport = () => {
    if (filteredDeliveries.length === 0) {
      toast.error("No data to export");
      return;
    }

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
            {filteredDeliveries.map((delivery) => (
              <DeliveryHistoryItem key={delivery.order_id} delivery={delivery} />
            ))}
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
    </DeliveryLayout>
  );
};

export default DeliveryHistory;
