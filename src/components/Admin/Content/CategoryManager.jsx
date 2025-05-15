import { useState } from "react";
import Button from "../../UI/Button";

// Mock category data
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    image: "https://via.placeholder.com/200/E6E6FA/000000?text=Electronics",
    featured: true,
    products: 42,
    parentId: null,
    slug: "electronics",
  },
  {
    id: 2,
    name: "Laptops & Computers",
    description: "Laptops, desktops and accessories",
    image: "https://via.placeholder.com/200/AFEEEE/000000?text=Laptops",
    featured: false,
    products: 18,
    parentId: 1,
    slug: "laptops-computers",
  },
  {
    id: 3,
    name: "Smartphones",
    description: "Mobile phones and accessories",
    image: "https://via.placeholder.com/200/98FB98/000000?text=Smartphones",
    featured: true,
    products: 24,
    parentId: 1,
    slug: "smartphones",
  },
  {
    id: 4,
    name: "Clothing",
    description: "Apparel and fashion items",
    image: "https://via.placeholder.com/200/FFB6C1/000000?text=Clothing",
    featured: true,
    products: 56,
    parentId: null,
    slug: "clothing",
  },
  {
    id: 5,
    name: "Men's Wear",
    description: "Men's apparel and accessories",
    image: "https://via.placeholder.com/200/ADD8E6/000000?text=Mens+Wear",
    featured: false,
    products: 31,
    parentId: 4,
    slug: "mens-wear",
  },
  {
    id: 6,
    name: "Women's Wear",
    description: "Women's apparel and accessories",
    image: "https://via.placeholder.com/200/FFA07A/000000?text=Womens+Wear",
    featured: false,
    products: 25,
    parentId: 4,
    slug: "womens-wear",
  },
];

const CategoryManager = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
    featured: false,
    parentId: null,
    slug: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleFeatured = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, featured: !category.featured }
          : category
      )
    );
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    setCategories(
      categories.map((category) =>
        category.id === editingCategory.id ? editingCategory : category
      )
    );
    setEditingCategory(null);
  };

  const handleAddCategory = () => {
    const newId = Math.max(...categories.map((c) => c.id)) + 1;
    const slug =
      newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, "-");
    setCategories([
      ...categories,
      { ...newCategory, id: newId, slug, products: 0 },
    ]);
    setNewCategory({
      name: "",
      description: "",
      image: "",
      featured: false,
      parentId: null,
      slug: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id) => {
    // Check if the category has any children
    const hasChildren = categories.some((cat) => cat.parentId === id);

    if (hasChildren) {
      alert(
        "Cannot delete a category that has subcategories. Please delete or reassign subcategories first."
      );
      return;
    }

    setCategories(categories.filter((category) => category.id !== id));
  };

  // Get parent categories for dropdown options
  const parentOptions = categories
    .filter((cat) => cat.parentId === null)
    .map((cat) => ({ value: cat.id, label: cat.name }));

  // Function to get category name by ID
  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Manage Categories
        </h2>
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

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
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
                Image URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.image}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, image: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="Generated from name if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.parentId || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    parentId: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">None (Top Level)</option>
                {parentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCategory.featured}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      featured: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Featured Category</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleAddCategory}>
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
                Name
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
                Image URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.image}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    image: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.slug}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    slug: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.parentId || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    parentId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                disabled={categories.some(
                  (cat) => cat.parentId === editingCategory.id
                )} // Disable if this is a parent
              >
                <option value="">None (Top Level)</option>
                {parentOptions
                  .filter((option) => option.value !== editingCategory.id) // Can't be its own parent
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    description: e.target.value,
                  })
                }
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingCategory.featured}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      featured: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Featured Category</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setEditingCategory(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Parent</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 object-cover rounded mr-3"
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                  <p className="text-xs text-gray-400">/{category.slug}</p>
                </td>
                <td className="py-3 px-4">
                  {category.parentId ? (
                    <span className="text-sm">
                      {getCategoryName(category.parentId)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      None (Top Level)
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">{category.products}</td>
                <td className="py-3 px-4 text-center">
                  {category.featured ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Featured
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={category.featured ? "danger" : "primary"}
                      size="sm"
                      onClick={() => handleToggleFeatured(category.id)}
                    >
                      {category.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No categories found. Add your first category!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
