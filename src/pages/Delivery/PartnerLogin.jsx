import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../../components/UI/FormWrapper";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { FiUser, FiLock, FiTruck } from "react-icons/fi";

// This would use an actual auth store in a real implementation
// import { useAuthStore } from "../../store/useDeliveryAuth";

const PartnerLogin = () => {
  const navigate = useNavigate();
  // Mock auth functions, replace with real ones in actual implementation
  const login = () => {
    // Mock successful login - in real app this would connect to actual auth state
    navigate("/delivery/assignments");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear general error
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login();
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Delivery Partner Login">
      {/* Form Header with icon */}
      <div className="flex justify-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-accent-light)",
            color: "var(--brand-primary)",
          }}
        >
          <FiTruck size={32} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Display API errors */}
        {error && (
          <div
            className="p-3 rounded-md animate-fadeIn bg-red-50"
            style={{ color: "var(--error-color)" }}
          >
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          icon="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
          placeholder="your@email.com"
          error={formErrors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          icon="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
          placeholder="Enter your password"
          error={formErrors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--brand-primary)",
              }}
            />
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
              Remember me
            </span>
          </label>
          <Link
            to="/delivery/forgot-password"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          isLoading={isLoading}
        >
          Log In
        </Button>

        <div className="text-center mt-4">
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            Don't have a partner account?{" "}
            <Link
              to="/delivery/register"
              className="font-medium hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </FormWrapper>
  );
};

export default PartnerLogin;
