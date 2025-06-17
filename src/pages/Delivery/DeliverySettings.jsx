import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiLock,
  FiSave,
  FiLoader,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { DeliveryLayout } from "../../components/Delivery";
import { useDeliveryPartnerStore } from "../../store/Delivery/useDeliveryPartnerStore";
import toast from "react-hot-toast";

const DeliverySettings = () => {
  const {
    partnerProfile,
    loading,
    error,
    fetchPartnerProfile,
    updatePartnerProfile,
  } = useDeliveryPartnerStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleType: "bike",
    vehicleNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch partner profile on component mount
  useEffect(() => {
    fetchPartnerProfile().catch(() => {
      // Error already handled by store
    });
  }, [fetchPartnerProfile]);

  // Update form data when partner data changes
  useEffect(() => {
    if (partnerProfile) {
      setFormData((prev) => ({
        ...prev,
        name: partnerProfile.name || "",
        email: partnerProfile.email || "",
        phone: partnerProfile.phone || "",
        address: partnerProfile.address || "",
        vehicleType: partnerProfile.vehicle_type || "bike",
        vehicleNumber: partnerProfile.vehicle_number || "",
      }));
    }
  }, [partnerProfile]);

  // Show error toast when store error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (section) => {
    const newErrors = {};

    if (section === "profile") {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.vehicleNumber.trim())
        newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (section === "password") {
      const hasPasswordFields =
        formData.currentPassword ||
        formData.newPassword ||
        formData.confirmPassword;

      if (hasPasswordFields) {
        if (!formData.currentPassword)
          newErrors.currentPassword = "Current password is required";
        if (!formData.newPassword)
          newErrors.newPassword = "New password is required";
        else if (formData.newPassword.length < 6)
          newErrors.newPassword = "Password must be at least 6 characters";
        if (!formData.confirmPassword)
          newErrors.confirmPassword = "Please confirm your new password";
        else if (formData.newPassword !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();

    if (!validateForm(section)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const updateData = {};

      if (section === "profile") {
        updateData.name = formData.name;
        updateData.phone = formData.phone;
        updateData.address = formData.address;
        updateData.vehicle_type = formData.vehicleType;
        updateData.vehicle_number = formData.vehicleNumber;
      }

      if (
        section === "password" &&
        formData.currentPassword &&
        formData.newPassword
      ) {
        updateData.current_password = formData.currentPassword;
        updateData.new_password = formData.newPassword;
      }

      const result = await updatePartnerProfile(updateData);

      toast.success(result.message || "Profile updated successfully");

      if (section === "password") {
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
      setIsEditing(false);
      setErrors({});
    } catch {
      // Error already handled by store and shown via useEffect
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setErrors({});

    if (!isEditing && partnerProfile) {
      // Reset form data when starting to edit
      setFormData((prev) => ({
        ...prev,
        name: partnerProfile.name || "",
        phone: partnerProfile.phone || "",
        address: partnerProfile.address || "",
        vehicleType: partnerProfile.vehicle_type || "bike",
        vehicleNumber: partnerProfile.vehicle_number || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } else {
      // Clear password fields when canceling edit
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  if (!partnerProfile && loading) {
    return (
      <DeliveryLayout>
        <div className="flex justify-center items-center h-64">
          <FiLoader
            className="w-8 h-8 animate-spin"
            style={{ color: "var(--brand-primary)" }}
          />
        </div>
      </DeliveryLayout>
    );
  }

  if (!partnerProfile && !loading) {
    return (
      <DeliveryLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p style={{ color: "var(--text-secondary)" }}>
              Failed to load profile data
            </p>
            <button
              onClick={() => fetchPartnerProfile()}
              className="mt-2 px-4 py-2 rounded-md"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Profile Settings
          </h1>
          <button
            onClick={toggleEditing}
            disabled={loading}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: isEditing
                ? "var(--bg-secondary)"
                : "var(--brand-primary)",
              color: isEditing ? "var(--text-primary)" : "var(--text-on-brand)",
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        <div className="space-y-8">
          {/* Profile Information */}
          <div
            className="bg-white rounded-lg shadow-md p-6"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Profile Information
            </h2>
            <form
              onSubmit={(e) => handleSubmit(e, "profile")}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      icon={<FiUser />}
                      error={errors.name}
                    />
                  ) : (
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email Address
                  </label>
                  <div>
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.email}
                    </p>
                    {isEditing && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Email cannot be changed for security reasons
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      icon={<FiPhone />}
                      error={errors.phone}
                    />
                  ) : (
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      icon={<FiMapPin />}
                      error={errors.address}
                    />
                  ) : (
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Vehicle Type
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div
                        className="absolute inset-y-0 left-0 flex items-center pl-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiTruck />
                      </div>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 rounded-md text-sm border"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border-primary)",
                        }}
                      >
                        <option value="bike">Bike/Scooter</option>
                        <option value="car">Car</option>
                        <option value="van">Van/Mini Truck</option>
                      </select>
                    </div>
                  ) : (
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.vehicle_type === "bike"
                        ? "Bike/Scooter"
                        : partnerProfile.vehicle_type === "car"
                        ? "Car"
                        : partnerProfile.vehicle_type === "van"
                        ? "Van/Mini Truck"
                        : partnerProfile.vehicle_type || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Vehicle Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="Enter vehicle registration number"
                      icon={<FiTruck />}
                      error={errors.vehicleNumber}
                    />
                  ) : (
                    <p
                      className="text-lg py-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {partnerProfile.vehicle_number || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    icon={<FiSave />}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Password Change */}
          {isEditing && (
            <div
              className="bg-white rounded-lg shadow-md p-6"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Change Password (Optional)
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Leave password fields empty if you don't want to change your
                password
              </p>
              <form
                onSubmit={(e) => handleSubmit(e, "password")}
                className="space-y-4"
              >
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  icon={<FiLock />}
                  error={errors.currentPassword}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password (min 6 characters)"
                    icon={<FiLock />}
                    error={errors.newPassword}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    icon={<FiLock />}
                    error={errors.confirmPassword}
                  />
                </div>

                <div className="mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    icon={<FiSave />}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliverySettings;
