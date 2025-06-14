import React, { useEffect } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
} from "react-icons/fi";
import DashboardStats from "../../components/Admin/Dashboard/DashboardStats";
import RecentOrders from "../../components/Admin/Dashboard/RecentOrders";
import SalesChart from "../../components/Admin/Dashboard/SalesChart";
import TopProducts from "../../components/Admin/Dashboard/TopProducts";
import Button from "../../components/ui/Button";
import useAdminStore from "../../store/Admin/useAdminStore";

const AdminDashboard = () => {
  // Use the admin store for dashboard data
  const { dashboard, fetchDashboardData } = useAdminStore();
  const { stats, loading } = dashboard;
  // Add icons to the stats data - this will be used in the JSX below
  const enhancedStats = stats.map((stat, index) => {
    const icons = [
      <FiDollarSign size={24} />,
      <FiShoppingBag size={24} />,
      <FiUsers size={24} />,
      <FiPackage size={24} />,
    ];

    const colors = [
      "var(--brand-primary)",
      "var(--brand-secondary)",
      "var(--success-color)",
      "var(--error-color)",
    ];

    return {
      ...stat,
      icon: icons[index],
      color: colors[index],
    };
  });
  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <div className="flex items-center">
          <div
            className="text-sm font-medium mr-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Last updated: {new Date().toLocaleString()}
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth={false}
            onClick={fetchDashboardData}
            isLoading={loading}
            icon={<FiRefreshCw size={16} />}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? // Loading skeleton for stats cards
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md animate-pulse"
                style={{
                  borderRadius: "var(--rounded-lg)",
                  boxShadow: "var(--shadow-medium)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          : enhancedStats.map((stat, index) => (
              <DashboardStats key={index} {...stat} />
            ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart - Takes up 2/3 of the width */}
        <div className="lg:col-span-2">
          {loading ? (
            <div
              className="bg-white p-6 rounded-lg shadow-md animate-pulse h-72"
              style={{
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-56 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <SalesChart />
          )}
        </div>
        {/* Top Products - Takes up 1/3 of the width */}
        <div>
          {loading ? (
            <div
              className="bg-white p-6 rounded-lg shadow-md animate-pulse h-72"
              style={{
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded mr-3"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <TopProducts />
          )}
        </div>
      </div>
      {/* Recent Orders */}
      <div>
        {loading ? (
          <div
            className="bg-white p-6 rounded-lg shadow-md animate-pulse"
            style={{
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <RecentOrders />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
