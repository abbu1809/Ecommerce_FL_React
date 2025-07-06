import React, { useState, useEffect } from "react";
import useAdminSellPhone from "../../store/Admin/useAdminSellPhone";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/ui/Button";
import { FaEdit, FaTrash, FaPlus, FaEye, FaArrowLeft } from "react-icons/fa";

// Import SellPhone components
import BrandList from "../../components/Admin/SellPhone/BrandList";
import SeriesList from "../../components/Admin/SellPhone/SeriesList";
import ModelList from "../../components/Admin/SellPhone/ModelList";
import BrandFormModal from "../../components/Admin/SellPhone/BrandFormModal";
import SeriesFormModal from "../../components/Admin/SellPhone/SeriesFormModal";
import ModelFormModal from "../../components/Admin/SellPhone/ModelFormModal";
import FaqFormModal from "../../components/Admin/SellPhone/FaqFormModal";

const AdminSellPhone = () => {
  const [activeTab, setActiveTab] = useState("catalog");
  const [catalogView, setCatalogView] = useState("overview"); // 'overview', 'manageCatalog'
  
  // Navigation state for catalog management
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
    // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Get state and functions from the store
  const {
    catalogs,
    inquiries,
    faq,
    fetchCatalogs,
    fetchInquiries,
    fetchFaq,
    updateInquiryStatus,
    deleteInquiry,
    addBrand,
    updateBrand,
    deleteBrand,
    addSeries,
    updateSeries,
    deleteSeries,
    addModel,
    updateModel,
    deleteModel,
    addFaq,
    updateFaq,
    deleteFaq,
  } = useAdminSellPhone();

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "catalog") {
      fetchCatalogs();
    } else if (activeTab === "inquiries") {
      fetchInquiries();
    } else if (activeTab === "faqs") {
      fetchFaq();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const getBrandsArray = () => {
    if (!catalogs.data || typeof catalogs.data !== 'object') {
      return [];
    }
    
    return Object.keys(catalogs.data).map(brandId => ({
      id: brandId,
      name: brandId.charAt(0).toUpperCase() + brandId.slice(1),
      logo_url: catalogs.data[brandId].logo_url,
      seriesCount: catalogs.data[brandId].phone_series ? Object.keys(catalogs.data[brandId].phone_series).length : 0,
      ...catalogs.data[brandId]
    }));
  };

  // Helper function to get series array for selected brand
  const getSeriesArray = (brandId) => {
    if (!catalogs.data || !catalogs.data[brandId] || !catalogs.data[brandId].phone_series) {
      return [];
    }
    
    const phoneSeries = catalogs.data[brandId].phone_series;
    return Object.keys(phoneSeries).map(seriesId => ({
      id: seriesId,
      display_name: phoneSeries[seriesId].display_name,
      modelCount: phoneSeries[seriesId].phones ? Object.keys(phoneSeries[seriesId].phones).length : 0,
      ...phoneSeries[seriesId]
    }));
  };

  // Helper function to get models array for selected series
  const getModelsArray = (brandId, seriesId) => {
    if (!catalogs.data || !catalogs.data[brandId] || !catalogs.data[brandId].phone_series || !catalogs.data[brandId].phone_series[seriesId] || !catalogs.data[brandId].phone_series[seriesId].phones) {
      return [];
    }
    
    const phones = catalogs.data[brandId].phone_series[seriesId].phones;
    return Object.keys(phones).map(phoneId => ({
      id: phoneId,
      display_name: phones[phoneId].display_name,
      image_url: phones[phoneId].image_url,
      launch_year: phones[phoneId].launch_year,
      demand_score: phones[phoneId].demand_score,
      ...phones[phoneId]
    }));
  };

  // Get current data for overview based on active tab
  const getCurrentOverviewData = () => {
    if (activeTab === "catalog") {
      const brandsObject = catalogs.data;
      if (!brandsObject || typeof brandsObject !== 'object' || Array.isArray(brandsObject)) {
        return [];
      }

      const allPhones = [];
      Object.keys(brandsObject).forEach(brandId => {
        const brandDetails = brandsObject[brandId];
        if (brandDetails && brandDetails.phone_series && typeof brandDetails.phone_series === 'object') {
          Object.keys(brandDetails.phone_series).forEach(seriesId => {
            const seriesDetails = brandDetails.phone_series[seriesId];
            if (seriesDetails && seriesDetails.phones && typeof seriesDetails.phones === 'object') {
              Object.keys(seriesDetails.phones).forEach(phoneId => {
                const phoneDetails = seriesDetails.phones[phoneId];
                if (phoneDetails) {
                  allPhones.push({
                    id: `${brandId}-${seriesId}-${phoneId}`,
                    name: phoneDetails.display_name,
                    image: phoneDetails.image_url || brandDetails.logo_url,
                    brand: brandId,
                    series: seriesDetails.display_name,
                    launch_year: phoneDetails.launch_year,
                    demand_score: phoneDetails.demand_score,
                  });
                }
              });
            }
          });
        }
      });
      return allPhones;
    } else if (activeTab === "inquiries") {
      return inquiries.list || [];
    } else if (activeTab === "faqs") {
      return faq.data || [];
    }
    return [];
  };

  const currentData = getCurrentOverviewData();

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
    setCatalogView("overview");
    setSelectedBrandId(null);
    setSelectedSeriesId(null);
    setSelectedModel(null);
  }, [activeTab]);

  // Navigation handlers
  const handleBackToBrands = () => {
    setSelectedBrandId(null);
    setSelectedSeriesId(null);
    setSelectedModel(null);
  };

  const handleBackToSeries = () => {
    setSelectedSeriesId(null);
    setSelectedModel(null);
  };

  const handleSelectBrand = (brandId) => {
    setSelectedBrandId(brandId);
    setSelectedSeriesId(null);
    setSelectedModel(null);
  };

  const handleSelectSeries = (seriesId) => {
    setSelectedSeriesId(seriesId);
    setSelectedModel(null);
  };

  // Modal handlers
  const handleBrandModal = (brand = null) => {
    setEditingItem(brand);
    setShowBrandModal(true);
  };

  const handleSeriesModal = (series = null) => {
    setEditingItem(series);
    setShowSeriesModal(true);
  };

  const handleModelModal = (model = null) => {
    setEditingItem(model);
    setShowModelModal(true);
  };
  const closeModals = () => {
    setShowBrandModal(false);
    setShowSeriesModal(false);
    setShowModelModal(false);
    setShowFaqModal(false);
    setEditingItem(null);
  };

  // CRUD handlers
  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand and all its series and models?')) {
      await deleteBrand(brandId);
      if (selectedBrandId === brandId) {
        setSelectedBrandId(null);
        setSelectedSeriesId(null);
      }
    }
  };

  const handleDeleteSeries = async (seriesId) => {
    if (window.confirm('Are you sure you want to delete this series and all its models?')) {
      await deleteSeries(selectedBrandId, seriesId);
      if (selectedSeriesId === seriesId) {
        setSelectedSeriesId(null);
      }
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      await deleteModel(selectedSeriesId, modelId);
    }
  };

  const renderCatalogContent = () => {
    if (catalogView === "overview") {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Phone Catalog Overview</h2>
              <p className="text-gray-500">Overview of all phone models in the catalog</p>
            </div>            <button
              onClick={() => setCatalogView("manageCatalog")}
              className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
              style={{
                backgroundColor: "var(--success-color)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)",
                boxShadow: "var(--shadow-small)"
              }}
            >
              <FaEdit className="w-4 h-4" /> 
              <span>Manage Catalog</span>
            </button>
          </div>

          {catalogs.loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading catalog overview...</p>
            </div>
          ) : catalogs.error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{catalogs.error}</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No phone listings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Series</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Launch Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demand Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((phone) => (
                    <tr key={phone.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {phone.image && (
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-full object-cover" src={phone.image} alt={phone.name} />
                            </div>
                          )}
                          <div className={phone.image ? "ml-4" : ""}>
                            <div className="text-sm font-medium text-gray-900">{phone.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{phone.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{phone.series}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{phone.launch_year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{phone.demand_score}/10</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalItems > 0 && (
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
    }

    // Manage Catalog View
    if (catalogView === "manageCatalog") {
      return (
        <>
          <div className="flex justify-between items-center mb-4">            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCatalogView("overview")}
                className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                  borderRadius: "var(--rounded-md)",
                  boxShadow: "var(--shadow-small)"
                }}
              >
                <FaArrowLeft className="w-4 h-4" /> 
                <span>Back to Overview</span>
              </button>
              {selectedBrandId && (
                <button
                  onClick={handleBackToBrands}
                  className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                    borderRadius: "var(--rounded-md)",
                    boxShadow: "var(--shadow-small)"
                  }}
                >
                  <FaArrowLeft className="w-4 h-4" /> 
                  <span>Back to Brands</span>
                </button>
              )}
              {selectedSeriesId && (
                <button
                  onClick={handleBackToSeries}
                  className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                    borderRadius: "var(--rounded-md)",
                    boxShadow: "var(--shadow-small)"
                  }}
                >
                  <FaArrowLeft className="w-4 h-4" /> 
                  <span>Back to Series</span>
                </button>
              )}
            </div>
            <h2 className="text-lg font-semibold">
              {!selectedBrandId ? "Manage Brands" : 
               !selectedSeriesId ? `Manage ${selectedBrandId} Series` : 
               `Manage ${selectedSeriesId} Models`}
            </h2>
          </div>

          {catalogs.loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading catalog...</p>
            </div>
          ) : catalogs.error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{catalogs.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Brands Management */}
              {!selectedBrandId && (
                <div className="lg:col-span-3">
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Brands</h3>                      <button
                        onClick={() => handleBrandModal()}
                        className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "var(--text-on-brand)",
                          borderRadius: "var(--rounded-md)",
                          boxShadow: "var(--shadow-small)"
                        }}
                      >
                        <FaPlus className="w-4 h-4" /> 
                        <span>Add Brand</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getBrandsArray().map((brand) => (
                        <div key={brand.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {brand.logo_url && (
                                <img src={brand.logo_url} alt={brand.name} className="w-8 h-8 rounded-full mr-2" />
                              )}
                              <h4 className="font-semibold">{brand.name}</h4>
                            </div>                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleBrandModal(brand)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--warning-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(brand.id)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--error-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{brand.seriesCount} series</p>                          <button
                            onClick={() => handleSelectBrand(brand.id)}
                            className="w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2"
                            style={{
                              backgroundColor: "var(--success-color)",
                              color: "var(--text-on-brand)",
                              borderRadius: "var(--rounded-md)"
                            }}
                          >
                            <FaEye className="w-3 h-3" /> 
                            <span>Manage Series</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Series Management */}
              {selectedBrandId && !selectedSeriesId && (
                <div className="lg:col-span-3">
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Series for {selectedBrandId}</h3>                      <button
                        onClick={() => handleSeriesModal()}
                        className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "var(--text-on-brand)",
                          borderRadius: "var(--rounded-md)",
                          boxShadow: "var(--shadow-small)"
                        }}
                      >
                        <FaPlus className="w-4 h-4" /> 
                        <span>Add Series</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getSeriesArray(selectedBrandId).map((series) => (
                        <div key={series.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{series.display_name}</h4>                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSeriesModal(series)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--warning-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSeries(series.id)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--error-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{series.modelCount} models</p>                          <button
                            onClick={() => handleSelectSeries(series.id)}
                            className="w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center justify-center space-x-2"
                            style={{
                              backgroundColor: "var(--success-color)",
                              color: "var(--text-on-brand)",
                              borderRadius: "var(--rounded-md)"
                            }}
                          >
                            <FaEye className="w-3 h-3" /> 
                            <span>Manage Models</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Models Management */}
              {selectedBrandId && selectedSeriesId && (
                <div className="lg:col-span-3">
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Models for {selectedSeriesId}</h3>                      <button
                        onClick={() => handleModelModal()}
                        className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "var(--text-on-brand)",
                          borderRadius: "var(--rounded-md)",
                          boxShadow: "var(--shadow-small)"
                        }}
                      >
                        <FaPlus className="w-4 h-4" /> 
                        <span>Add Model</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getModelsArray(selectedBrandId, selectedSeriesId).map((model) => (
                        <div key={model.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {model.image_url && (
                                <img src={model.image_url} alt={model.display_name} className="w-12 h-12 rounded mr-2" />
                              )}
                              <div>
                                <h4 className="font-semibold">{model.display_name}</h4>
                                <p className="text-xs text-gray-500">{model.launch_year}</p>
                              </div>
                            </div>                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleModelModal(model)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--warning-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaEdit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteModel(model.id)}
                                className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
                                style={{
                                  backgroundColor: "var(--error-color)",
                                  color: "var(--text-on-brand)",
                                  borderRadius: "var(--rounded-md)"
                                }}
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Demand Score: {model.demand_score}/10</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  };
  const renderInquiriesContent = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Phone Sell Inquiries</h2>
        <p className="text-gray-500">Manage customer inquiries for selling phones</p>

        {inquiries.loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading inquiries...</p>
          </div>
        ) : inquiries.error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{inquiries.error}</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inquiry.user_name}</div>
                          <div className="text-sm text-gray-500">{inquiry.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.selected_variant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.selected_condition}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${inquiry.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          inquiry.status === "approved" ? "bg-green-100 text-green-800" :
                          inquiry.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"}`}>
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
                            onClick={() => updateInquiryStatus(inquiry.id, "approved")}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(inquiry.id, "rejected")}
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
            {totalItems > 0 && (
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
      </div>
    );
  };

  const renderFaqContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            <p className="text-gray-500">Manage FAQs related to phone selling</p>
          </div>          <button
            onClick={() => setShowFaqModal(true)}
            className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              borderRadius: "var(--rounded-md)",
              boxShadow: "var(--shadow-small)"
            }}
          >
            <FaPlus className="w-4 h-4" /> 
            <span>Add FAQ</span>
          </button>
        </div>

        {faq.loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading FAQs...</p>
          </div>
        ) : faq.error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{faq.error}</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No FAQs found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedData.map((faqItem) => (
              <div key={faqItem.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faqItem.question}</h3>
                    <p className="text-gray-600">{faqItem.answer}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingItem(faqItem);
                        setShowFaqModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this FAQ?')) {
                          deleteFaq(faqItem.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {totalItems > 0 && (
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
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Phone Selling Management</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "catalog"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("catalog")}
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
          {activeTab === "catalog" && renderCatalogContent()}
          {activeTab === "inquiries" && renderInquiriesContent()}
          {activeTab === "faqs" && renderFaqContent()}
        </div>
      </div>

      {/* Modals */}
      {showBrandModal && (
        <BrandFormModal
          open={showBrandModal}
          onClose={closeModals}
          brandToEdit={editingItem}
        />
      )}
      
      {showSeriesModal && (
        <SeriesFormModal
          open={showSeriesModal}
          onClose={closeModals}
          brandId={selectedBrandId}
          seriesToEdit={editingItem}
        />
      )}
        {showModelModal && (
        <ModelFormModal
          open={showModelModal}
          onClose={closeModals}
          seriesId={selectedSeriesId}
          brandId={selectedBrandId}
          modelToEdit={editingItem}
        />
      )}
      
      {showFaqModal && (
        <FaqFormModal
          open={showFaqModal}
          onClose={closeModals}
          faqToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default AdminSellPhone;
