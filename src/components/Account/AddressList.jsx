import React from "react";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const AddressList = () => {
  // Mock data for addresses
  const [addresses, setAddresses] = React.useState([
    {
      id: 1,
      name: "Home",
      address: "123 Main Street",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462001",
      phone: "9876543210",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      address: "456 Work Avenue",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462003",
      phone: "9876543211",
      isDefault: false,
    },
  ]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditAddress = (address) => {
    setFormData(address);
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAddressId) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddressId
            ? { ...formData, id: editingAddressId }
            : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now(),
      };
      setAddresses([...addresses, newAddress]);
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
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddressId(null);
                }}
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 relative ${
                address.isDefault ? "ring-2" : ""
              }`}
              style={{
                borderColor: "var(--border-primary)",
                ringColor: address.isDefault
                  ? "var(--brand-primary)"
                  : undefined,
              }}
            >
              <div className="flex justify-between mb-2">
                <h3
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {address.name}
                </h3>
                {address.isDefault && (
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
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="mt-1">Phone: {address.phone}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--error-color)" }}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
