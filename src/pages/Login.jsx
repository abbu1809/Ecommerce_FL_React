import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../components/UI/FormWrapper";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/useAuth";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleSignup, error, clearError, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateField = useCallback(() => {
    const errors = {};

    if (touched.email) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ) {
        errors.email = "Invalid email address";
      }
    }

    if (touched.password && !formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
  }, [formData.email, formData.password, touched]);

  useEffect(() => {
    validateField();
  }, [formData, touched, validateField]);

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      console.error("Login error:", err); // Error is handled by the store and displayed below
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await googleSignup(); // Using googleSignup for both login and signup
      console.log("Google login successful:", response);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  return (
    <FormWrapper title="Welcome back" titleColor="var(--brand-primary)">
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
                onBlur={handleBlur}
                required
                error={formErrors.email}
                placeholder="you@example.com"
                icon={<FiMail />}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.password}
                placeholder="••••••••"
                icon={<FiLock />}
              />
            </div>

            {error && (
              <div
                className="text-sm text-center p-3 rounded-md animate-fadeIn flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "var(--error-color)",
                }}
              >
                <FiAlertCircle className="h-5 w-5 mr-2" />
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
        </div>{" "}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex justify-center items-center py-3 px-6 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Google
          </button>
        </div>
        <div className="text-sm text-center mt-8 pb-4">
          Don't have an account ? <br />
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
