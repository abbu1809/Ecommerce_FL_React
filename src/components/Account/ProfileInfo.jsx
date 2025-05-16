import React from "react";
import { useAuthStore } from "../../store/useAuth";

const ProfileInfo = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementation for updating profile would go here
    console.log("Profile update with:", formData);
    setIsEditing(false);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    // Reset the form data when toggling edit mode
    if (!isEditing) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
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
              ) : (
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {user?.name || "Not provided"}
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
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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
              ) : (
                <p className="text-lg" style={{ color: "var(--text-primary)" }}>
                  {user?.email || "Not provided"}
                </p>
              )}
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
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-secondary)",
                    focusRing: "var(--brand-primary)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-8 text-right">
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInfo;
