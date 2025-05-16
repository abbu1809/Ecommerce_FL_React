import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiAlertCircle } from "react-icons/fi";
import { DeliveryLayout } from "../../components/Delivery";
import { DeliveryCard } from "../../components/Delivery";

const DeliveryAssignmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch assignments
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        // Mock data - in a real app, this would be fetched from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockAssignments = [
          {
            id: "DEL-1001",
            orderId: "ORD-5732",
            customer: {
              name: "John Smith",
              phone: "202-555-0140",
              address: "123 Main St, Apt 4B, New York, NY 10001",
            },
            items: [
              { name: "Wireless Headphones", quantity: 1 },
              { name: "Smartphone Case", quantity: 1 },
            ],
            status: "pending",
            priority: "normal",
            distance: "3.2 km",
            estimatedTime: "25 min",
            paymentType: "Paid Online",
            createdAt: "2023-10-22T14:30:00Z",
          },
          {
            id: "DEL-1002",
            orderId: "ORD-5733",
            customer: {
              name: "Emily Johnson",
              phone: "202-555-0187",
              address: "456 Park Ave, Suite 7, New York, NY 10022",
            },
            items: [
              { name: "Bluetooth Speaker", quantity: 1 },
              { name: "USB Cable Pack", quantity: 2 },
            ],
            status: "pending",
            priority: "high",
            distance: "1.5 km",
            estimatedTime: "15 min",
            paymentType: "Cash on Delivery",
            createdAt: "2023-10-22T14:45:00Z",
          },
          {
            id: "DEL-1003",
            orderId: "ORD-5736",
            customer: {
              name: "Michael Wilson",
              phone: "202-555-0192",
              address: "789 Broadway, Floor 3, New York, NY 10003",
            },
            items: [
              { name: "Gaming Mouse", quantity: 1 },
              { name: "Mechanical Keyboard", quantity: 1 },
              { name: "Mousepad XL", quantity: 1 },
            ],
            status: "pending",
            priority: "normal",
            distance: "4.7 km",
            estimatedTime: "35 min",
            paymentType: "Paid Online",
            createdAt: "2023-10-22T15:30:00Z",
          },
        ];

        setAssignments(mockAssignments);
        setFilteredAssignments(mockAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    // Filter and search assignments
    const results = assignments.filter((assignment) => {
      const matchesSearch =
        assignment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.customer.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      if (filter === "high-priority")
        return matchesSearch && assignment.priority === "high";
      if (filter === "normal-priority")
        return matchesSearch && assignment.priority === "normal";

      return matchesSearch;
    });

    setFilteredAssignments(results);
  }, [searchTerm, filter, assignments]);

  const handleAcceptDelivery = (deliveryId) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === deliveryId
          ? { ...assignment, status: "accepted" }
          : assignment
      )
    );

    // Normally there would be an API call here to update the status
    console.log(`Accepted delivery: ${deliveryId}`);
  };

  return (
    <DeliveryLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold mb-4 md:mb-0"
            style={{ color: "var(--text-primary)" }}
          >
            Available Delivery Assignments
          </h1>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
            <div className="relative flex-grow md:w-64">
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

            <div className="relative md:w-48">
              <span
                className="absolute inset-y-0 left-0 flex items-center pl-3"
                style={{ color: "var(--text-secondary)" }}
              >
                <FiFilter size={18} />
              </span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm appearance-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderWidth: "1px",
                }}
              >
                <option value="all">All Assignments</option>
                <option value="high-priority">High Priority</option>
                <option value="normal-priority">Normal Priority</option>
              </select>
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
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssignments.map((assignment) => (
              <DeliveryCard
                key={assignment.id}
                delivery={assignment}
                onAccept={() => handleAcceptDelivery(assignment.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <FiAlertCircle
              size={48}
              style={{ color: "var(--text-secondary)" }}
              className="mb-4"
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No assignments found
            </h3>
            <p
              className="text-center max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              {searchTerm || filter !== "all"
                ? "Try changing your search terms or filters"
                : "There are currently no delivery assignments available. Check back later!"}
            </p>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryAssignmentList;
