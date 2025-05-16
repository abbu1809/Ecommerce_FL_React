import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiDownload, FiCalendar } from "react-icons/fi";
import { DeliveryLayout, DeliveryHistoryItem } from "../../components/Delivery";

const DeliveryHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

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
  }, []);

  useEffect(() => {
    // Simulate API call to fetch delivery history
    const fetchDeliveryHistory = async () => {
      setIsLoading(true);
      try {
        // Mock data - in a real app, this would be fetched from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockDeliveries = [
          {
            id: "DEL728391",
            orderId: "ORD293847",
            status: "Delivered",
            date: new Date(2025, 4, 10).toISOString(),
            completedDate: new Date(2025, 4, 10).toISOString(),
            expectedDelivery: new Date(2025, 4, 10).toISOString(),
            address: "123 Main St, Bhopal, MP 462001",
            amount: 1459.99,
            paymentMethod: "Online Payment",
            customer: "Rahul Sharma",
          },
          {
            id: "DEL728390",
            orderId: "ORD293846",
            status: "Delivered",
            date: new Date(2025, 4, 9).toISOString(),
            completedDate: new Date(2025, 4, 9).toISOString(),
            expectedDelivery: new Date(2025, 4, 9).toISOString(),
            address: "456 Park Ave, Bhopal, MP 462003",
            amount: 2349.0,
            paymentMethod: "Cash on Delivery",
            customer: "Priya Patel",
            notes: "Left with security guard as requested",
          },
          {
            id: "DEL728385",
            orderId: "ORD293840",
            status: "Failed",
            date: new Date(2025, 4, 8).toISOString(),
            completedDate: null,
            expectedDelivery: new Date(2025, 4, 8).toISOString(),
            address: "789 Lake View, Bhopal, MP 462020",
            amount: 999.5,
            paymentMethod: "Cash on Delivery",
            customer: "Amit Kumar",
            notes: "Customer not available, address incorrect",
          },
          {
            id: "DEL728370",
            orderId: "ORD293830",
            status: "Delivered",
            date: new Date(2025, 4, 5).toISOString(),
            completedDate: new Date(2025, 4, 5).toISOString(),
            expectedDelivery: new Date(2025, 4, 6).toISOString(),
            address: "23 Hill Road, Bhopal, MP 462015",
            amount: 3599.0,
            paymentMethod: "Online Payment",
            customer: "Sunita Verma",
          },
          {
            id: "DEL728365",
            orderId: "ORD293825",
            status: "Delivered",
            date: new Date(2025, 4, 3).toISOString(),
            completedDate: new Date(2025, 4, 3).toISOString(),
            expectedDelivery: new Date(2025, 4, 3).toISOString(),
            address: "56 Market Complex, Bhopal, MP 462011",
            amount: 749.99,
            paymentMethod: "Cash on Delivery",
            customer: "Vikram Singh",
          },
        ];

        setDeliveries(mockDeliveries);
        setFilteredDeliveries(mockDeliveries);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching delivery history:", error);
        setIsLoading(false);
      }
    };

    fetchDeliveryHistory();
  }, []);

  // Filter deliveries when search term or filters change
  useEffect(() => {
    let filtered = [...deliveries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (delivery) =>
          delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (delivery) => delivery.status.toLowerCase() === statusFilter
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      if (dateFilter === "today") {
        filtered = filtered.filter((delivery) => {
          const deliveryDate = new Date(delivery.date);
          return deliveryDate >= startOfDay;
        });
      } else if (dateFilter === "week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = filtered.filter((delivery) => {
          const deliveryDate = new Date(delivery.date);
          return deliveryDate >= lastWeek;
        });
      } else if (dateFilter === "month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter((delivery) => {
          const deliveryDate = new Date(delivery.date);
          return deliveryDate >= lastMonth;
        });
      }
    }

    setFilteredDeliveries(filtered);
  }, [searchTerm, statusFilter, dateFilter, deliveries]);

  const handleExportHistory = () => {
    // In a real implementation, this would generate a CSV or PDF
    console.log("Exporting delivery history...");
    alert("Delivery history exported successfully!");
  };

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold mb-4 md:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            Delivery History
          </h1>

          <button
            onClick={handleExportHistory}
            className="flex items-center px-4 py-2 rounded-md transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <FiDownload className="mr-2" size={16} />
            Export History
          </button>
        </div>

        {successMessage && (
          <div
            className="mb-6 p-4 rounded-md flex items-center"
            style={{
              backgroundColor: "var(--success-color)10",
              color: "var(--success-color)",
              border: "1px solid var(--success-color)30",
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
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

          <div className="relative">
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
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="relative">
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
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
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
              <DeliveryHistoryItem key={delivery.id} delivery={delivery} />
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
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
                : "You haven't completed any deliveries yet. Once you start delivering, your history will appear here."}
            </p>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;
