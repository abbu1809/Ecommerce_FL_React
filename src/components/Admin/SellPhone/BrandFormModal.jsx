import React, { useState, useEffect } from 'react';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import PropTypes from 'prop-types';

const BrandFormModal = ({ brand, onClose }) => {
  const { addBrand, updateBrand } = useAdminSellPhoneStore();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      setName(brand.name);
    } else {
      setName(''); // Reset for new brand
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (brand) {
        await updateBrand(brand.id, { name });
      } else {
        await addBrand({ name });
      }
      onClose(); // Close modal on success
    } catch (error) {
      // Error is handled by toast in store
      // Optionally, display a specific error message in the modal
      console.error("Form submission error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">{brand ? 'Edit Brand' : 'Add New Brand'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input 
              type="text" 
              id="brandName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              required 
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition duration-150 ease-in-out disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isLoading ? (brand ? 'Updating...' : 'Adding...') : (brand ? 'Update Brand' : 'Add Brand')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BrandFormModal.propTypes = {
  brand: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default BrandFormModal;
