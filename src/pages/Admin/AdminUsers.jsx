import { useState, useEffect } from "react";
import {
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
} from "react-icons/fi";
import UserTable from "../../components/Admin/Users/UserTable";
import UserDetail from "../../components/Admin/Users/UserDetail";
import Button from "../../components/UI/Button";
import useAdminStore from "../../store/Admin/useAdminStore";

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState("all"); // all, customers, admins, banned
  const [searchQuery, setSearchQuery] = useState("");
  const { users, fetchUsers } = useAdminStore();
  const { list: userList, loading } = users;

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Quick stats for different user types
  const stats = [
    {
      name: "All Users",
      value: userList.length || 0,
      icon: <FiUsers size={20} />,
      color: "var(--brand-primary)",
      view: "all",
    },
    {
      name: "Customers",
      value: userList.filter((user) => user.role === "customer").length || 0,
      icon: <FiUserCheck size={20} />,
      color: "var(--success-color)",
      view: "customers",
    },
    {
      name: "Admins",
      value: userList.filter((user) => user.role === "admin").length || 0,
      icon: <FiUserPlus size={20} />,
      color: "var(--brand-secondary)",
      view: "admins",
    },
    {
      name: "Banned Users",
      value: userList.filter((user) => user.status === "banned").length || 0,
      icon: <FiUserX size={20} />,
      color: "var(--error-color)",
      view: "banned",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            User Management
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage customer and admin accounts
          </p>
        </div>

        <div className="flex mt-4 sm:mt-0 space-x-3">
          <Button
            variant="secondary"
            size="sm"
            fullWidth={false}
            onClick={fetchUsers}
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
            Export Users
          </button>
        </div>
      </div>

      {/* User stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => setView(stat.view)}
            className={`p-4 rounded-lg shadow-sm border transition-all ${
              view === stat.view ? "ring-2" : ""
            }`}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
              ringColor: stat.color,
              cursor: "pointer",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div
                className="text-2xl font-bold"
                style={{
                  color:
                    view === stat.view ? stat.color : "var(--text-primary)",
                }}
              >
                {stat.value}
              </div>
            </div>
            <div
              className="text-sm font-medium mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {stat.name}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch
              className="h-5 w-5"
              style={{ color: "var(--text-secondary)" }}
            />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserTable
            onSelectUser={setSelectedUser}
            filterView={view}
            searchQuery={searchQuery}
          />
        </div>
        <div className="lg:col-span-1">
          {selectedUser ? (
            <UserDetail user={selectedUser} />
          ) : (
            <div
              className="rounded-lg shadow-md h-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
