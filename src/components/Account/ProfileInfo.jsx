import React from "react";
import { FiLoader } from "react-icons/fi";
import { useAuthStore } from "../../store/useAuth";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import ConfirmModal from "../ui/ConfirmModal";
import toast from "react-hot-toast";

const ProfileInfo = () => {
  const {
    user,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfileAPI,
    clearError,
  } = useAuthStore();

  const {
    isOpen: confirmModalIsOpen,
    modalConfig,
    isLoading: confirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = React.useState({});

  // Fetch profile data on component mount
  React.useEffect(() => {
    if (user?.uid) {
      fetchUserProfile().catch(() => {
        // Error already handled by store
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Clear errors when component unmounts
  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Basic validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation (only if any password field is filled)
    const hasPasswordFields =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (hasPasswordFields) {
      if (!formData.currentPassword) {
        errors.currentPassword =
          "Current password is required to change password";
      }
      if (!formData.newPassword) {
        errors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = "New password must be at least 6 characters long";
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "New passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const hasPasswordChange =
      formData.currentPassword &&
      formData.newPassword &&
      formData.confirmPassword;

    if (hasPasswordChange) {
      // Show confirmation modal for password change
      showConfirm({
        title: "Confirm Password Change",
        message:
          "Are you sure you want to change your password? You will need to use the new password for future logins.",
        confirmText: "Change Password",
        cancelText: "Cancel",
        type: "warning",
        onConfirm: async () => {
          await updateProfile(true);
        },
      });
    } else {
      // Update profile without password change
      await updateProfile(false);
    }
  };

  const updateProfile = async (includePassword = false) => {
    try {
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
      };

      if (includePassword) {
        profileData.current_password = formData.currentPassword;
        profileData.new_password = formData.newPassword;
        profileData.confirm_new_password = formData.confirmPassword;
      }

      const result = await updateUserProfileAPI(profileData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully");
        setIsEditing(false);

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setFormErrors({});
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setFormErrors({});

    // Reset the form data when toggling edit mode
    if (!isEditing) {
      setFormData({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
          Profile Information
        </h2>
        <button
          onClick={toggleEditing}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                First Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: formErrors.firstName
                        ? "var(--error-color)"
                        : "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    required
                  />
                  {formErrors.firstName && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {user?.first_name || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Last Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: formErrors.lastName
                        ? "var(--error-color)"
                        : "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    required
                  />
                  {formErrors.lastName && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {user?.last_name || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                />
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                />
              ) : (
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {user?.phone || "Not provided"}
                </p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="space-y-4">
              <div className="mb-4">
                <h4
                  className="text-md font-medium mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Change Password (Optional)
                </h4>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Leave password fields empty if you don't want to change your
                  password
                </p>
              </div>

              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Current Password
                </label>
                <div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: formErrors.currentPassword
                        ? "var(--error-color)"
                        : "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    placeholder="Enter current password"
                  />
                  {formErrors.currentPassword && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {formErrors.currentPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  New Password
                </label>
                <div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: formErrors.newPassword
                        ? "var(--error-color)"
                        : "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    placeholder="Enter new password (min 6 characters)"
                  />
                  {formErrors.newPassword && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {formErrors.newPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Confirm New Password
                </label>
                <div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: formErrors.confirmPassword
                        ? "var(--error-color)"
                        : "var(--border-primary)",
                      color: "var(--text-primary)",
                      backgroundColor: "var(--bg-secondary)",
                      focusRing: "var(--brand-primary)",
                    }}
                    placeholder="Confirm new password"
                  />
                  {formErrors.confirmPassword && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleEditing}
              disabled={isLoading}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
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

export default ProfileInfo;
