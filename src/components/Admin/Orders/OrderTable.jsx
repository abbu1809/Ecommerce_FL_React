import { useMemo } from "react";
import {
  FiEye,
  FiEdit2,
  FiPackage,
  FiCheck,
  FiX,
  FiTruck,
  FiLoader,
} from "react-icons/fi";
import Button from "../../UI/Button";
import useAdminStore from "../../../store/Admin/useAdminStore";

// Order status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "var(--warning-color-light)",
      color: "var(--warning-color)",
      icon: <FiLoader size={12} className="mr-1" />,
    },
    processing: {
      bg: "var(--info-color-light)",
      color: "var(--info-color)",
      icon: <FiPackage size={12} className="mr-1" />,
    },
    shipped: {
      bg: "var(--brand-secondary-light)",
      color: "var(--brand-secondary)",
      icon: <FiTruck size={12} className="mr-1" />,
    },
    delivered: {
      bg: "var(--success-color-light)",
      color: "var(--success-color)",
      icon: <FiCheck size={12} className="mr-1" />,
    },
    cancelled: {
      bg: "var(--error-color-light)",
      color: "var(--error-color)",
      icon: <FiX size={12} className="mr-1" />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className="px-2 py-1 inline-flex items-center rounded-full text-xs font-semibold"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderTable = ({ onSelectOrder, statusFilter, searchQuery }) => {
  const { orders, updateOrderStatus } = useAdminStore();
  const { list: orderList, loading } = orders;

  // Filter orders based on status and search query
  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orderList, statusFilter, searchQuery]);

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div
      className="overflow-x-auto rounded-lg shadow"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderRadius: "var(--rounded-lg)",
        boxShadow: "var(--shadow-medium)",
      }}
    >
      {loading ? (
        <div className="p-8 text-center animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <>
          <table
            className="min-w-full divide-y"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Order ID
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Customer
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.customer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ₹{order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{ color: "var(--brand-primary)" }}
                          title="View Order Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                        >
                          <FiEye size={18} />
                        </button>
                        <div className="relative group">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            style={{ color: "var(--brand-secondary)" }}
                            title="Update Order Status"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <div
                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg hidden group-hover:block z-50"
                            style={{
                              backgroundColor: "var(--bg-primary)",
                              boxShadow: "var(--shadow-large)",
                              borderRadius: "var(--rounded-md)",
                            }}
                          >
                            <div className="py-1">
                              {order.status !== "processing" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, "processing");
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  Mark as Processing
                                </button>
                              )}
                              {order.status !== "shipped" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, "shipped");
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  Mark as Shipped
                                </button>
                              )}
                              {order.status !== "delivered" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, "delivered");
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  Mark as Delivered
                                </button>
                              )}
                              {order.status !== "cancelled" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, "cancelled");
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm"
                                  style={{ color: "var(--error-color)" }}
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div style={{ color: "var(--text-secondary)" }}>
                      {searchQuery || statusFilter !== "all"
                        ? "No orders match your filter criteria"
                        : "No orders found"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            className="px-6 py-4 flex items-center justify-between border-t"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Showing {filteredOrders.length} of {orderList.length} orders
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTable;
