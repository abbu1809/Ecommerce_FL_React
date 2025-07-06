import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { useBannerStore } from "../../../store/Admin/useBannerStore";
import ConfirmModal from "../../ui/ConfirmModal";
import toast from "react-hot-toast";

const BannerManager = ({ positionOptions }) => {
  const {
    banners,
    loading,
    error,
    fetchBanners,
    addBanner,
    editBanner,
    deleteBanner,
    toggleBannerActive,
  } = useBannerStore();
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    link: "",
    position: "hero",
    tag: "",
    cta: "",
    backgroundColor: "#ffffff",
    active: true,
  });
  const [newBannerImageFile, setNewBannerImageFile] = useState(null);
  const [newBannerImagePreview, setNewBannerImagePreview] = useState(null);
  const [editBannerImageFile, setEditBannerImageFile] = useState(null);
  const [editBannerImagePreview, setEditBannerImagePreview] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  useEffect(() => {
    fetchBanners();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // File handling functions
  const handleNewBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBannerImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setNewBannerImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBannerImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditBannerImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetNewBannerForm = () => {
    setNewBanner({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      link: "",
      position: "hero",
      tag: "",
      cta: "",
      backgroundColor: "#ffffff",
      active: true,
    });
    setNewBannerImageFile(null);
    setNewBannerImagePreview(null);
  };

  const resetEditBannerForm = () => {
    setEditingBanner(null);
    setEditBannerImageFile(null);
    setEditBannerImagePreview(null);
  };
  const handleToggleActive = async (id) => {
    await toggleBannerActive(id);
  };
  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setEditBannerImagePreview(banner.image); // Show current image
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();

    // Add all banner fields to FormData
    Object.keys(editingBanner).forEach((key) => {
      if (
        key !== "id" &&
        editingBanner[key] !== null &&
        editingBanner[key] !== undefined
      ) {
        formData.append(key, editingBanner[key]);
      }
    });

    // Add image file if new one is selected
    if (editBannerImageFile) {
      formData.append("image_file", editBannerImageFile);
    }

    await editBanner(editingBanner.id, formData);
    resetEditBannerForm();
  };

  const handleAddBanner = async () => {
    if (!newBannerImageFile) {
      toast.info("Please select an image file");
      return;
    }

    const formData = new FormData();

    // Add all banner fields to FormData
    Object.keys(newBanner).forEach((key) => {
      if (
        key !== "image" &&
        newBanner[key] !== null &&
        newBanner[key] !== undefined
      ) {
        formData.append(key, newBanner[key]);
      }
    });

    // Add image file
    formData.append("image_file", newBannerImageFile);

    await addBanner(formData);
    resetNewBannerForm();
    setShowAddForm(false);
  };
  const handleDeleteBanner = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBanner(bannerToDelete.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting banner:", error);
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading banners...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Manage Banners</h2>
        <Button
          variant="primary"
          onClick={() => {
            if (showAddForm) {
              resetNewBannerForm();
              setShowAddForm(false);
            } else {
              setShowAddForm(true);
              resetEditBannerForm();
            }
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
                Subtitle
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.subtitle}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleNewBannerImageChange}
                required
              />
              {newBannerImagePreview && (
                <div className="mt-2">
                  <img
                    src={newBannerImagePreview}
                    alt="Preview"
                    className="h-24 w-48 object-cover rounded border"
                  />
                </div>
              )}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.tag}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, tag: e.target.value })
                }
                placeholder="e.g., SALE, NEW, LIMITED"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newBanner.cta}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, cta: e.target.value })
                }
                placeholder="e.g., Shop Now, Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <input
                type="color"
                className="w-full p-1 border border-gray-300 rounded-md h-10"
                value={newBanner.backgroundColor}
                onChange={(e) =>
                  setNewBanner({
                    ...newBanner,
                    backgroundColor: e.target.value,
                  })
                }
              />
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
                value={editingBanner.title || ""}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.subtitle || ""}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    subtitle: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={handleEditBannerImageChange}
              />
              {editBannerImagePreview && (
                <div className="mt-2">
                  <img
                    src={editBannerImagePreview}
                    alt="Current/Preview"
                    className="h-24 w-48 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editBannerImageFile
                      ? "New image preview"
                      : "Current image"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.link || ""}
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
                value={editingBanner.position || "hero"}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.tag || ""}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, tag: e.target.value })
                }
                placeholder="e.g., SALE, NEW, LIMITED"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.cta || ""}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, cta: e.target.value })
                }
                placeholder="e.g., Shop Now, Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <input
                type="color"
                className="w-full p-1 border border-gray-300 rounded-md h-10"
                value={editingBanner.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    backgroundColor: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingBanner.description || ""}
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
            <Button variant="secondary" onClick={resetEditBannerForm}>
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
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600">{banner.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {banner.description}
                  </p>
                  {banner.link && (
                    <a
                      href={banner.link}
                      className="text-xs text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {banner.link}
                    </a>
                  )}
                  {banner.tag && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {banner.tag}
                    </span>
                  )}
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
                      onClick={() => handleDeleteBanner(banner)}
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
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        message={
          bannerToDelete
            ? `Are you sure you want to delete the banner "${bannerToDelete.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this banner?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default BannerManager;
