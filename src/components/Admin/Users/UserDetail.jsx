import {
  FiMail,
  FiUserX,
  FiUserCheck,
  FiUserPlus,
  FiUserMinus,
  FiShoppingBag,
  FiLogIn,
  FiEdit,
} from "react-icons/fi";
import Button from "../../UI/Button";
import useAdminStore from "../../../store/Admin/useAdminStore";

const UserDetail = ({ user }) => {
  const { updateUserStatus, updateUserRole } = useAdminStore();

  if (!user) return null;

  // Role badge component
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        bg: "var(--brand-secondary-light)",
        color: "var(--brand-secondary)",
      },
      customer: {
        bg: "var(--info-color-light)",
        color: "var(--info-color)",
      },
    };

    const config = roleConfig[role] || roleConfig.customer;

    return (
      <span
        className="px-2 py-1 inline-flex items-center rounded-full text-xs font-semibold"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "var(--success-color-light)",
        color: "var(--success-color)",
      },
      inactive: {
        bg: "var(--border-secondary)",
        color: "var(--text-secondary)",
      },
      banned: {
        bg: "var(--error-color-light)",
        color: "var(--error-color)",
      },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span
        className="px-2 py-1 inline-flex items-center rounded-full text-xs font-semibold"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
        <div className="flex items-center">
          <div
            className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 flex-shrink-0"
            style={{ borderColor: "var(--border-primary)" }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {user.email}
            </p>
            <div className="mt-2 flex space-x-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.status)}
            </div>
          </div>
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
            Account Information
          </h3>
          <div
            className="rounded divide-y"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Registered
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {user.registered}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Last Login
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {user.lastLogin}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Orders
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {user.orders}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Spent
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                ₹{user.totalSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--brand-primary-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiShoppingBag size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Placed an order
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Order #ORD-12345 - ₹
                    {user.totalSpent > 100
                      ? Math.round(
                          user.totalSpent / user.orders
                        ).toLocaleString()
                      : "7,999"}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    5 days ago
                  </p>
                </div>
              </div>
            </div>

            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--success-color-light)",
                      color: "var(--success-color)",
                    }}
                  >
                    <FiLogIn size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Logged in
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    IP: 198.51.100.123
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    3 days ago
                  </p>
                </div>
              </div>
            </div>

            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--warning-color-light)",
                      color: "var(--warning-color)",
                    }}
                  >
                    <FiEdit size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Updated profile
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Changed shipping address
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    1 week ago
                  </p>
                </div>
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
        {user.status === "active" ? (
          <Button
            variant="danger"
            size="sm"
            icon={<FiUserX size={16} />}
            onClick={() => updateUserStatus(user.id, "banned")}
          >
            Ban User
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={<FiUserCheck size={16} />}
            onClick={() => updateUserStatus(user.id, "active")}
          >
            Unban User
          </Button>
        )}

        {user.role === "customer" ? (
          <Button
            variant="primary"
            size="sm"
            icon={<FiUserPlus size={16} />}
            onClick={() => updateUserRole(user.id, "admin")}
          >
            Make Admin
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            icon={<FiUserMinus size={16} />}
            onClick={() => updateUserRole(user.id, "customer")}
          >
            Remove Admin
          </Button>
        )}

        <Button variant="primary" size="sm" icon={<FiMail size={16} />}>
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;
