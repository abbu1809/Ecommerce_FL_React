import React, { useState, useEffect } from 'react';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import PropTypes from 'prop-types';

const SeriesFormModal = ({ brandId, seriesItem, onClose }) => {
  const { addSeries, updateSeries } = useAdminSellPhoneStore();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (seriesItem) {
      setName(seriesItem.name);
    } else {
      setName(''); // Reset for new series
    }
  }, [seriesItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (seriesItem) {
        await updateSeries(brandId, seriesItem.id, { name });
      } else {
        await addSeries(brandId, { name });
      }
      onClose(); // Close modal on success
    } catch (error) {
      // Error is handled by toast in store
      console.error("Series form submission error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">{seriesItem ? 'Edit Series' : 'Add New Series'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="seriesName" className="block text-sm font-medium text-gray-700 mb-1">Series Name</label>
            <input 
              type="text" 
              id="seriesName" 
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
              {isLoading ? (seriesItem ? 'Updating...' : 'Adding...') : (seriesItem ? 'Update Series' : 'Add Series')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeriesFormModal;
