import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../components/UI/FormWrapper";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, error, clearError, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number";
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
      await signup(formData);
      navigate("/"); // Redirect to home page after successful signup
    } catch {
      // Error is handled by the store and displayed below
    }
  };

  return (
    <FormWrapper title="Create your account at Anand Mobiles">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              error={formErrors.firstName}
              placeholder="John"
              icon="user"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              error={formErrors.lastName}
              placeholder="Doe"
              icon="user"
            />
          </div>{" "}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={formErrors.email}
            placeholder="you@example.com"
            icon="email"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            error={formErrors.phone}
            placeholder="1234567890"
            icon="phone"
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
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={formErrors.confirmPassword}
            placeholder="••••••••"
            icon="lock"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}{" "}
        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          size="lg"
          fullWidth={true}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
};

export default SignUp;
