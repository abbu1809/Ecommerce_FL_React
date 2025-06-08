import { useState } from "react";

const AdminSellPhone = () => {
  const [activeTab, setActiveTab] = useState("listings");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Phone Selling Management</h1>
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
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "pricing"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            Pricing
          </button>
        </div>

        <div className="p-6">
          {activeTab === "listings" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phone Listings</h2>
              <p className="text-gray-500">Manage your phone listings here</p>
              {/* PhoneListingsManager component would go here */}
            </div>
          )}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phone Orders</h2>
              <p className="text-gray-500">Manage orders for phones here</p>
              {/* PhoneOrdersManager component would go here */}
            </div>
          )}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phone Pricing</h2>
              <p className="text-gray-500">Manage pricing for phones here</p>
              {/* PhonePricingManager component would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSellPhone;
