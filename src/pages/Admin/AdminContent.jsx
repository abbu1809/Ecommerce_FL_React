import { useState } from "react";
import BannerManager from "../../components/Admin/Content/BannerManager";
import LogoManager from "../../components/Admin/Content/LogoManager";
import CategoryManager from "../../components/Admin/Content/CategoryManager";
import { bannerPositionOptions } from "../../constants/bannerOptions";

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("logo");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "logo"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("logo")}
          >
            Logo
          </button>
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
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "categories"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>

        <div className="p-6">
          {activeTab === "banners" && (
            <BannerManager positionOptions={bannerPositionOptions} />
          )}
          {activeTab === "logo" && <LogoManager />}
          {activeTab === "categories" && <CategoryManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
