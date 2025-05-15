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
      <div
        className="mt-4 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Sign in to access your account, track orders, and explore our latest
        products
      </div>

      <div className="mt-8">
        <div
          className="bg-white rounded-lg p-6"
          style={{
            boxShadow: "var(--shadow-small)",
            borderRadius: "var(--rounded-lg)",
          }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
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
                    className="h-4 w-4 border-gray-300 rounded transition-colors duration-200"
                    style={{
                      accentColor: "var(--brand-primary)",
                    }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium hover:underline transition-colors duration-200"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="text-sm text-center p-3 rounded-md animate-fadeIn flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "var(--error-color)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
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
          </form>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div
              className="w-full border-t"
              style={{ borderColor: "var(--border-primary)" }}
            ></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className="px-4 bg-white rounded"
              style={{ color: "var(--text-secondary)" }}
            >
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            className="flex justify-center items-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.55V20.25H19.28C21.36 18.31 22.56 15.54 22.56 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12 23C14.97 23 17.46 22.02 19.28 20.25L15.72 17.55C14.73 18.2 13.48 18.58 12 18.58C9.12 18.58 6.69 16.67 5.81 14.09H2.13V16.87C3.93 20.44 7.65 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.81 14.09C5.58 13.44 5.45 12.74 5.45 12C5.45 11.26 5.58 10.56 5.81 9.91V7.13H2.13C1.51 8.6 1.14 10.26 1.14 12C1.14 13.74 1.51 15.4 2.13 16.87L5.81 14.09Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.42C13.59 5.42 15.03 5.99 16.15 7.06L19.29 3.92C17.45 2.19 14.97 1.14 12 1.14C7.65 1.14 3.93 3.7 2.13 7.13L5.81 9.91C6.69 7.34 9.12 5.42 12 5.42Z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex justify-center items-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.365 1.43C17.465 0.15 19.025 0 19.025 0C19.025 0 19.645 1.38 18.565 2.73C17.415 4.19 16.105 3.88 16.105 3.88C16.105 3.88 15.625 2.48 16.365 1.43Z" />
              <path d="M15.415 5.51C15.925 5.51 17.195 4.06 19.225 4.06C22.915 4.06 24.105 6.79 24.105 6.79C24.105 6.79 21.035 8.2 21.035 11.74C21.035 15.73 24.815 17.04 24.815 17.04C24.815 17.04 21.665 23.9 19.265 23.9C18.005 23.9 16.975 23.11 15.545 23.11C14.085 23.11 12.595 23.95 11.775 23.95C9.415 23.95 5.805 17.43 5.805 12.83C5.805 8.32 8.825 5.96 11.625 5.96C13.325 5.96 14.715 6.65 15.415 6.65V5.51Z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="text-sm text-center mt-8 pb-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium hover:underline transition-colors duration-200"
            style={{ color: "var(--brand-primary)" }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </FormWrapper>
  );
};

export default Login;
