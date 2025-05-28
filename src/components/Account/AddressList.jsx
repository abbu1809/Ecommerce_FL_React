import React from "react";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiLoader } from "react-icons/fi";
import useAddressStore from "../../store/useAddress";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import ConfirmModal from "../UI/ConfirmModal";

const AddressList = () => {
  const {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError,
  } = useAddressStore();

  const {
    isOpen: confirmModalIsOpen,
    modalConfig,
    isLoading: confirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  // Fetch addresses on component mount
  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Clear errors when component unmounts
  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleEditAddress = (address) => {
    setFormData({
      name: address.name || address.type,
      address: address.address || address.street_address,
      city: address.city,
      state: address.state,
      pincode: address.pincode || address.postal_code,
      phone: address.phone || address.phone_number,
      isDefault: address.isDefault || address.is_default,
    });
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
  };
  const handleDeleteAddress = async (id) => {
    showConfirm({
      title: "Delete Address",
      message:
        "Are you sure you want to delete this address? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        await deleteAddress(id);
      },
    });
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Transform form data to match API format
      const apiData = {
        type: formData.name,
        street_address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.pincode,
        phone_number: formData.phone,
        is_default: formData.isDefault,
      };

      if (editingAddressId) {
        // Update existing address
        await updateAddress(editingAddressId, apiData);
      } else {
        // Add new address
        await addAddress(apiData);
      }

      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        isDefault: false,
      });
      setIsAddingAddress(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          My Addresses
        </h2>

        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            {isLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiPlus className="w-4 h-4" />
            )}
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading && !isAddingAddress && (
        <div className="flex justify-center items-center py-8">
          <FiLoader
            className="w-6 h-6 animate-spin"
            style={{ color: "var(--brand-primary)" }}
          />
          <span className="ml-2" style={{ color: "var(--text-secondary)" }}>
            Loading addresses...
          </span>
        </div>
      )}

      {isAddingAddress ? (
        <div
          className="border rounded-lg p-4 mb-6"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Address Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Home, Office, etc."
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Contact number for delivery"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Street Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Flat, House no., Building, Company, Apartment"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Set as default address
                  </span>
                </label>
              </div>
            </div>{" "}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddressId(null);
                  setFormData({
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    pincode: "",
                    phone: "",
                    isDefault: false,
                  });
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {addresses.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <FiMapPin
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                style={{ color: "var(--text-secondary)" }}
              />
              <p
                className="text-lg font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No addresses found
              </p>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Add your first address to get started with deliveries
              </p>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 relative ${
                    address.isDefault || address.is_default ? "ring-2" : ""
                  }`}
                  style={{
                    borderColor: "var(--border-primary)",
                    ringColor:
                      address.isDefault || address.is_default
                        ? "var(--brand-primary)"
                        : undefined,
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <h3
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {address.name || address.type}
                    </h3>
                    {(address.isDefault || address.is_default) && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--bg-accent-light)",
                          color: "var(--brand-primary)",
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2 items-start">
                    <FiMapPin
                      className="min-w-5 h-5 mt-0.5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <div style={{ color: "var(--text-primary)" }}>
                      <p>{address.address || address.street_address}</p>
                      <p>
                        {address.city}, {address.state} -{" "}
                        {address.pincode || address.postal_code}
                      </p>
                      <p className="mt-1">
                        Phone: {address.phone || address.phone_number}
                      </p>
                    </div>
                  </div>{" "}
                  <div className="flex justify-between items-center mt-4">
                    {!(address.isDefault || address.is_default) && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={isLoading}
                        className="text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50"
                        style={{
                          borderColor: "var(--brand-primary)",
                          color: "var(--brand-primary)",
                        }}
                      >
                        Set as Default
                      </button>
                    )}

                    <div
                      className={`flex gap-2 ${
                        !(address.isDefault || address.is_default)
                          ? "ml-auto"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => handleEditAddress(address)}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        style={{ color: "var(--error-color)" }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}{" "}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        type={modalConfig.type}
        isLoading={confirmLoading}
      />
    </div>
  );
};

export default AddressList;
