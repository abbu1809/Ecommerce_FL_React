import {
  FiMail,
  FiUserX,
  FiUserCheck,
  FiShoppingBag,
  FiLogIn,
  FiEdit,
} from "react-icons/fi";
import Button from "../../ui/Button";
import useAdminStore from "../../../store/Admin/useAdminStore";

const UserDetail = ({ user }) => {
  const { updateUserStatus, users } = useAdminStore();

  if (!user) return null;

  // Get the most current user data from the store to ensure we have the latest status
  const currentUser = users.list.find((u) => u.id === user.id) || user;

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
            {currentUser?.avatar ? (
              <img
                src={currentUser?.avatar}
                alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {currentUser?.first_name?.charAt(0).toUpperCase() ||
                  currentUser?.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {`${currentUser?.first_name || ""} ${
                currentUser?.last_name || ""
              }`.trim() || currentUser?.email}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {currentUser?.email}
            </p>
            <div className="mt-2 flex space-x-2">
              {getRoleBadge(currentUser?.role || "customer")}
              {getStatusBadge(
                currentUser?.is_banned
                  ? "banned"
                  : currentUser?.status || "active"
              )}
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
                {currentUser?.created_at
                  ? new Date(currentUser.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Phone Number
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {currentUser?.phone_number || "Not provided"}
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Auth Provider
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {currentUser?.auth_provider || "Email"}
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
                {currentUser?.orders || 0}
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
                ₹{(currentUser?.totalSpent || 0).toLocaleString()}
              </span>
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
        {currentUser?.is_banned ? (
          <Button
            variant="primary"
            size="sm"
            icon={<FiUserCheck size={16} />}
            onClick={() => updateUserStatus(currentUser?.id)}
          >
            Unban User
          </Button>
        ) : (
          <Button
            variant="danger"
            size="sm"
            icon={<FiUserX size={16} />}
            onClick={() => updateUserStatus(currentUser?.id)}
          >
            Ban User
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
