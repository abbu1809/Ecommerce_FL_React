import { useState } from "react";
import Button from "../../UI/Button";

// Mock banner data
const mockBanners = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 70% off on all summer products",
    image:
      "https://via.placeholder.com/800x300/FF9A8B/000000?text=Summer+Sale+Banner",
    link: "/sale/summer",
    position: "hero",
    active: true,
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our newest products",
    image:
      "https://via.placeholder.com/800x300/A8E6CF/000000?text=New+Arrivals+Banner",
    link: "/new-arrivals",
    position: "home-middle",
    active: true,
  },
  {
    id: 3,
    title: "Special Deals",
    description: "Limited time offers on selected items",
    image:
      "https://via.placeholder.com/800x300/DCEDC8/000000?text=Special+Deals+Banner",
    link: "/special-deals",
    position: "home-bottom",
    active: false,
  },
];

const BannerManager = () => {
  const [banners, setBanners] = useState(mockBanners);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    position: "hero",
    active: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleActive = (id) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id ? { ...banner, active: !banner.active } : banner
      )
    );
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    setBanners(
      banners.map((banner) =>
        banner.id === editingBanner.id ? editingBanner : banner
      )
    );
    setEditingBanner(null);
  };

  const handleAddBanner = () => {
    const newId = Math.max(...banners.map((b) => b.id)) + 1;
    setBanners([...banners, { ...newBanner, id: newId }]);
    setNewBanner({
      title: "",
      description: "",
      image: "",
      link: "",
      position: "hero",
      active: true,
    });
    setShowAddForm(false);
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  const positionOptions = [
    { value: "hero", label: "Hero Banner (Top)" },
    { value: "home-middle", label: "Home Middle Section" },
    { value: "home-bottom", label: "Home Bottom Section" },
    { value: "category-top", label: "Category Page Top" },
    { value: "sidebar", label: "Sidebar" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Manage Banners</h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingBanner(null);
          }}
        >
          {showAddForm ? "Cancel" : "Add New Banner"}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Add New Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.title}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, title: e.target.value })
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
                value={newBanner.image}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, image: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.link}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, link: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.position}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, position: e.target.value })
                }
              >
                {positionOptions.map((option) => (
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
                value={newBanner.description}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, description: e.target.value })
                }
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newBanner.active}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleAddBanner}>
              Add Banner
            </Button>
          </div>
        </div>
      )}

      {editingBanner && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Edit Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.title}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, title: e.target.value })
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
                value={editingBanner.image}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, image: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.link}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, link: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.position}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    position: e.target.value,
                  })
                }
              >
                {positionOptions.map((option) => (
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
                value={editingBanner.description}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
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
                  checked={editingBanner.active}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setEditingBanner(null)}>
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
              <th className="py-3 px-4 text-left">Banner</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Position</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-24 w-48 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">
                  <h3 className="font-medium">{banner.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {banner.description}
                  </p>
                  <a
                    href={banner.link}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    {banner.link}
                  </a>
                </td>
                <td className="py-3 px-4">
                  {positionOptions.find((p) => p.value === banner.position)
                    ?.label || banner.position}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      banner.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditBanner(banner)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={banner.active ? "danger" : "primary"}
                      size="sm"
                      onClick={() => handleToggleActive(banner.id)}
                    >
                      {banner.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
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

      {banners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No banners found. Add your first banner!</p>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
