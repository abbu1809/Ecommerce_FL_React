import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import BrandFormModal from './BrandFormModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const BrandList = ({ brands, onSelectBrand, selectedBrandId }) => {
  const { deleteBrand, fetchCatalogs } = useAdminSellPhoneStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand, event) => {
    event.stopPropagation();
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = async (brandId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this brand and all its series and models?')) {
      try {
        await deleteBrand(brandId);
        await fetchCatalogs();
        if (selectedBrandId === brandId) {
          onSelectBrand(null);
        }
      } catch (error) {
        console.error("Failed to delete brand:", error);
      }
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };
  if (!brands || brands.length === 0) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Brands</h2>
          <button
            onClick={handleAddBrand}
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
        <div className="text-center text-gray-500">
          No brands found.
        </div>
        {isModalOpen && <BrandFormModal open={isModalOpen} onClose={handleCloseModal} brandToEdit={editingBrand} />}
      </div>
    );
  }

  return (    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Brands</h2>
        <button
          onClick={handleAddBrand}
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
      {brands.map((brand) => (
        <div
          key={brand.id}          className={`mb-2 border rounded-md p-2 flex justify-between items-center cursor-pointer transition-all duration-200 hover:opacity-90 ${
            selectedBrandId === brand.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectBrand(brand.id)}
        >
          <div className="flex items-center">
            {brand.logo_url && (
              <img src={brand.logo_url} alt={brand.name} className="w-8 h-8 rounded-full mr-3" />
            )}
            <div>
              <div className="font-medium">{brand.name}</div>
              <div className="text-sm text-gray-500">{brand.seriesCount} series</div>
            </div>
          </div>          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => handleEditBrand(brand, e)}
              className="mr-2 p-2 rounded-md transition-all duration-200 hover:opacity-70"
              style={{
                backgroundColor: "var(--warning-color)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)"
              }}
              aria-label="edit"
            >
              <FaEdit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleDeleteBrand(brand.id, e)}
              className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
              style={{
                backgroundColor: "var(--error-color)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)"
              }}
              aria-label="delete"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
      {isModalOpen && <BrandFormModal open={isModalOpen} onClose={handleCloseModal} brandToEdit={editingBrand} />}
    </div>
  );
};

BrandList.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo_url: PropTypes.string,
    seriesCount: PropTypes.number,
  })).isRequired,
  onSelectBrand: PropTypes.func.isRequired,
  selectedBrandId: PropTypes.string,
};

export default BrandList;
