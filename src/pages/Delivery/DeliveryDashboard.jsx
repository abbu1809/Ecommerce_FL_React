import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiTruck,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiBarChart2,
  FiMapPin,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { DeliveryLayout } from "../../components/Delivery";

const DeliveryDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    rating: 0,
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock statistics data
        setStats({
          todayDeliveries: 3,
          pendingDeliveries: 5,
          completedDeliveries: 42,
          rating: 4.8,
        });

        // Mock recent deliveries
        setRecentDeliveries([
          {
            id: "DEL-1005",
            orderId: "ORD-5740",
            customer: "Rahul Sharma",
            address: "123 Main St, Bhopal, MP 462001",
            status: "Delivered",
            time: "Today, 13:45",
          },
          {
            id: "DEL-1004",
            orderId: "ORD-5738",
            customer: "Priya Patel",
            address: "456 Park Ave, Bhopal, MP 462003",
            status: "Delivered",
            time: "Today, 11:20",
          },
          {
            id: "DEL-1003",
            orderId: "ORD-5736",
            customer: "Amit Kumar",
            address: "789 Lake View, Bhopal, MP 462020",
            status: "Failed",
            time: "Yesterday, 16:30",
            reason: "Customer not available",
          },
        ]);

        // Mock upcoming deliveries
        setUpcomingDeliveries([
          {
            id: "DEL-1008",
            orderId: "ORD-5745",
            customer: "Vikram Singh",
            address: "56 Market Complex, Bhopal, MP 462011",
            scheduledTime: "Today, 15:30",
            priority: "high",
          },
          {
            id: "DEL-1007",
            orderId: "ORD-5744",
            customer: "Meera Joshi",
            address: "72 Garden View, Bhopal, MP 462023",
            scheduledTime: "Today, 16:15",
            priority: "normal",
          },
          {
            id: "DEL-1006",
            orderId: "ORD-5742",
            customer: "Ajay Verma",
            address: "14 College Road, Bhopal, MP 462026",
            scheduledTime: "Tomorrow, 10:00",
            priority: "normal",
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "var(--success-color)";
      case "Failed":
        return "var(--error-color)";
      case "Pending":
        return "var(--warning-color)";
      default:
        return "var(--brand-primary)";
    }
  };

  // Function to get priority color and label
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "var(--error-color)",
          label: "High Priority",
        };
      case "normal":
        return {
          color: "var(--brand-primary)",
          label: "Normal",
        };
      case "low":
        return {
          color: "var(--text-secondary)",
          label: "Low Priority",
        };
      default:
        return {
          color: "var(--brand-primary)",
          label: "Normal",
        };
    }
  };

  // Stat card component
  const StatCard = ({ icon, value, label, color, bgColor }) => (
    <div
      className="rounded-lg p-6 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: bgColor, color: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  // Delivery item component for recent deliveries
  const RecentDeliveryItem = ({ delivery }) => (
    <div
      className="rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-sm"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: `${getStatusColor(delivery.status)}20`,
              color: getStatusColor(delivery.status),
            }}
          >
            {delivery.status === "Delivered" ? (
              <FiCheckCircle size={20} />
            ) : (
              <FiAlertCircle size={20} />
            )}
          </div>
          <div>
            <div className="flex items-center">
              <p
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Order #{delivery.orderId.split("-")[1]}
              </p>
              <span
                className="mx-2 text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${getStatusColor(delivery.status)}20`,
                  color: getStatusColor(delivery.status),
                }}
              >
                {delivery.status}
              </span>
            </div>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {delivery.customer}
            </p>
            <div className="flex items-start mt-1">
              <FiMapPin
                className="mr-1 mt-0.5 flex-shrink-0"
                size={14}
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {delivery.address}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p
            className="text-xs text-right"
            style={{ color: "var(--text-secondary)" }}
          >
            {delivery.time}
          </p>
          {delivery.reason && (
            <p
              className="text-xs mt-1 text-right"
              style={{ color: "var(--error-color)" }}
            >
              {delivery.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Delivery item component for upcoming deliveries
  const UpcomingDeliveryItem = ({ delivery }) => {
    const priorityInfo = getPriorityInfo(delivery.priority);

    return (
      <div
        className="rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-sm"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiPackage size={20} />
            </div>
            <div>
              <div className="flex items-center">
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order #{delivery.orderId.split("-")[1]}
                </p>
                <span
                  className="mx-2 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${priorityInfo.color}20`,
                    color: priorityInfo.color,
                  }}
                >
                  {priorityInfo.label}
                </span>
              </div>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {delivery.customer}
              </p>
              <div className="flex items-start mt-1">
                <FiMapPin
                  className="mr-1 mt-0.5 flex-shrink-0"
                  size={14}
                  style={{ color: "var(--text-secondary)" }}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {delivery.address}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div
              className="flex items-center text-xs mb-2"
              style={{ color: "var(--brand-primary)" }}
            >
              <FiClock size={12} className="mr-1" />
              {delivery.scheduledTime}
            </div>
            <Link
              to={`/delivery/status-update/${delivery.id}`}
              className="flex items-center justify-end text-xs font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              View Details
              <FiChevronRight size={14} className="ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Performance metrics component
  const PerformanceMetrics = () => (
    <div
      className="rounded-lg p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Performance Metrics
        </h2>
        <Link
          to="/delivery/history"
          className="text-xs font-medium flex items-center"
          style={{ color: "var(--brand-primary)" }}
        >
          View History
          <FiChevronRight size={14} className="ml-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              On-time Delivery Rate
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              95%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full"
              style={{ width: "95%", backgroundColor: "var(--success-color)" }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Successful Delivery Rate
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              98%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full"
              style={{ width: "98%", backgroundColor: "var(--success-color)" }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Average Delivery Time
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              25 mins
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full"
              style={{ width: "85%", backgroundColor: "var(--brand-primary)" }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Customer Rating
            </p>
            <div className="flex items-center">
              <p
                className="text-sm font-bold mr-1"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.rating}
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={12}
                    className="mr-0.5"
                    style={{
                      color:
                        i < Math.floor(stats.rating)
                          ? "var(--warning-color)"
                          : "var(--text-secondary)",
                      fill:
                        i < Math.floor(stats.rating)
                          ? "var(--warning-color)"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${(stats.rating / 5) * 100}%`,
                backgroundColor: "var(--warning-color)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Delivery Dashboard
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Welcome back! Here's an overview of your delivery activities.
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <div
              className="mr-2 px-4 py-2 rounded-md text-sm flex items-center"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <FiCalendar
                size={16}
                className="mr-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <span style={{ color: "var(--text-primary)" }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
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
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                icon={<FiTruck size={24} />}
                value={stats.todayDeliveries}
                label="Today's Deliveries"
                color="var(--brand-primary)"
                bgColor="var(--bg-accent-light)"
              />
              <StatCard
                icon={<FiPackage size={24} />}
                value={stats.pendingDeliveries}
                label="Pending Deliveries"
                color="var(--warning-color)"
                bgColor="var(--warning-color)20"
              />
              <StatCard
                icon={<FiCheckCircle size={24} />}
                value={stats.completedDeliveries}
                label="Completed Deliveries"
                color="var(--success-color)"
                bgColor="var(--success-color)20"
              />
              <StatCard
                icon={<FiStar size={24} />}
                value={stats.rating}
                label="Customer Rating"
                color="var(--warning-color)"
                bgColor="var(--warning-color)20"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Recent & Upcoming Deliveries */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Deliveries */}
                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-lg font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Upcoming Deliveries
                    </h2>
                    <Link
                      to="/delivery/assignments"
                      className="text-xs font-medium flex items-center"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      View All
                      <FiChevronRight size={14} className="ml-0.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {upcomingDeliveries.length > 0 ? (
                      upcomingDeliveries.map((delivery) => (
                        <UpcomingDeliveryItem
                          key={delivery.id}
                          delivery={delivery}
                        />
                      ))
                    ) : (
                      <div
                        className="py-6 text-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No upcoming deliveries at this time.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-lg font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Recent Deliveries
                    </h2>
                    <Link
                      to="/delivery/history"
                      className="text-xs font-medium flex items-center"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      View History
                      <FiChevronRight size={14} className="ml-0.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {recentDeliveries.length > 0 ? (
                      recentDeliveries.map((delivery) => (
                        <RecentDeliveryItem
                          key={delivery.id}
                          delivery={delivery}
                        />
                      ))
                    ) : (
                      <div
                        className="py-6 text-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No recent deliveries.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Performance */}
              <div className="space-y-6">
                <PerformanceMetrics />

                {/* Quick Actions */}
                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <Link
                      to="/delivery/assignments"
                      className="block p-3 rounded-lg transition-all duration-200 hover:shadow-sm flex justify-between items-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{
                            backgroundColor: "var(--brand-primary)20",
                            color: "var(--brand-primary)",
                          }}
                        >
                          <FiPackage size={16} />
                        </div>
                        <span style={{ color: "var(--text-primary)" }}>
                          View Assignments
                        </span>
                      </div>
                      <FiChevronRight />
                    </Link>

                    <Link
                      to="/delivery/history"
                      className="block p-3 rounded-lg transition-all duration-200 hover:shadow-sm flex justify-between items-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{
                            backgroundColor: "var(--success-color)20",
                            color: "var(--success-color)",
                          }}
                        >
                          <FiClock size={16} />
                        </div>
                        <span style={{ color: "var(--text-primary)" }}>
                          View Delivery History
                        </span>
                      </div>
                      <FiChevronRight />
                    </Link>

                    <Link
                      to="/delivery/status-update"
                      className="block p-3 rounded-lg transition-all duration-200 hover:shadow-sm flex justify-between items-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{
                            backgroundColor: "var(--warning-color)20",
                            color: "var(--warning-color)",
                          }}
                        >
                          <FiBarChart2 size={16} />
                        </div>
                        <span style={{ color: "var(--text-primary)" }}>
                          Update Delivery Status
                        </span>
                      </div>
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDashboard;
