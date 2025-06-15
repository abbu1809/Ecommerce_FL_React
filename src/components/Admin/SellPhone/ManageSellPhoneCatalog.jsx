import React, { useEffect, useState } from 'react';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import BrandList from './BrandList';
import SeriesList from './SeriesList';
import ModelList from './ModelList';

const ManageSellPhoneCatalog = () => {
  const { catalogData, fetchCatalog, catalogLoading, catalogError } = useAdminSellPhoneStore(state => ({
    catalogData: state.sellPhoneCatalog.data,
    fetchCatalog: state.fetchSellPhoneCatalog,
    catalogLoading: state.sellPhoneCatalog.loading,
    catalogError: state.sellPhoneCatalog.error,
  }));

  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);

  useEffect(() => {
    if (fetchCatalog) {
        fetchCatalog();
    }
  }, [fetchCatalog]);

  const handleSelectBrand = (brandId) => {
    setSelectedBrandId(brandId);
    setSelectedSeriesId(null); // Reset series selection when brand changes
  };

  const handleSelectSeries = (seriesId) => {
    setSelectedSeriesId(seriesId);
  };

  if (catalogLoading) {
    return <div className="p-4 text-center">Loading catalog...</div>;
  }

  if (catalogError) {
    return <div className="p-4 text-red-500 text-center">Error loading catalog: {typeof catalogError === 'string' ? catalogError : catalogError?.message || 'Unknown error'}</div>;
  }

  if (!catalogData) {
    return <div className="p-4 text-center">Initializing catalog data...</div>;
  }

  const selectedBrand = catalogData.find(b => b.id === selectedBrandId);
  const selectedSeries = selectedBrand?.series?.find(s => s.id === selectedSeriesId);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Manage Sell Phone Catalog</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brands Column */}
        <div className="lg:col-span-1 bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Brands</h2>
          <BrandList 
            brands={catalogData} 
            onSelectBrand={handleSelectBrand}
            selectedBrandId={selectedBrandId} 
          />
        </div>

        {/* Series Column */}
        <div className="lg:col-span-1 bg-white p-6 shadow-lg rounded-xl">
          {selectedBrand ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Series for {selectedBrand.name}</h2>
              <SeriesList 
                brandId={selectedBrand.id} 
                series={selectedBrand.series || []} 
                onSelectSeries={handleSelectSeries}
                selectedSeriesId={selectedSeriesId}
              />
            </>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">Select a brand to view its series.</p>
            </div>
          )}
        </div>

        {/* Models Column */}
        <div className="lg:col-span-1 bg-white p-6 shadow-lg rounded-xl">
          {selectedBrand && selectedSeries ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Models for {selectedSeries.name}</h2>
              <ModelList 
                brandId={selectedBrand.id}
                seriesId={selectedSeries.id} 
                models={selectedSeries.models || []} 
              />
            </>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">Select a series to view its models.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSellPhoneCatalog;
