import { useState } from "react";
import Button from "../../ui/Button";

// Mock promotional data
const mockPromotions = [
  {
    id: 1,
    name: "Summer Clearance",
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minPurchase: 100,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    active: true,
    usageLimit: 1000,
    usageCount: 342,
    applicableProducts: "all",
    excludedProducts: [],
  },
  {
    id: 2,
    name: "New User Discount",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minPurchase: 0,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    active: true,
    usageLimit: 1,
    usageCount: 2103,
    applicableProducts: "all",
    excludedProducts: [],
  },
  {
    id: 3,
    name: "Free Shipping",
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    minPurchase: 50,
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    active: true,
    usageLimit: 500,
    usageCount: 118,
    applicableProducts: "all",
    excludedProducts: [],
  },
  {
    id: 4,
    name: "Flash Sale",
    code: "FLASH50",
    type: "percentage",
    value: 50,
    minPurchase: 200,
    startDate: "2023-05-20",
    endDate: "2023-05-22",
    active: false,
    usageLimit: 200,
    usageCount: 183,
    applicableProducts: "selected",
    excludedProducts: [],
  },
  {
    id: 5,
    name: "Gift Card Promo",
    code: "GIFT20",
    type: "fixed",
    value: 20,
    minPurchase: 100,
    startDate: "2023-04-15",
    endDate: "2023-07-15",
    active: true,
    usageLimit: 0,
    usageCount: 45,
    applicableProducts: "all",
    excludedProducts: [1, 2, 3],
  },
];

const PromotionManager = () => {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: 10,
    minPurchase: 0,
    startDate: "",
    endDate: "",
    active: true,
    usageLimit: 0,
    usageCount: 0,
    applicableProducts: "all",
    excludedProducts: [],
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleActive = (id) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, active: !promo.active } : promo
      )
    );
  };

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === editingPromotion.id ? editingPromotion : promo
      )
    );
    setEditingPromotion(null);
  };

  const handleAddPromotion = () => {
    const newId = Math.max(...promotions.map((p) => p.id)) + 1;
    setPromotions([...promotions, { ...newPromotion, id: newId }]);
    setNewPromotion({
      name: "",
      code: "",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      startDate: "",
      endDate: "",
      active: true,
      usageLimit: 0,
      usageCount: 0,
      applicableProducts: "all",
      excludedProducts: [],
    });
    setShowAddForm(false);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  // Generate a random discount code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Helper function to format discount value display
  const formatDiscountValue = (promotion) => {
    if (promotion.type === "percentage") {
      return `${promotion.value}%`;
    } else if (promotion.type === "fixed") {
      return `$${promotion.value.toFixed(2)}`;
    } else if (promotion.type === "shipping") {
      return "Free Shipping";
    }
    return promotion.value;
  };

  // Check if a promotion is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  // Discount type options
  const discountTypeOptions = [
    { value: "percentage", label: "Percentage Discount" },
    { value: "fixed", label: "Fixed Amount Discount" },
    { value: "shipping", label: "Free Shipping" },
    { value: "bogo", label: "Buy One Get One Free" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Promotions & Discount Codes
        </h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingPromotion(null);
          }}
        >
          {showAddForm ? "Cancel" : "Add New Promotion"}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Add New Promotion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.name}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, name: e.target.value })
                }
                placeholder="e.g. Summer Sale"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-l-md"
                  value={newPromotion.code}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. SUMMER25"
                />
                <button
                  className="bg-gray-200 text-gray-700 px-3 rounded-r-md text-sm border border-l-0 border-gray-300"
                  onClick={() =>
                    setNewPromotion({ ...newPromotion, code: generateCode() })
                  }
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.type}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, type: e.target.value })
                }
              >
                {discountTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newPromotion.type === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount ($)"}
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.value}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    value: Number(e.target.value),
                  })
                }
                disabled={
                  newPromotion.type === "shipping" ||
                  newPromotion.type === "bogo"
                }
                min="0"
                max={newPromotion.type === "percentage" ? "100" : "1000"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase ($)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.minPurchase}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    minPurchase: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit (0 = unlimited)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.usageLimit}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    usageLimit: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.startDate}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.endDate}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, endDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products Applicable
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPromotion.applicableProducts}
                onChange={(e) =>
                  setNewPromotion({
                    ...newPromotion,
                    applicableProducts: e.target.value,
                  })
                }
              >
                <option value="all">All Products</option>
                <option value="selected">Selected Products</option>
                <option value="categories">Selected Categories</option>
              </select>
            </div>
            <div>
              <label className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={newPromotion.active}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleAddPromotion}>
              Add Promotion
            </Button>
          </div>
        </div>
      )}

      {editingPromotion && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Edit Promotion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.name}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-l-md"
                  value={editingPromotion.code}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
                <button
                  className="bg-gray-200 text-gray-700 px-3 rounded-r-md text-sm border border-l-0 border-gray-300"
                  onClick={() =>
                    setEditingPromotion({
                      ...editingPromotion,
                      code: generateCode(),
                    })
                  }
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.type}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    type: e.target.value,
                  })
                }
              >
                {discountTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingPromotion.type === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount ($)"}
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.value}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    value: Number(e.target.value),
                  })
                }
                disabled={
                  editingPromotion.type === "shipping" ||
                  editingPromotion.type === "bogo"
                }
                min="0"
                max={editingPromotion.type === "percentage" ? "100" : "1000"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase ($)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.minPurchase}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    minPurchase: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit (0 = unlimited)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.usageLimit}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    usageLimit: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.startDate}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.endDate}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    endDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products Applicable
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPromotion.applicableProducts}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    applicableProducts: e.target.value,
                  })
                }
              >
                <option value="all">All Products</option>
                <option value="selected">Selected Products</option>
                <option value="categories">Selected Categories</option>
              </select>
            </div>
            <div>
              <label className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={editingPromotion.active}
                  onChange={(e) =>
                    setEditingPromotion({
                      ...editingPromotion,
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
            <Button
              variant="secondary"
              onClick={() => setEditingPromotion(null)}
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
              <th className="py-3 px-4 text-left">Promotion</th>
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Validity</th>
              <th className="py-3 px-4 text-center">Usage</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <tr key={promotion.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium">{promotion.name}</p>
                  <p className="text-xs text-gray-500">
                    {promotion.minPurchase > 0 &&
                      `Min. purchase: $${promotion.minPurchase}`}
                    {promotion.minPurchase === 0 && "No min. purchase"}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {promotion.code}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium">
                    {formatDiscountValue(promotion)}
                  </span>
                  <p className="text-xs text-gray-500">
                    {
                      discountTypeOptions.find(
                        (t) => t.value === promotion.type
                      )?.label
                    }
                  </p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm">
                    {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </p>
                  {isExpired(promotion.endDate) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Expired
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm">
                    {promotion.usageCount}/
                    {promotion.usageLimit > 0 ? promotion.usageLimit : "∞"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      promotion.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {promotion.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditPromotion(promotion)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={promotion.active ? "danger" : "primary"}
                      size="sm"
                      onClick={() => handleToggleActive(promotion.id)}
                    >
                      {promotion.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePromotion(promotion.id)}
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

      {promotions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No promotions found. Add your first promotion!</p>
        </div>
      )}
    </div>
  );
};

export default PromotionManager;
