import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FormWrapper from "../../components/ui/FormWrapper";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { FiTruck, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useDeliveryPartnerStore } from "../../store/Delivery/useDeliveryPartnerStore";
import toast from "react-hot-toast";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginPartner, isAuthenticated, partner, loading, error } =
    useDeliveryPartnerStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [registrationMessage, setRegistrationMessage] = useState("");

  // Check if there's a registration success message passed via navigation
  useEffect(() => {
    if (location.state?.message) {
      setRegistrationMessage(location.state.message);
    }
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && partner) {
      navigate("/delivery/dashboard");
    }
  }, [isAuthenticated, partner, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

    try {
      const response = await loginPartner(formData);

      // If successful, the store will update the auth state and redirect will happen via useEffect
      if (response) {
        navigate("/delivery/dashboard");
      }
    } catch (err) {
      // Error handling is managed by the store
      toast.error(
        err.response?.data?.error || "Failed to login. Please try again."
      );
      if (err.response?.status === 403) {
        // Special handling for unverified accounts
        navigate("/delivery/admin-verify");
      }
    }
  };

  return (
    <FormWrapper title="Delivery Partner Login">
      {/* Form Header with icon */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-accent-light)",
            color: "var(--brand-primary)",
          }}
        >
          <FiTruck size={36} />
        </div>
      </div>

      <p
        className="text-center text-sm mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Sign in to your delivery partner account to manage deliveries
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Display registration success message */}
        {registrationMessage && (
          <div
            className="p-4 rounded-md animate-fadeIn flex items-center"
            style={{
              backgroundColor: "var(--success-color)20",
              color: "var(--success-color)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {registrationMessage}
          </div>
        )}

        {/* Display API errors */}
        {error && (
          <div
            className="p-4 rounded-md animate-fadeIn flex items-center"
            style={{
              backgroundColor: "var(--error-color)15",
              color: "var(--error-color)",
            }}
          >
            <FiAlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          icon={<FiMail />}
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
          icon={<FiLock />}
          value={formData.password}
          onChange={handleChange}
          required={true}
          placeholder="Enter your password"
          error={formErrors.password}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          isLoading={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center mt-6">
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            Don't have a partner account?
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
