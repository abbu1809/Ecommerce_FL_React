import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormWrapper from "../../components/ui/FormWrapper";
import { useDeliveryPartnerStore } from "../../store/Delivery/useDeliveryPartnerStore";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { registerPartner, loading, error } = useDeliveryPartnerStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create registration data matching backend requirements
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    try {
      await registerPartner(registrationData);

      // If successful, navigate to login with a success message
      navigate("/delivery/login", {
        state: {
          message:
            "Registration successful! Please wait for admin verification.",
        },
      });
    } catch (error) {
      // Error is already handled by the store
      console.error("Registration error:", error);
    }
  };

  return (
    <FormWrapper title="Become a Delivery Partner">
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
        Register as a delivery partner and start earning with flexible hours
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Full Name"
          type="text"
          name="name"
          icon={<FiUser />}
          value={formData.name}
          onChange={handleChange}
          required={true}
          placeholder="Enter your full name"
          error={formErrors.name}
        />

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
          label="Phone Number"
          type="tel"
          name="phone"
          icon={<FiPhone />}
          value={formData.phone}
          onChange={handleChange}
          required={true}
          placeholder="Your phone number"
          error={formErrors.phone}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          icon={<FiLock />}
          value={formData.password}
          onChange={handleChange}
          required={true}
          placeholder="Create a strong password"
          error={formErrors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          icon={<FiLock />}
          value={formData.confirmPassword}
          onChange={handleChange}
          required={true}
          placeholder="Confirm your password"
          error={formErrors.confirmPassword}
        />

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth={true}
            isLoading={loading}
          >
            {loading ? "Creating Account..." : "Register as Partner"}
          </Button>
        </div>

        <div className="text-center mt-6">
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            Already have an account?{" "}
            <Link
              to="/delivery/login"
              className="font-medium hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Log in here
            </Link>
          </p>
        </div>

        <div
          className="text-xs text-center mt-4 px-4"
          style={{ color: "var(--text-secondary)" }}
        >
          By registering, you agree to our Terms of Service and acknowledge that
          your account requires admin verification before you can start
          accepting deliveries.
        </div>
      </form>
    </FormWrapper>
  );
};

export default PartnerRegister;
