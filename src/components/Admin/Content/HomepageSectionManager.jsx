import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiMove, 
  FiSettings,
  FiRefreshCw,
  FiLayout,
  FiGrid
} from 'react-icons/fi';
import Button from '../../ui/Button';
import ConfirmModal from '../../ui/ConfirmModal';
import useHomepageSectionStore from '../../../store/Admin/useHomepageSectionStore';
import toast from 'react-hot-toast';

const HomepageSectionManager = () => {
  // ...existing state and store setup...
  const {
    sections,
    loading,
    error,
    sectionTypes,
    /*designTemplates,*/
    fetchSections,
    addSection,
    editSection,
    deleteSection,
    toggleSection,
    reorderSections,
    getSectionTemplates,
    initializeDefaultSections,
    getSectionTypeDisplayName,
    getSortedSections,
    clearError
  } = useHomepageSectionStore();

  // State variables
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ...existing useEffect and other functions...

  // Updated drag end handler for @dnd-kit
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex(section => section.section_id === active.id);
    const newIndex = sections.findIndex(section => section.section_id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(sections, oldIndex, newIndex);
      
      // Update display orders
      const sectionOrders = newSections.map((section, index) => ({
        section_id: section.section_id,
        display_order: index + 1
      }));

      try {
        await reorderSections(sectionOrders);
      } catch (err) {
        console.error('Error in drag end:', err);
        toast.error('Failed to reorder sections');
      }
    }
  };

  // SortableItem component for drag and drop
  const SortableItem = ({ section }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: section.section_id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white rounded-lg border shadow-sm p-4 transition-all ${
          isDragging ? 'shadow-lg' : ''
        } ${!section.enabled ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab"
            >
              <FiMove size={20} />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                section.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className="font-medium text-gray-800">
                {section.title}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {getSectionTypeDisplayName(section.section_type)}
              </span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {section.design_template}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToggleSection(section.section_id)}
              className={`p-2 rounded-md transition-colors ${
                section.enabled
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={section.enabled ? 'Disable section' : 'Enable section'}
            >
              {section.enabled ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
            <button
              onClick={() => openEditForm(section)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit section"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => confirmDelete(section)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete section"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Section Config Preview */}
        {Object.keys(section.config).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FiSettings size={14} />
              <span>Configuration:</span>
              <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                {Object.keys(section.config).join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Use effect hooks
  const [newSection, setNewSection] = useState({
    section_type: '',
    title: '',
    enabled: true,
    order: 0,
    design_template: 'default',
    config: {}
  });

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleAddSection = async () => {
    try {
      if (!newSection.section_type || !newSection.title) {
        toast.error('Section type and title are required');
        return;
      }

      await addSection(newSection);
      setShowAddForm(false);
      resetNewSectionForm();
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const handleEditSection = async () => {
    try {
      if (!editingSection.title) {
        toast.error('Title is required');
        return;
      }

      await editSection(editingSection.section_id, editingSection);
      setShowEditForm(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error editing section:', error);
    }
  };

  const handleDeleteSection = async () => {
    try {
      if (sectionToDelete) {
        await deleteSection(sectionToDelete.section_id);
        setShowDeleteModal(false);
        setSectionToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleToggleSection = async (sectionId) => {
    try {
      await toggleSection(sectionId);
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  const handleSectionTypeChange = async (sectionType, isEdit = false) => {
    try {
      const templates = await getSectionTemplates(sectionType);
      setAvailableTemplates(templates);
      
      if (isEdit) {
        setEditingSection({
          ...editingSection,
          section_type: sectionType,
          design_template: templates[0] || 'default'
        });
      } else {
        setNewSection({
          ...newSection,
          section_type: sectionType,
          design_template: templates[0] || 'default'
        });
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setAvailableTemplates(['default']);
    }
  };

  const resetNewSectionForm = () => {
    setNewSection({
      section_type: '',
      title: '',
      enabled: true,
      order: sections.length + 1,
      design_template: 'default',
      config: {}
    });
    setAvailableTemplates([]);
  };

  const openEditForm = (section) => {
    setEditingSection({ ...section });
    setShowEditForm(true);
    handleSectionTypeChange(section.section_type, true);
  };

  const confirmDelete = (section) => {
    setSectionToDelete(section);
    setShowDeleteModal(true);
  };

  const handleInitializeDefault = async () => {
    try {
      await initializeDefaultSections();
    } catch (error) {
      console.error('Error initializing default sections:', error);
    }
  };

  const sortedSections = getSortedSections();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Homepage Section Manager</h2>
          <p className="text-sm text-gray-600 mt-1">
            Control which sections appear on the homepage and their order
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => fetchSections()}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button>
          {sections.length === 0 && (
            <Button
              variant="secondary"
              onClick={handleInitializeDefault}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <FiLayout />
              <span>Initialize Default</span>
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              resetNewSectionForm();
              setShowAddForm(true);
            }}
            className="flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Section</span>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading sections...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Sections List */}
      {!loading && sortedSections.length > 0 && (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sortedSections.map(section => section.section_id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sortedSections.map((section, index) => (
                <SortableItem 
                  key={section.section_id}
                  section={section}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {!loading && sortedSections.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiGrid size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No sections configured</h3>
          <p className="text-gray-600 mb-4">
            Start by adding sections to customize your homepage layout
          </p>
          <Button
            variant="primary"
            onClick={handleInitializeDefault}
            className="mr-2"
          >
            Initialize Default Sections
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetNewSectionForm();
              setShowAddForm(true);
            }}
          >
            Add Custom Section
          </Button>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newSection.section_type}
                  onChange={(e) => handleSectionTypeChange(e.target.value)}
                >
                  <option value="">Select section type</option>
                  {sectionTypes.map(type => (
                    <option key={type} value={type}>
                      {getSectionTypeDisplayName(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="Enter section title"
                />
              </div>

              {availableTemplates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Template
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newSection.design_template}
                    onChange={(e) => setNewSection({ ...newSection, design_template: e.target.value })}
                  >
                    {availableTemplates.map(template => (
                      <option key={template} value={template}>
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newSection.order}
                  onChange={(e) => setNewSection({ ...newSection, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={newSection.enabled}
                  onChange={(e) => setNewSection({ ...newSection, enabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-sm text-gray-700">
                  Enable section
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  resetNewSectionForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddSection}
                disabled={loading}
              >
                Add Section
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditForm && editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Section</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editingSection.section_type}
                  onChange={(e) => handleSectionTypeChange(e.target.value, true)}
                >
                  {sectionTypes.map(type => (
                    <option key={type} value={type}>
                      {getSectionTypeDisplayName(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  placeholder="Enter section title"
                />
              </div>

              {availableTemplates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Template
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editingSection.design_template}
                    onChange={(e) => setEditingSection({ ...editingSection, design_template: e.target.value })}
                  >
                    {availableTemplates.map(template => (
                      <option key={template} value={template}>
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editingSection.order}
                  onChange={(e) => setEditingSection({ ...editingSection, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editEnabled"
                  checked={editingSection.enabled}
                  onChange={(e) => setEditingSection({ ...editingSection, enabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editEnabled" className="text-sm text-gray-700">
                  Enable section
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingSection(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSection}
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSection}
        title="Delete Section"
        message={
          sectionToDelete
            ? `Are you sure you want to delete "${sectionToDelete.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this section?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default HomepageSectionManager;
