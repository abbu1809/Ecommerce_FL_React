import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiLock,
  FiSave,
} from "react-icons/fi";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import FormWrapper from "../../components/UI/FormWrapper";
import { DeliveryLayout } from "../../components/Delivery";

const DeliverySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Delivery St, City",
    vehicleType: "bike",
    vehicleNumber: "DL-5S-AB-1234",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifyAssignments: true,
    notifyStatus: true,
    notifyReviews: true,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.vehicleNumber)
        newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (section === "password") {
      if (!formData.currentPassword)
        newErrors.currentPassword = "Current password is required";
      if (formData.newPassword && formData.newPassword.length < 6)
        newErrors.newPassword = "Password must be at least 6 characters";
      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();

    if (!validateForm(section)) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaved(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      setErrors({
        form: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeliveryLayout>
      <div className="w-full">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h1>

        {isSaved && (
          <div
            className="mb-4 p-3 rounded-md"
            style={{
              backgroundColor: "var(--success-color)20",
              color: "var(--success-color)",
            }}
          >
            Changes saved successfully!
          </div>
        )}

        {errors.form && (
          <div
            className="mb-4 p-3 rounded-md"
            style={{
              backgroundColor: "var(--error-color)20",
              color: "var(--error-color)",
            }}
          >
            {errors.form}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <FormWrapper>
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
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon={<FiUser />}
                  error={errors.fullName}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={<FiMail />}
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  icon={<FiPhone />}
                  error={errors.phone}
                />

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  icon={<FiMapPin />}
                  error={errors.address}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Vehicle Type
                  </label>
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
                </div>

                <Input
                  label="Vehicle Number"
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Enter vehicle registration number"
                  icon={<FiTruck />}
                  error={errors.vehicleNumber}
                />
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  icon={<FiSave />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </FormWrapper>

          {/* Password Change */}
          <FormWrapper>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h2>
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
                  placeholder="Enter new password"
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
                  isLoading={isLoading}
                  icon={<FiSave />}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </FormWrapper>

          {/* Notification Settings */}
          <FormWrapper>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Notification Preferences
            </h2>
            <form
              onSubmit={(e) => handleSubmit(e, "notifications")}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyAssignments"
                    name="notifyAssignments"
                    checked={formData.notifyAssignments}
                    onChange={handleChange}
                    className="mr-3 h-4 w-4"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <label
                    htmlFor="notifyAssignments"
                    style={{ color: "var(--text-primary)" }}
                  >
                    New delivery assignments
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyStatus"
                    name="notifyStatus"
                    checked={formData.notifyStatus}
                    onChange={handleChange}
                    className="mr-3 h-4 w-4"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <label
                    htmlFor="notifyStatus"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Delivery status updates
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyReviews"
                    name="notifyReviews"
                    checked={formData.notifyReviews}
                    onChange={handleChange}
                    className="mr-3 h-4 w-4"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <label
                    htmlFor="notifyReviews"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Customer reviews and ratings
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  icon={<FiSave />}
                >
                  Save Preferences
                </Button>
              </div>
            </form>
          </FormWrapper>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliverySettings;
