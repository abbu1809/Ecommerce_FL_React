import { useState } from "react";
import Button from "../../ui/Button";

// Mock return request data - in a real app, this would come from a store or API
const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-12345",
    customer: "John Smith",
    items: [
      {
        id: 1,
        name: "Product 1",
        price: 49.99,
        quantity: 1,
        reason: "Defective item",
      },
    ],
    requestDate: "2023-05-10",
    status: "pending",
    refundAmount: 49.99,
    details: {
      reason: "Defective item",
      description: "The product arrived damaged with scratches on the surface.",
      images: ["https://via.placeholder.com/150?text=Damage+Photo"],
      customerAddress: "123 Main St, New York, NY 10001",
    },
    timeline: [
      {
        date: "2023-05-10",
        status: "Return requested",
        comment: "Customer submitted return request",
      },
    ],
  },
  {
    id: "RET-002",
    orderId: "ORD-12346",
    customer: "Jane Doe",
    items: [
      {
        id: 3,
        name: "Product 3",
        price: 89.99,
        quantity: 1,
        reason: "Wrong item",
      },
    ],
    requestDate: "2023-05-12",
    status: "approved",
    refundAmount: 89.99,
    details: {
      reason: "Wrong item",
      description: "I ordered the blue version but received the red one.",
      images: ["https://via.placeholder.com/150?text=Wrong+Item"],
      customerAddress: "456 Broadway, New York, NY 10002",
    },
    timeline: [
      {
        date: "2023-05-12",
        status: "Return requested",
        comment: "Customer submitted return request",
      },
      {
        date: "2023-05-13",
        status: "Approved",
        comment: "Return request approved, shipping label sent",
      },
    ],
  },
  {
    id: "RET-003",
    orderId: "ORD-12347",
    customer: "Mike Johnson",
    items: [
      {
        id: 4,
        name: "Product 4",
        price: 99.99,
        quantity: 1,
        reason: "Changed mind",
      },
      {
        id: 5,
        name: "Product 5",
        price: 29.99,
        quantity: 2,
        reason: "Changed mind",
      },
    ],
    requestDate: "2023-05-15",
    status: "rejected",
    refundAmount: 159.97,
    details: {
      reason: "Changed mind",
      description: "I found a better deal elsewhere.",
      images: [],
      customerAddress: "789 Park Ave, New York, NY 10003",
    },
    timeline: [
      {
        date: "2023-05-15",
        status: "Return requested",
        comment: "Customer submitted return request",
      },
      {
        date: "2023-05-16",
        status: "Rejected",
        comment: "Return period exceeded (31 days since delivery)",
      },
    ],
  },
  {
    id: "RET-004",
    orderId: "ORD-12348",
    customer: "Sarah Williams",
    items: [
      {
        id: 6,
        name: "Product 6",
        price: 149.95,
        quantity: 1,
        reason: "Not as described",
      },
    ],
    requestDate: "2023-05-17",
    status: "pending",
    refundAmount: 149.95,
    details: {
      reason: "Not as described",
      description: "Item does not match the specifications listed on website.",
      images: ["https://via.placeholder.com/150?text=Item+Photo"],
      customerAddress: "101 Lexington Ave, New York, NY 10004",
    },
    timeline: [
      {
        date: "2023-05-17",
        status: "Return requested",
        comment: "Customer submitted return request",
      },
    ],
  },
  {
    id: "RET-005",
    orderId: "ORD-12349",
    customer: "Robert Brown",
    items: [
      {
        id: 7,
        name: "Product 7",
        price: 299.99,
        quantity: 1,
        reason: "Defective item",
      },
    ],
    requestDate: "2023-05-18",
    status: "approved",
    refundAmount: 299.99,
    details: {
      reason: "Defective item",
      description: "The product is not working properly.",
      images: ["https://via.placeholder.com/150?text=Defective+Item"],
      customerAddress: "202 5th Ave, New York, NY 10005",
    },
    timeline: [
      {
        date: "2023-05-18",
        status: "Return requested",
        comment: "Customer submitted return request",
      },
      {
        date: "2023-05-19",
        status: "Approved",
        comment: "Return request approved, shipping label sent",
      },
    ],
  },
];

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    approved: { bg: "bg-green-100", text: "text-green-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" },
    completed: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const { bg, text } = statusStyles[status] || statusStyles.pending;

  return (
    <span
      className={`px-3 py-1 uppercase text-xs font-bold rounded-full ${bg} ${text}`}
    >
      {status}
    </span>
  );
};

const ReturnTable = ({ onSelectReturn, filterStatus }) => {
  const [returns, setReturns] = useState(mockReturns);

  const updateReturnStatus = (returnId, newStatus) => {
    setReturns(
      returns.map((returnItem) =>
        returnItem.id === returnId
          ? {
              ...returnItem,
              status: newStatus,
              timeline: [
                ...returnItem.timeline,
                {
                  date: new Date().toISOString().split("T")[0],
                  status:
                    newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                  comment: `Return request ${newStatus}`,
                },
              ],
            }
          : returnItem
      )
    );
  };

  // Filter returns based on status
  const filteredReturns = returns.filter((returnItem) => {
    if (filterStatus === "all") return true;
    return returnItem.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Return ID</th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReturns.map((returnItem) => (
              <tr
                key={returnItem.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectReturn(returnItem)}
              >
                <td className="py-3 px-4 text-sm">{returnItem.id}</td>
                <td className="py-3 px-4 text-sm">{returnItem.orderId}</td>
                <td className="py-3 px-4 text-sm">{returnItem.customer}</td>
                <td className="py-3 px-4 text-sm">{returnItem.requestDate}</td>
                <td className="py-3 px-4 text-sm">
                  ${returnItem.refundAmount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={returnItem.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReturn(returnItem);
                      }}
                    >
                      View
                    </Button>
                    {returnItem.status === "pending" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReturnStatus(returnItem.id, "approved");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReturnStatus(returnItem.id, "rejected");
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {returnItem.status === "approved" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateReturnStatus(returnItem.id, "completed");
                        }}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="py-3 px-4 bg-gray-50 text-gray-600 text-sm">
        Showing {filteredReturns.length} returns
      </div>
    </div>
  );
};

export default ReturnTable;
