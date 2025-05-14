import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../components/UI/FormWrapper";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
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

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
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
      await login({
        ...formData,
        rememberMe,
      });
      navigate("/"); // Redirect to home page after successful login
    } catch {
      // Error is handled by the store and displayed below
    }
  };
  return (
    <FormWrapper title="Welcome back">
      <div className="mt-4 text-center text-sm text-gray-500">
        Sign in to access your account, track orders, and explore our latest
        products
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md space-y-5">
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
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>
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
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200"
          >
            Create an account
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
};

export default Login;
