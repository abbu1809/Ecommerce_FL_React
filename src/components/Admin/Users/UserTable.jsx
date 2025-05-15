import { useMemo } from "react";
import {
  FiEye,
  FiUserX,
  FiUserCheck,
  FiUserPlus,
  FiUserMinus,
} from "react-icons/fi";
import useAdminStore from "../../../store/Admin/useAdminStore";

// Role badge component
const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: {
      bg: "var(--brand-secondary-light)",
      color: "var(--brand-secondary)",
    },
    customer: {
      bg: "var(--info-color-light)",
      color: "var(--info-color)",
    },
    moderator: {
      bg: "var(--success-color-light)",
      color: "var(--success-color)",
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
const StatusBadge = ({ status }) => {
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

const UserTable = ({ onSelectUser, filterView, searchQuery }) => {
  const { users, updateUserStatus, updateUserRole } = useAdminStore();
  const { list: userList, loading } = users;

  // Filter users based on the selected view and search query
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // First filter by view/tab
      const viewMatch =
        filterView === "all" ||
        (filterView === "customers" && user.role === "customer") ||
        (filterView === "admins" && user.role === "admin") ||
        (filterView === "banned" && user.status === "banned");

      // Then filter by search query
      const searchMatch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      return viewMatch && searchMatch;
    });
  }, [userList, filterView, searchQuery]);

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
                  User
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Role
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Orders
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => onSelectUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border flex-shrink-0"
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
                              className="h-full w-full flex items-center justify-center text-lg font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div
                            className="text-sm font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {user.name}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Joined {user.registered}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.orders} orders
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          ₹{user.totalSpent.toLocaleString()} total
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div
                        className="flex justify-end space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{ color: "var(--brand-primary)" }}
                          title="View User Details"
                          onClick={() => onSelectUser(user)}
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{
                            color:
                              user.status === "banned"
                                ? "var(--success-color)"
                                : "var(--error-color)",
                          }}
                          title={
                            user.status === "banned" ? "Unban User" : "Ban User"
                          }
                          onClick={() =>
                            updateUserStatus(
                              user.id,
                              user.status === "banned" ? "active" : "banned"
                            )
                          }
                        >
                          {user.status === "banned" ? (
                            <FiUserCheck size={18} />
                          ) : (
                            <FiUserX size={18} />
                          )}
                        </button>

                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{ color: "var(--brand-secondary)" }}
                          title={
                            user.role === "admin"
                              ? "Remove Admin Role"
                              : "Make Admin"
                          }
                          onClick={() =>
                            updateUserRole(
                              user.id,
                              user.role === "admin" ? "customer" : "admin"
                            )
                          }
                        >
                          {user.role === "admin" ? (
                            <FiUserMinus size={18} />
                          ) : (
                            <FiUserPlus size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div style={{ color: "var(--text-secondary)" }}>
                      {searchQuery || filterView !== "all"
                        ? "No users match your filter criteria"
                        : "No users found"}
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
              Showing {filteredUsers.length} of {userList.length} users
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTable;
