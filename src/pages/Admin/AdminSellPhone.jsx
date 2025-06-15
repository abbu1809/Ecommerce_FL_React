import React, { useState, useEffect } from "react";
import useAdminSellPhone from "../../store/Admin/useAdminSellPhone";
import Pagination from "../../components/common/Pagination";
import ManageSellPhoneCatalog from "../../components/Admin/SellPhone/ManageSellPhoneCatalog";
import Button from "../../components/ui/Button"; // Changed to custom Button
import { FaEdit } from "react-icons/fa"; // Changed from @mui/icons-material to react-icons/fa

const AdminSellPhone = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [listingsViewMode, setListingsViewMode] = useState("flatList"); // 'flatList' or 'manageCatalog'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Get state and functions from the store
  const {
    catalogs, // This is sellPhoneCatalog from the store
    inquiries,
    fetchCatalogs, // Corrected: Was fetchSellPhoneCatalog
    fetchInquiries,
    updateInquiryStatus,
    deleteInquiry,
  } = useAdminSellPhone();

  // Fetch data when component mounts
  useEffect(() => {
    if (activeTab === "listings" && listingsViewMode === "flatList") {
      fetchCatalogs(); // Corrected: Was fetchSellPhoneCatalog
    }
    if (activeTab === "inquiries") {
      fetchInquiries();
    }
  }, [activeTab, listingsViewMode, fetchCatalogs, fetchInquiries]); // Corrected: Was fetchSellPhoneCatalog

  // Get current data based on active tab
  const getCurrentData = () => {
    if (activeTab === "listings" && listingsViewMode === "flatList") {
      // Process the new catalogs.data structure (which is an array of brands)
      if (!catalogs.data || !Array.isArray(catalogs.data)) {
        return [];
      }
      const allPhones = [];
      catalogs.data.forEach((brand) => {
        brand.series?.forEach((series) => {
          series.models?.forEach((model) => {
            allPhones.push({
              id: `${brand.id}-${series.id}-${model.id}`, // Create a unique ID for the flat list
              name: model.name,
              image: model.image || brand.image, // Use model image, fallback to brand image
              brand: brand.name,
              series: series.name,
              // Assuming variantOptions and questionGroups are not directly displayed in this flat list
              // Or if they are, you'd need to decide how to represent them.
              // For simplicity, let's use placeholders or omit them from the flat list for now.
              // variant_options: model.variantOptions, // This would need further processing to display nicely
              // launch_year: model.launch_year, // This field is not in the new structure directly on model
              // The old structure had launch_year, variant_options.ram, variant_options.storage
              // The new structure has model.variantOptions as [{name: 'Storage', options: ['128GB', '256GB']}]
              // We need to adapt the table columns accordingly or simplify.
              // For now, let's adjust columns to what's available: Name, Brand, Series, Image.
            });
          });
        });
      });
      return allPhones;
    } else if (activeTab === "inquiries") {
      return inquiries.data || [];
    }
    return []; // Default empty array
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

  // Reset to first page when tab changes or view mode changes
  useEffect(() => {
    setCurrentPage(1);
    if (activeTab !== "listings") {
      setListingsViewMode("flatList"); // Reset to flat list if navigating away from listings tab
    }
  }, [activeTab]);

  const renderListingsContent = () => {
    if (listingsViewMode === "manageCatalog") {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Manage Phone Catalog</h2>
            <Button
              variant="outlined"
              onClick={() => setListingsViewMode("flatList")}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded shadow transition duration-150 ease-in-out" // Example styling
            >
              Back to Flat List View
            </Button>
          </div>
          <ManageSellPhoneCatalog />
        </>
      );
    }

    // flatList view
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold inline-flex items-center">
              Phone Listings Overview
            </h2>
            <p className="text-gray-500">
              A simplified view of all phone models. Use "Manage Catalog" for
              detailed editing.
            </p>
          </div>
          <Button
            variant="contained"
            startIcon={<FaEdit />} // Assuming your custom Button supports startIcon or similar prop
            onClick={() => setListingsViewMode("manageCatalog")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-150 ease-in-out" // Example styling, adjust as needed
          >
            Manage Full Catalog
          </Button>
        </div>

        {catalogs.loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading catalog overview...</p>
          </div>
        ) : catalogs.error ? (
          <div className="text-center py-4">
            <p className="text-red-500">
              {typeof catalogs.error === "string"
                ? catalogs.error
                : catalogs.error?.message || "Error loading catalog overview."}
            </p>
          </div>
        ) : paginatedData.length === 0 && !catalogs.loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No phone listings found in the overview.</p>
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
                    Series
                  </th>
                  {/* Columns like Variants and Launch Year need to be re-evaluated based on new data structure */}
                  {/* For now, removing them from the flat list for simplicity as they require more complex data mapping */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variants (RAM/Storage)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Launch Year
                  </th> */}
                  {/* Actions like Edit/Delete on this flat list might be confusing if main editing is in ManageSellPhoneCatalog */}
                  {/* Consider removing actions here or making them navigate to the specific item in ManageSellPhoneCatalog */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((phone) => (
                  <tr key={phone.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {phone.image && (
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={phone.image}
                              alt={phone.name}
                            />
                          </div>
                        )}
                        <div className={phone.image ? "ml-4" : ""}>
                          <div className="text-sm font-medium text-gray-900">
                            {phone.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{phone.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{phone.series}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {phone.variant_options?.ram?.join(", ")} /{" "}
                        {phone.variant_options?.storage?.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {phone.launch_year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {totalItems > 0 && listingsViewMode === "flatList" && (
              <div className="pt-4">
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
        )}
      </>
    );
  };

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
            Catalog
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "inquiries"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("inquiries")}
          >
            Inquiries
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "faqs"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("faqs")}
          >
            FAQs
          </button>
        </div>

        <div className="p-6">
          {activeTab === "listings" && renderListingsContent()}
          {activeTab === "inquiries" && (
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
              ) : paginatedData.length === 0 && !inquiries.loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No inquiries found.</p>
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
                      {paginatedData.map((inquiry) => (
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
          )}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
              <p className="text-gray-500">
                Manage FAQs related to phone selling
              </p>
              {/* Placeholder for FAQs content */}
              <div className="text-center py-4">
                <p className="text-gray-500">FAQs content will be here.</p>
                {/* You can add a simple list or a more complex component later */}
                {/* Example:
                <ul className="list-disc list-inside">
                  <li>How do I list my phone for sale?</li>
                  <li>What conditions are accepted?</li>
                  <li>How do I get paid?</li>
                </ul>
                */}
              </div>
            </div>
          )} {/* Added FAQs tab content */}
        </div>
      </div>
    </div>
  );
};

export default AdminSellPhone;
