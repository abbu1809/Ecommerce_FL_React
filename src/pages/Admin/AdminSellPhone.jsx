import { useState, useEffect } from "react";
import Pagination from "../../components/common/Pagination";
import useAdminSellPhone from "../../store/Admin/useAdminSellPhone";

const AdminSellPhone = () => {
  const [activeTab, setActiveTab] = useState("listings");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Get state and functions from the store
  const {
    catalogs,
    inquiries,
    fetchCatalogs,
    fetchInquiries,
    updateInquiryStatus,
    deleteInquiry,
  } = useAdminSellPhone();
  // Fetch data when component mounts
  useEffect(() => {
    fetchCatalogs();
    fetchInquiries();
  }, [fetchCatalogs, fetchInquiries]);

  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === "listings" ? catalogs.list : inquiries.list;
  };

  const currentData = getCurrentData();

  // Pagination calculations
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Phone Selling Management
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "listings"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            Listings
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        <div className="p-6">
          {activeTab === "listings" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phone Listings</h2>
              <p className="text-gray-500">
                Manage your phone catalog listings here
              </p>

              {catalogs.loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading catalogs...</p>
                </div>
              ) : catalogs.error ? (
                <div className="text-center py-4">
                  <p className="text-red-500">{catalogs.error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>{" "}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(activeTab === "listings"
                        ? paginatedData
                        : catalogs.list
                      ).map((phone) => (
                        <tr key={phone.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={phone.image}
                                  alt={phone.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {phone.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {phone.brand}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Object.keys(phone.variant_prices).join(", ")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phone Inquiries</h2>
              <p className="text-gray-500">Manage sell phone inquiries here</p>

              {inquiries.loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading inquiries...</p>
                </div>
              ) : inquiries.error ? (
                <div className="text-center py-4">
                  <p className="text-red-500">{inquiries.error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone Variant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(activeTab === "orders"
                        ? paginatedData
                        : inquiries.list
                      ).map((inquiry) => (
                        <tr key={inquiry.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {inquiry.user_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {inquiry.user_email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {inquiry.selected_variant}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {inquiry.selected_condition}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                inquiry.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : inquiry.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : inquiry.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {inquiry.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {inquiry.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateInquiryStatus(inquiry.id, "approved")
                                  }
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    updateInquiryStatus(inquiry.id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900 mr-3"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}{" "}
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              showItemCount={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellPhone;
