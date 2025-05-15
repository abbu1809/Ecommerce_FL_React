import {
  FiPrinter,
  FiMail,
  FiPackage,
  FiCheck,
  FiX,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import Button from "../../UI/Button";

const OrderDetail = ({ order }) => {
  if (!order) return null;

  const statusConfig = {
    pending: {
      bg: "var(--warning-color-light)",
      color: "var(--warning-color)",
      icon: <FiClock size={14} className="mr-1" />,
    },
    processing: {
      bg: "var(--info-color-light)",
      color: "var(--info-color)",
      icon: <FiPackage size={14} className="mr-1" />,
    },
    shipped: {
      bg: "var(--brand-secondary-light)",
      color: "var(--brand-secondary)",
      icon: <FiTruck size={14} className="mr-1" />,
    },
    delivered: {
      bg: "var(--success-color-light)",
      color: "var(--success-color)",
      icon: <FiCheck size={14} className="mr-1" />,
    },
    cancelled: {
      bg: "var(--error-color-light)",
      color: "var(--error-color)",
      icon: <FiX size={14} className="mr-1" />,
    },
  };

  const getTimelineStatus = (checkStatus) => {
    // Get the appropriate styling based on current order status and the timeline step we're checking
    const getStatusStyles = () => {
      const statuses = ["pending", "processing", "shipped", "delivered"];
      const currentStatusIndex = statuses.indexOf(order.status);
      const checkStatusIndex = statuses.indexOf(checkStatus);

      if (order.status === "cancelled") {
        return {
          iconClass: checkStatus === "pending" ? "completed" : "cancelled",
          textClass: checkStatus === "pending" ? "completed" : "cancelled",
        };
      }

      if (checkStatusIndex <= currentStatusIndex) {
        return { iconClass: "completed", textClass: "completed" };
      }

      return { iconClass: "pending", textClass: "pending" };
    };

    const { iconClass, textClass } = getStatusStyles();

    return {
      icon:
        iconClass === "completed" ? (
          <div
            className="h-3 w-3 rounded-full ring-4"
            style={{
              backgroundColor: "var(--success-color)",
              boxShadow: "var(--shadow-sm)",
              borderColor: "var(--success-color-light)",
            }}
          ></div>
        ) : iconClass === "cancelled" ? (
          <div
            className="h-3 w-3 rounded-full ring-4"
            style={{
              backgroundColor: "var(--error-color)",
              boxShadow: "var(--shadow-sm)",
              borderColor: "var(--error-color-light)",
            }}
          ></div>
        ) : (
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: "var(--border-secondary)",
            }}
          ></div>
        ),
      textStyle: {
        color:
          textClass === "completed"
            ? "var(--text-primary)"
            : textClass === "cancelled"
            ? "var(--error-color)"
            : "var(--text-secondary)",
        fontWeight: textClass === "pending" ? "normal" : "medium",
      },
    };
  };

  return (
    <div
      className="h-full rounded-lg shadow-md overflow-hidden animate-fadeIn"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderRadius: "var(--rounded-lg)",
        boxShadow: "var(--shadow-medium)",
      }}
    >
      <div
        className="p-6 border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Order Details
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Order #{order.id}
            </p>
          </div>
          <span
            className="px-3 py-1 inline-flex items-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor:
                statusConfig[order.status]?.bg || statusConfig.pending.bg,
              color:
                statusConfig[order.status]?.color || statusConfig.pending.color,
            }}
          >
            {statusConfig[order.status]?.icon || statusConfig.pending.icon}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      <div
        className="p-6 space-y-5 overflow-auto"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Customer Information
          </h3>
          <div
            className="p-3 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {order.customer}
            </p>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Shipping Address
          </h3>
          <div
            className="p-3 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {order.details?.shippingAddress}
            </p>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Payment Method
          </h3>
          <div
            className="p-3 rounded"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {order.paymentMethod}
            </p>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Order Items
          </h3>
          <div
            className="rounded overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <div
              className="divide-y"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {order.details?.items.map((item) => (
                <div key={item.id} className="p-3 flex justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="p-3 flex justify-between font-medium"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.03)",
                color: "var(--text-primary)",
              }}
            >
              <p>Total</p>
              <p>₹{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Order Timeline
          </h3>
          <div className="space-y-4">
            {/*
              { status: 'pending', label: 'Order Placed', date: order.date },
              { status: 'processing', label: 'Processing', date: '16 May, 2025' },
              { status: 'shipped', label: 'Shipped', date: '17 May, 2025' },
              { status: 'delivered', label: 'Delivered', date: '18 May, 2025' }
            ].map((step, index, arr) => {
              const { icon, textStyle } = getTimelineStatus(step.status);
              
              return (
                <div className="flex" key={step.status}>
                  <div className="mr-3 relative">
                    {icon}
                    {index < arr.length - 1 && (
                      <div 
                        className="h-full w-0.5 absolute top-3 left-1.5"
                        style={{ backgroundColor: 'var(--border-secondary)' }}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p 
                      className="text-sm"
                      style={textStyle}
                    >
                      {step.label}
                    </p>
                    {(
                      (step.status === 'pending') || 
                      (step.status === 'processing' && ['processing', 'shipped', 'delivered'].includes(order.status)) ||
                      (step.status === 'shipped' && ['shipped', 'delivered'].includes(order.status)) ||
                      (step.status === 'delivered' && order.status === 'delivered')
                    ) && (
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            */}
            <div className="flex">
              <div className="mr-3 relative">
                {getTimelineStatus("pending").icon}
                <div
                  className="h-full w-0.5 absolute top-3 left-1.5"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                ></div>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm"
                  style={getTimelineStatus("pending").textStyle}
                >
                  Order Placed
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {order.date}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-3 relative">
                {getTimelineStatus("processing").icon}
                <div
                  className="h-full w-0.5 absolute top-3 left-1.5"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                ></div>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm"
                  style={getTimelineStatus("processing").textStyle}
                >
                  Processing
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  16 May, 2025
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-3 relative">
                {getTimelineStatus("shipped").icon}
                <div
                  className="h-full w-0.5 absolute top-3 left-1.5"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                ></div>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm"
                  style={getTimelineStatus("shipped").textStyle}
                >
                  Shipped
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  17 May, 2025
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-3">{getTimelineStatus("delivered").icon}</div>
              <div className="flex-1">
                <p
                  className="text-sm"
                  style={getTimelineStatus("delivered").textStyle}
                >
                  Delivered
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  18 May, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-4 border-t flex justify-end space-x-3"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <Button variant="secondary" size="sm" icon={<FiPrinter size={16} />}>
          Print Invoice
        </Button>
        <Button variant="primary" size="sm" icon={<FiMail size={16} />}>
          Contact Customer
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
