import { useState } from "react";
import BannerManager from "../../components/Admin/Content/BannerManager";
import { bannerPositionOptions } from "../../constants/bannerOptions";

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("banners");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "banners"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("banners")}
          >
            Banners
          </button>
        </div>

        <div className="p-6">
          {activeTab === "banners" && (
            <BannerManager positionOptions={bannerPositionOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
