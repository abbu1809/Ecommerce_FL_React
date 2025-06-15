import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import BrandFormModal from './BrandFormModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const BrandList = ({ brands, onSelectBrand, selectedBrandId }) => {
  const { deleteBrand, fetchSellPhoneCatalog } = useAdminSellPhoneStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand, event) => {
    event.stopPropagation(); // Prevent row selection
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = async (brandId, event) => {
    event.stopPropagation(); // Prevent row selection
    if (window.confirm('Are you sure you want to delete this brand and all its series and models?')) {
      try {
        await deleteBrand(brandId);
        await fetchSellPhoneCatalog(); // Ensure catalog is refetched
        if (selectedBrandId === brandId) {
          onSelectBrand(null); // Deselect if the deleted brand was selected
        }
      } catch (error) {
        console.error("Failed to delete brand:", error);
        // Error toast is likely handled in the store
      }
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Brands</h2>
          <button
            onClick={handleAddBrand}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Add Brand
          </button>
        </div>
        <div className="text-center text-gray-500">
          No brands found.
        </div>
        {isModalOpen && <BrandFormModal open={isModalOpen} onClose={handleCloseModal} brandToEdit={editingBrand} />}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Brands</h2>
        <button
          onClick={handleAddBrand}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Brand
        </button>
      </div>
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="mb-2 border rounded-md hover:bg-gray-100 p-2 flex justify-between items-center"
        >
          <span onClick={() => onSelectBrand(brand.id)} className="cursor-pointer flex-grow">
            {brand.name}
          </span>
          <div>
            <button
              onClick={(e) => handleEditBrand(brand, e)}
              className="mr-2 text-blue-500 hover:text-blue-700 p-1"
              aria-label="edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => handleDeleteBrand(brand.id, e)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="delete"
            >
              <FaTrash />
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
    image: PropTypes.string,
    series: PropTypes.array,
  })).isRequired,
  onSelectBrand: PropTypes.func.isRequired,
  selectedBrandId: PropTypes.string,
};

export default BrandList;
