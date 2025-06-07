import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../../components/ui/FormWrapper";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdminAuthStore } from "../../store/Admin/useAdminAuth"; // Updated to use admin-specific auth store

const AdminRegister = () => {
  const navigate = useNavigate();
  // Use admin registration function from the admin auth store
  const { adminRegister, error, clearError, isLoading } = useAdminAuthStore();
  const [formData, setFormData] = useState({
    username: "", // Changed from email to username as per useAdminAuth.js
    password: "",
    secretKey: "", // Secret key for admin registration
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.secretKey.trim()) {
      errors.secretKey = "Secret Key is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      // Call adminRegister with the form data
      await adminRegister({
        username: formData.username,
        password: formData.password,
        secretKey: formData.secretKey,
      });

      navigate("/admin/login"); // Redirect to admin login page after successful registration
    } catch (err) {
      // Error is handled by the store or displayed
      console.error("Admin registration failed:", err);
    }
  };

  return (
    <FormWrapper title="Create Admin Account">
      <div className="mt-4 text-center text-sm text-gray-500">
        Register to gain administrative access.
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md space-y-5">
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={formErrors.username}
            placeholder="admin"
            icon="user"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={formErrors.password}
            placeholder="••••••••"
            icon="lock"
          />
          <Input
            label="Secret Key"
            type="password" // Mask secret key input
            name="secretKey"
            value={formData.secretKey}
            onChange={handleChange}
            required
            error={formErrors.secretKey}
            placeholder="Enter your secret key"
            icon="key" // Assuming you have a key icon
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}
        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            size="lg"
            fullWidth={true}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
        <div className="text-sm text-center mt-4">
          Already have an admin account?{" "}
          <Link
            to="/admin/login"
            className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200"
          >
            Sign in
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
};

export default AdminRegister;
