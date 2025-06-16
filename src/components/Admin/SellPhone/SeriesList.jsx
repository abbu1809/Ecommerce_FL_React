import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import SeriesFormModal from './SeriesFormModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const SeriesList = ({ brandId, series, onSelectSeries, selectedSeriesId }) => {
  const { deleteSeries, fetchSellPhoneCatalog } = useAdminSellPhoneStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);

  const handleAddSeries = () => {
    setEditingSeries(null);
    setIsModalOpen(true);
  };

  const handleEditSeries = (seriesItem, event) => {
    event.stopPropagation();
    setEditingSeries(seriesItem);
    setIsModalOpen(true);
  };

  const handleDeleteSeries = async (seriesIdToDelete, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this series and all its models?')) {
      try {
        await deleteSeries(brandId, seriesIdToDelete);
        await fetchSellPhoneCatalog(); // Refetch catalog
        if (selectedSeriesId === seriesIdToDelete) {
          onSelectSeries(null); // Deselect if the deleted series was selected
        }
      } catch (error) {
        console.error("Failed to delete series:", error);
        // Error toast likely handled in store
      }
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSeries(null);
  };

  if (!series || series.length === 0) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Series for {brandId ? brandId.name : "Selected Brand"}
          </h3>
          <button
            onClick={handleAddSeries}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded flex items-center transition-all duration-200 hover:opacity-90"
          >
            <FaPlus className="mr-2" /> Add New Series
          </button>
        </div>
        <p className="text-gray-500">No series found for this brand.</p>
        {isModalOpen && <SeriesFormModal open={isModalOpen} onClose={handleCloseModal} brandId={brandId} seriesToEdit={editingSeries} />}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Series for {brandId ? brandId.name : "Selected Brand"}
        </h3>
        <button
          onClick={handleAddSeries}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded flex items-center transition-all duration-200 hover:opacity-90"
        >
          <FaPlus className="mr-2" /> Add Series
        </button>
      </div>
      {!brandId && <p className="text-gray-500">Select a brand to see its series.</p>}
      {brandId &&
        series.map((seriesItem) => (
          <div
            key={seriesItem.id}
            className="mb-2 border rounded-md p-2 flex justify-between items-center transition-all duration-200 hover:bg-gray-50"
          >
            <span onClick={() => onSelectSeries(seriesItem.id)} className="cursor-pointer flex-grow">
              {seriesItem.name}
            </span>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSeries(seriesItem, e);
                }}
                className="mr-2 text-blue-500 p-1 transition-all duration-200 hover:opacity-70"
                aria-label="edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSeries(seriesItem.id, e);
                }}
                className="text-red-500 p-1 transition-all duration-200 hover:opacity-70"
                aria-label="delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      {isModalOpen && <SeriesFormModal open={isModalOpen} onClose={handleCloseModal} brandId={brandId} seriesToEdit={editingSeries} />}
    </div>
  );
};

SeriesList.propTypes = {
  brandId: PropTypes.string.isRequired,
  series: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    models: PropTypes.array,
  })).isRequired,
  onSelectSeries: PropTypes.func.isRequired,
  selectedSeriesId: PropTypes.string,
};

export default SeriesList;
