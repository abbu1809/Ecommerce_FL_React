import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit, FiTrash2, FiSearch, FiStar, FiEye, FiEyeOff, 
  FiMove, FiSettings, FiUpload, FiExternalLink, FiPackage,
  FiGrid, FiList, FiRefreshCw, FiDownload, FiFilter
} from 'react-icons/fi';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';
import {useBrandsStore} from '../../../store/Admin/useBrandsStore';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

const BrandsManager = () => {
  const {
    brands,
    loading,
    error,
    fetchBrands,
    addBrand,
    editBrand,
    deleteBrand,
    toggleBrandFeatured,
    toggleBrandActive,
    reorderBrands,
    searchBrands,
    initializeDefaultBrands,
    clearError,
    getBrandStats
  } = useBrandsStore();

  // State variables
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    activeOnly: false,
    featuredOnly: false
  });

  // Form state for add/edit
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    website_url: '',
    featured: false,
    active: true,
    display_order: 0,
    meta_data: {}
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // SortableItem component for drag and drop
  const SortableItem = ({ brand }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: brand.brand_id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-primary)"
        }}
        className={`rounded-lg border shadow-sm p-4 transition-all ${
          isDragging ? 'shadow-lg' : ''
        } ${!brand.active ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-gray-600"
              style={{ color: "var(--text-secondary)" }}
            >
              <FiMove size={20} />
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Brand Logo */}
              <div 
                className="w-12 h-12 rounded-lg border flex items-center justify-center overflow-hidden"
                style={{ borderColor: "var(--border-primary)" }}
              >
                {brand.logo_url ? (
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-lg font-bold"
                    style={{ 
                      backgroundColor: brand.meta_data?.color || "var(--brand-primary)",
                      color: "white"
                    }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span 
                    className="font-medium text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {brand.name}
                  </span>
                  {brand.featured && (
                    <FiStar 
                      size={16} 
                      className="text-yellow-500 fill-current" 
                      title="Featured Brand"
                    />
                  )}
                  <div className={`w-3 h-3 rounded-full ${
                    brand.active ? 'bg-green-500' : 'bg-red-500'
                  }`} title={brand.active ? 'Active' : 'Inactive'} />
                </div>
                
                <div className="flex items-center space-x-4 mt-1">
                  <span 
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {brand.slug}
                  </span>
                  {brand.product_count > 0 && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: "var(--brand-primary)20",
                        color: "var(--brand-primary)"
                      }}
                    >
                      {brand.product_count} products
                    </span>
                  )}
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    Order: {brand.display_order}
                  </span>
                </div>
                
                {brand.description && (
                  <p 
                    className="text-sm mt-1 max-w-md truncate"
                    style={{ color: "var(--text-secondary)" }}
                    title={brand.description}
                  >
                    {brand.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md transition-colors hover:bg-blue-50"
                style={{ color: "var(--brand-primary)" }}
                title="Visit Website"
              >
                <FiExternalLink size={16} />
              </a>
            )}
            
            <button
              onClick={() => handleToggleFeatured(brand.brand_id)}
              className={`p-2 rounded-md transition-colors ${
                brand.featured
                  ? 'text-yellow-600 hover:bg-yellow-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={brand.featured ? 'Remove from featured' : 'Add to featured'}
            >
              <FiStar size={16} className={brand.featured ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={() => handleToggleActive(brand.brand_id)}
              className={`p-2 rounded-md transition-colors ${
                brand.active
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={brand.active ? 'Deactivate brand' : 'Activate brand'}
            >
              {brand.active ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
            
            <button
              onClick={() => openEditForm(brand)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit brand"
            >
              <FiEdit size={16} />
            </button>
            
            <button
              onClick={() => confirmDelete(brand)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete brand"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Updated drag end handler for @dnd-kit
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = brands.findIndex(brand => brand.brand_id === active.id);
    const newIndex = brands.findIndex(brand => brand.brand_id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newBrands = arrayMove(brands, oldIndex, newIndex);
      
      // Update display orders
      const brandOrders = newBrands.map((brand, index) => ({
        brand_id: brand.brand_id,
        display_order: index + 1
      }));

      try {
        await reorderBrands(brandOrders);
      } catch (err) {
        console.error('Error in drag end:', err);
        toast.error('Failed to reorder brands');
      }
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchBrands(filterOptions.activeOnly, filterOptions.featuredOnly);
  }, [fetchBrands, filterOptions]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Form handlers
  const resetForm = () => {
    setBrandForm({
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      website_url: '',
      featured: false,
      active: true,
      display_order: brands.length + 1,
      meta_data: {}
    });
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      if (!brandForm.name.trim()) {
        toast.error('Brand name is required');
        return;
      }

      // Auto-generate slug if not provided
      const finalBrandData = {
        ...brandForm,
        slug: brandForm.slug || brandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        display_order: brandForm.display_order || brands.length + 1
      };

      await addBrand(finalBrandData);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };

  const handleEditBrand = async (e) => {
    e.preventDefault();
    try {
      if (!editingBrand.name.trim()) {
        toast.error('Brand name is required');
        return;
      }

      await editBrand(editingBrand.brand_id, editingBrand);
      setShowEditForm(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await deleteBrand(brandToDelete.brand_id);
      setShowDeleteModal(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleToggleFeatured = async (brandId) => {
    try {
      await toggleBrandFeatured(brandId);
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleActive = async (brandId) => {
    try {
      await toggleBrandActive(brandId);
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        await searchBrands(searchQuery.trim());
      } catch (error) {
        console.error('Error searching brands:', error);
      }
    } else {
      fetchBrands(filterOptions.activeOnly, filterOptions.featuredOnly);
    }
  };

  const handleInitializeDefaults = async () => {
    try {
      await initializeDefaultBrands();
    } catch (error) {
      console.error('Error initializing default brands:', error);
    }
  };

  const openEditForm = (brand) => {
    setEditingBrand({ ...brand });
    setShowEditForm(true);
  };

  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  // Get statistics
  const stats = getBrandStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Brands Manager
          </h2>
          <p 
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage brand information, logos, and display settings
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            icon={viewMode === 'grid' ? <FiList /> : <FiGrid />}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleInitializeDefaults}
            icon={<FiDownload />}
          >
            Load Defaults
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            icon={<FiPlus />}
          >
            Add Brand
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)"
          }}
        >
          <div className="flex items-center">
            <FiPackage 
              className="w-8 h-8 mr-3"
              style={{ color: "var(--brand-primary)" }}
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.total}
              </p>
              <p 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Brands
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)"
          }}
        >
          <div className="flex items-center">
            <FiEye 
              className="w-8 h-8 mr-3"
              style={{ color: "var(--success-color)" }}
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.active}
              </p>
              <p 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Active Brands
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)"
          }}
        >
          <div className="flex items-center">
            <FiStar 
              className="w-8 h-8 mr-3"
              style={{ color: "var(--warning-color)" }}
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.featured}
              </p>
              <p 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Featured Brands
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)"
          }}
        >
          <div className="flex items-center">
            <FiPackage 
              className="w-8 h-8 mr-3"
              style={{ color: "var(--info-color)" }}
            />
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.totalProducts}
              </p>
              <p 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div 
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-primary)"
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex">
              <input
                type="text"
                placeholder="Search brands by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                className="rounded-l-none"
                icon={<FiSearch />}
              >
                Search
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterOptions.activeOnly}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  activeOnly: e.target.checked
                }))}
                className="mr-2"
              />
              <span 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Active Only
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterOptions.featuredOnly}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  featuredOnly: e.target.checked
                }))}
                className="mr-2"
              />
              <span 
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Featured Only
              </span>
            </label>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchBrands(filterOptions.activeOnly, filterOptions.featuredOnly)}
              icon={<FiRefreshCw />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Brands List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : brands.length === 0 ? (
        <div 
          className="text-center py-12 rounded-lg border-2 border-dashed"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <FiPackage 
            className="mx-auto mb-4"
            size={48}
            style={{ color: "var(--text-secondary)" }}
          />
          <p 
            className="text-lg font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No brands found
          </p>
          <p 
            className="mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Get started by adding your first brand or loading default brands
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handleInitializeDefaults}
              icon={<FiDownload />}
            >
              Load Default Brands
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              icon={<FiPlus />}
            >
              Add Your First Brand
            </Button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={brands.map(brand => brand.brand_id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {brands.map((brand) => (
                <SortableItem
                  key={brand.brand_id}
                  brand={brand}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Brand Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          resetForm();
        }}
        title="Add New Brand"
      >
        <form onSubmit={handleAddBrand} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Brand Name *
              </label>
              <input
                type="text"
                value={brandForm.name}
                onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Slug
              </label>
              <input
                type="text"
                value={brandForm.slug}
                onChange={(e) => setBrandForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
                placeholder="auto-generated from name"
              />
            </div>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Description
            </label>
            <textarea
              value={brandForm.description}
              onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)"
              }}
              placeholder="Enter brand description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Logo URL
              </label>
              <input
                type="url"
                value={brandForm.logo_url}
                onChange={(e) => setBrandForm(prev => ({ ...prev, logo_url: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Website URL
              </label>
              <input
                type="url"
                value={brandForm.website_url}
                onChange={(e) => setBrandForm(prev => ({ ...prev, website_url: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
                placeholder="https://brand-website.com"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={brandForm.featured}
                onChange={(e) => setBrandForm(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2"
              />
              <span 
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Featured Brand
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={brandForm.active}
                onChange={(e) => setBrandForm(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <span 
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Active
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Brand'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Brand Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingBrand(null);
        }}
        title="Edit Brand"
      >
        {editingBrand && (
          <form onSubmit={handleEditBrand} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Slug
                </label>
                <input
                  type="text"
                  value={editingBrand.slug}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  placeholder="brand-slug"
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Description
              </label>
              <textarea
                value={editingBrand.description || ''}
                onChange={(e) => setEditingBrand(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)"
                }}
                placeholder="Enter brand description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Logo URL
                </label>
                <input
                  type="url"
                  value={editingBrand.logo_url || ''}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Website URL
                </label>
                <input
                  type="url"
                  value={editingBrand.website_url || ''}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  placeholder="https://brand-website.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingBrand.display_order || 0}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  min="0"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Count
                </label>
                <input
                  type="number"
                  value={editingBrand.product_count || 0}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, product_count: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)"
                  }}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingBrand.featured}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, featured: e.target.checked }))}
                  className="mr-2"
                />
                <span 
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Featured Brand
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingBrand.active}
                  onChange={(e) => setEditingBrand(prev => ({ ...prev, active: e.target.checked }))}
                  className="mr-2"
                />
                <span 
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  Active
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingBrand(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Brand'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBrandToDelete(null);
        }}
        title="Delete Brand"
      >
        {brandToDelete && (
          <div>
            <p 
              className="mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Are you sure you want to delete <strong>{brandToDelete.name}</strong>? 
              This action cannot be undone.
            </p>
            
            {brandToDelete.product_count > 0 && (
              <div 
                className="p-3 mb-4 rounded-md border-l-4"
                style={{
                  backgroundColor: "var(--warning-color)10",
                  borderLeftColor: "var(--warning-color)"
                }}
              >
                <p 
                  className="text-sm"
                  style={{ color: "var(--warning-color)" }}
                >
                  Warning: This brand has {brandToDelete.product_count} associated products.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setBrandToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteBrand}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Brand'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrandsManager;
