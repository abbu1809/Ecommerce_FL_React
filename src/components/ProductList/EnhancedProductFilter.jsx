import { useState, useEffect, useCallback } from "react";
import { FiFilter, FiChevronDown, FiChevronUp, FiX, FiCheck } from "react-icons/fi";
import Button from "../ui/Button";
import ProductService from "../../services/productService";

const EnhancedProductFilter = ({
  showFilters,
  setShowFilters,
  currentCategory,
  onFiltersChange,
  resetFilters
}) => {
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [stockFilters, setStockFilters] = useState({
    inStock: false,
    outOfStock: false,
  });
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedRAM, setSelectedRAM] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Dynamic filter options from API
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    storage_options: [],
    ram_options: [],
    color_options: [],
    price_range: { min: 0, max: 150000 },
    dynamic_attributes: {}
  });
  
  const [loading, setLoading] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    category: true,
    brands: true,
    price: true,
    storage: false,
    ram: false,
    colors: false,
    rating: false,
    stock: false,
    discount: false
  });

  // Fetch filter options when category changes
  const _fetchFilterOptions = useCallback(async () => {
    setLoading(true);
    try {
      const options = await ProductService.getFilterOptions(currentCategory);
      setFilterOptions(options);
      
      // Update price range if needed
      if (options.price_range) {
        setPriceRange(prev => ({
          min: Math.min(prev.min, options.price_range.min),
          max: Math.max(prev.max, options.price_range.max)
        }));
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);

  // Update parent component when filters change
  useEffect(() => {
    if (onFiltersChange) {
      const filters = {
        brands: selectedBrands,
        categories: selectedCategories,
        priceRange,
        storage: selectedStorage,
        ram: selectedRAM,
        colors: selectedColors,
        rating: selectedRating,
        stockFilters,
        discount: selectedDiscount
      };
      onFiltersChange(filters);
    }
  }, [
    selectedBrands,
    selectedCategories,
    priceRange,
    selectedStorage,
    selectedRAM,
    selectedColors,
    selectedRating,
    stockFilters,
    selectedDiscount,
    onFiltersChange
  ]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleBrandFilter = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategoryFilter = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStorageFilter = (storage) => {
    setSelectedStorage(prev => 
      prev.includes(storage) 
        ? prev.filter(s => s !== storage)
        : [...prev, storage]
    );
  };

  const toggleRAMFilter = (ram) => {
    setSelectedRAM(prev => 
      prev.includes(ram) 
        ? prev.filter(r => r !== ram)
        : [...prev, ram]
    );
  };

  const toggleColorFilter = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 150000 });
    setSelectedStorage([]);
    setSelectedRAM([]);
    setSelectedColors([]);
    setSelectedRating(0);
    setStockFilters({ inStock: false, outOfStock: false });
    setSelectedDiscount(null);
    if (resetFilters) resetFilters();
  };

  const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </span>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  const CheckboxOption = ({ checked, onChange, label, count }) => (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-4 h-4 border-2 rounded ${
            checked 
              ? 'bg-blue-500 border-blue-500' 
              : 'border-gray-300 dark:border-gray-600'
          } flex items-center justify-center`}>
            {checked && <FiCheck className="w-3 h-3 text-white" />}
          </div>
        </div>
        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({count})
        </span>
      )}
    </label>
  );

  return (
    <div className={`w-full md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        {/* Filter Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading filters...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {/* Categories */}
            {!currentCategory && filterOptions.categories.length > 0 && (
              <FilterSection
                title="Categories"
                isOpen={openSections.category}
                onToggle={() => toggleSection('category')}
              >
                <div className="space-y-1">
                  {filterOptions.categories.map((category) => (
                    <CheckboxOption
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategoryFilter(category)}
                      label={category}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Brands */}
            {filterOptions.brands.length > 0 && (
              <FilterSection
                title="Brands"
                isOpen={openSections.brands}
                onToggle={() => toggleSection('brands')}
              >
                <div className="space-y-1">
                  {filterOptions.brands.map((brand) => (
                    <CheckboxOption
                      key={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrandFilter(brand)}
                      label={brand}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Price Range */}
            <FilterSection
              title="Price Range"
              isOpen={openSections.price}
              onToggle={() => toggleSection('price')}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                      min="0"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Range: ₹{filterOptions.price_range.min} - ₹{filterOptions.price_range.max}
                </div>
              </div>
            </FilterSection>

            {/* Storage */}
            {filterOptions.storage_options.length > 0 && (
              <FilterSection
                title="Storage"
                isOpen={openSections.storage}
                onToggle={() => toggleSection('storage')}
              >
                <div className="space-y-1">
                  {filterOptions.storage_options.map((storage) => (
                    <CheckboxOption
                      key={storage}
                      checked={selectedStorage.includes(storage)}
                      onChange={() => toggleStorageFilter(storage)}
                      label={storage}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* RAM */}
            {filterOptions.ram_options.length > 0 && (
              <FilterSection
                title="RAM"
                isOpen={openSections.ram}
                onToggle={() => toggleSection('ram')}
              >
                <div className="space-y-1">
                  {filterOptions.ram_options.map((ram) => (
                    <CheckboxOption
                      key={ram}
                      checked={selectedRAM.includes(ram)}
                      onChange={() => toggleRAMFilter(ram)}
                      label={ram}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Colors */}
            {filterOptions.color_options.length > 0 && (
              <FilterSection
                title="Colors"
                isOpen={openSections.colors}
                onToggle={() => toggleSection('colors')}
              >
                <div className="space-y-1">
                  {filterOptions.color_options.map((color) => (
                    <CheckboxOption
                      key={color}
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColorFilter(color)}
                      label={color}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Rating */}
            <FilterSection
              title="Rating"
              isOpen={openSections.rating}
              onToggle={() => toggleSection('rating')}
            >
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {rating}★ & above
                    </span>
                  </label>
                ))}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === 0}
                    onChange={() => setSelectedRating(0)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    All Ratings
                  </span>
                </label>
              </div>
            </FilterSection>

            {/* Stock Status */}
            <FilterSection
              title="Availability"
              isOpen={openSections.stock}
              onToggle={() => toggleSection('stock')}
            >
              <div className="space-y-2">
                <CheckboxOption
                  checked={stockFilters.inStock}
                  onChange={(e) => setStockFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  label="In Stock"
                />
                <CheckboxOption
                  checked={stockFilters.outOfStock}
                  onChange={(e) => setStockFilters(prev => ({ ...prev, outOfStock: e.target.checked }))}
                  label="Out of Stock"
                />
              </div>
            </FilterSection>

            {/* Discount */}
            <FilterSection
              title="Discount"
              isOpen={openSections.discount}
              onToggle={() => toggleSection('discount')}
            >
              <div className="space-y-2">
                {[50, 40, 30, 20, 10].map((discount) => (
                  <label key={discount} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="discount"
                      checked={selectedDiscount === discount}
                      onChange={() => setSelectedDiscount(discount)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {discount}% or more
                    </span>
                  </label>
                ))}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="discount"
                    checked={selectedDiscount === null}
                    onChange={() => setSelectedDiscount(null)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Any Discount
                  </span>
                </label>
              </div>
            </FilterSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedProductFilter;
