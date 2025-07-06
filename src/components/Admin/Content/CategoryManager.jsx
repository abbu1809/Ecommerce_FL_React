import { useState, useEffect, useRef } from "react";
import Button from "../../ui/Button";
import { toast } from "../../../utils/toast";
import useCategory from "../../../store/useCategory";
import { FiUpload, FiRefreshCw, FiArrowUp, FiArrowDown } from "react-icons/fi";

const CategoryManager = () => {
  const {
    categories: categoryState,
    fetchCategories,
    addCategory,
    editCategory,
    uploadCategoryImage,
  } = useCategory();
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    image_url: "",
    redirect_url: "",
    order: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const result = await uploadCategoryImage(file);

      if (result.success) {
        if (editingCategory) {
          setEditingCategory({
            ...editingCategory,
            image_url: result.imageUrl,
          });
        } else {
          setNewCategory({
            ...newCategory,
            image_url: result.imageUrl,
          });
        }
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory.name) {
      toast.error("Category name is required");
      return;
    }

    const result = await editCategory(editingCategory.id, {
      name: editingCategory.name,
      image_url: editingCategory.image_url,
      redirect_url: editingCategory.redirect_url || "",
      order: editingCategory.order || 0,
    });

    if (result.success) {
      toast.success(result.message || "Category updated successfully");
      setEditingCategory(null);
    } else {
      toast.error(result.error || "Failed to update category");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }

    const result = await addCategory({
      name: newCategory.name,
      image_url: newCategory.image_url || "",
      redirect_url: newCategory.redirect_url || "",
      order: newCategory.order || 0,
    });

    if (result.success) {
      toast.success(result.message || "Category added successfully");
      setNewCategory({
        name: "",
        image_url: "",
        redirect_url: "",
        order: 0,
      });
      setShowAddForm(false);
    } else {
      toast.error(result.error || "Failed to add category");
    }
  };

  const moveCategory = async (category, direction) => {
    // Find categories with adjacent orders
    const sortedCategories = [...categoryState.list].sort(
      (a, b) => a.order - b.order
    );
    const currentIndex = sortedCategories.findIndex(
      (cat) => cat.id === category.id
    );

    if (direction === "up" && currentIndex > 0) {
      const targetCategory = sortedCategories[currentIndex - 1];
      const newOrder = targetCategory.order;

      await editCategory(category.id, { ...category, order: newOrder });
      await editCategory(targetCategory.id, {
        ...targetCategory,
        order: category.order,
      });
      fetchCategories();
    } else if (
      direction === "down" &&
      currentIndex < sortedCategories.length - 1
    ) {
      const targetCategory = sortedCategories[currentIndex + 1];
      const newOrder = targetCategory.order;

      await editCategory(category.id, { ...category, order: newOrder });
      await editCategory(targetCategory.id, {
        ...targetCategory,
        order: category.order,
      });
      fetchCategories();
    }
  };

  // Sort categories by order
  const sortedCategories = [...(categoryState.list || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Manage Categories
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchCategories()}
            className="flex items-center gap-1"
          >
            <FiRefreshCw size={16} /> Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingCategory(null);
            }}
          >
            {showAddForm ? "Cancel" : "Add New Category"}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-l-md"
                  value={newCategory.image_url || ""}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      image_url: e.target.value,
                    })
                  }
                  disabled={uploading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 bg-blue-500 text-white rounded-r-md flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <FiUpload />
                  )}
                </button>
              </div>
              {uploading && (
                <div className="mt-2 text-sm text-blue-600">
                  Uploading image...
                </div>
              )}
              {newCategory.image_url && (
                <div className="mt-2">
                  <img
                    src={newCategory.image_url}
                    alt="Category preview"
                    className="h-16 w-auto"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redirect URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.redirect_url || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    redirect_url: e.target.value,
                  })
                }
                placeholder="/products/category-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.order || 0}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddCategory}
              disabled={!newCategory.name}
            >
              Add Category
            </Button>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Edit Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-l-md"
                  value={editingCategory.image_url || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      image_url: e.target.value,
                    })
                  }
                  disabled={uploading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 bg-blue-500 text-white rounded-r-md flex items-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <FiUpload />
                  )}
                </button>
              </div>
              {uploading && (
                <div className="mt-2 text-sm text-blue-600">
                  Uploading image...
                </div>
              )}
              {editingCategory.image_url && (
                <div className="mt-2">
                  <img
                    src={editingCategory.image_url}
                    alt="Category preview"
                    className="h-16 w-auto"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redirect URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.redirect_url || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    redirect_url: e.target.value,
                  })
                }
                placeholder="/products/category-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.order || 0}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              disabled={!editingCategory.name}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Redirect URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((category, index) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-3">
                      {category.order || 0}
                    </span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveCategory(category, "up")}
                        disabled={index === 0}
                        className={`text-gray-500 hover:text-gray-700 ${
                          index === 0 ? "opacity-30" : ""
                        }`}
                        title="Move up"
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveCategory(category, "down")}
                        disabled={index === sortedCategories.length - 1}
                        className={`text-gray-500 hover:text-gray-700 ${
                          index === sortedCategories.length - 1
                            ? "opacity-30"
                            : ""
                        }`}
                        title="Move down"
                      >
                        <FiArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.redirect_url || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categoryState.loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      )}
      {!categoryState.loading && categoryState.list.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
      {categoryState.error && (
        <div className="text-center py-4">
          <p className="text-red-500">{categoryState.error}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
