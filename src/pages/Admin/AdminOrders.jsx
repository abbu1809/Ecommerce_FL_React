import { useState, useEffect } from "react";
import { FiDownload, FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import OrderTable from "../../components/Admin/Orders/OrderTable";
import OrderDetail from "../../components/Admin/Orders/OrderDetail";
import Button from "../../components/UI/Button";
import useAdminStore from "../../store/Admin/useAdminStore";

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { orders, fetchOrders } = useAdminStore();
  const { loading, statusCounts } = orders;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Order Management
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            View and manage customer orders
          </p>
        </div>

        <div className="flex mt-4 sm:mt-0 space-x-3">
          <Button
            variant="secondary"
            size="sm"
            fullWidth={false}
            onClick={fetchOrders}
            isLoading={loading}
            icon={<FiRefreshCw size={16} />}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>

          <button
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium border"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <FiDownload className="mr-2" size={16} />
            Export Orders
          </button>
        </div>
      </div>{" "}
      {/* Order status summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {Object.entries({
          all: { label: "All Orders", color: "var(--brand-primary)" },
          pending_payment: {
            label: "Pending Payment",
            color: "var(--warning-color)",
          },
          payment_successful: {
            label: "Payment Success",
            color: "var(--success-color)",
          },
          processing: { label: "Processing", color: "var(--info-color)" },
          assigned: { label: "Assigned", color: "var(--brand-secondary)" },
          shipped: { label: "Shipped", color: "var(--brand-primary)" },
          delivered: { label: "Delivered", color: "var(--success-color)" },
          cancelled: { label: "Cancelled", color: "var(--error-color)" },
        }).map(([status, { label, color }]) => (
          <button
            key={status}
            className={`p-4 rounded-lg shadow-sm border transition-all ${
              statusFilter === status ? "ring-2" : ""
            }`}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
              ringColor: color,
            }}
            onClick={() => setStatusFilter(status)}
          >
            <div className="text-sm font-medium" style={{ color }}>
              {label}
            </div>
            <div
              className="text-2xl font-bold mt-2"
              style={{ color: "var(--text-primary)" }}
            >
              {status === "all"
                ? orders.list.length
                : statusCounts[status] || 0}
            </div>
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch
                className="h-5 w-5"
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              className="block w-full pl-10 pr-3 py-2 border rounded-md text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderTable
            onSelectOrder={setSelectedOrder}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          />
        </div>
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <OrderDetail order={selectedOrder} />
          ) : (
            <div
              className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
