import { useState } from "react";
import ReturnTable from "../../components/Admin/Returns/ReturnTable";
import ReturnDetail from "../../components/Admin/Returns/ReturnDetail";

const AdminReturns = () => {
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Return & Refund Requests
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReturnTable
            onSelectReturn={setSelectedReturn}
            filterStatus={filterStatus}
          />
        </div>
        <div className="lg:col-span-1">
          {selectedReturn ? (
            <ReturnDetail return={selectedReturn} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">
              <p>Select a return request to view details</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Return Policy</h2>
        <div className="prose max-w-none">
          <p>
            Current return policy allows customers to return items within 30
            days of delivery for a full refund. Items must be unused and in
            original packaging.
          </p>
          <h3 className="text-md font-semibold mt-4">Return Process:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Customer submits a return request with reason</li>
            <li>Admin reviews request and approves/rejects</li>
            <li>If approved, customer receives return shipping label</li>
            <li>Once item is received and inspected, refund is processed</li>
            <li>Customer receives notification when refund is complete</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminReturns;
