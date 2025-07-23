import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUnifiedAuthStoreImproved } from '../store/unifiedAuthStoreImproved';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../firebase';
import FormWrapper from '../components/ui/FormWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

/**
 * 🔐 Unified Login Component - Old Design Style
 * Matches the original authentication interface while maintaining RBAC functionality
 * FIXED: CSRF endpoint, Google Auth, import paths
 */
const UnifiedLoginImproved = () => {
  const navigate = useNavigate();
  const { login: loginUser, error, clearError, isLoading } = useUnifiedAuthStoreImproved();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Get CSRF token for API calls - FIXED endpoint
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get CSRF token from backend
    const getCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/csrf-token/', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.log('CSRF token fetch failed:', error);
      }
    };
    
    getCsrfToken();
  }, []);

  const validateField = React.useCallback(() => {
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
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        csrfToken: csrfToken
      });

      if (response.success) {
        // Smart redirect based on user type from response
        const dashboardUrl = response.data.dashboard_url || '/dashboard';
        
        // Show success message (using theme-aware styling)
        const userTypeDisplay = response.data.user.user_type_display || response.data.user.user_type;
        console.log(`Welcome back, ${response.data.user.first_name}! (${userTypeDisplay})`);
        
        navigate(dashboardUrl);
      } else {
        // Error will be handled by the store
        console.error('Login failed:', response.error);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      clearError();
      
      // Sign in with Google popup using Firebase
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send to backend for authentication
      const googleLoginData = {
        idToken: idToken
      };

      const response = await loginUser(googleLoginData);
      console.log("Google login successful:", response);
      
      if (response.success) {
        const dashboardUrl = response.data.dashboard_url || '/dashboard';
        navigate(dashboardUrl);
      }
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
        Sign in to access your account, track orders, and explore our latest products
      </div>

      <div className="mt-8">
        <div
          className="bg-white rounded-lg p-6"
          style={{
            boxShadow: "var(--shadow-small)",
            borderRadius: "var(--rounded-lg)",
            backgroundColor: "var(--bg-primary)",
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

        {/* Google OAuth Section - Same as old design */}
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
              style={{ 
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-primary)" 
              }}
            >
              or continue with
            </span>
          </div>
        </div>

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

        {/* Unified Registration Link */}
        <div className="text-sm text-center mt-8 pb-4">
          Don't have an account? <br />
          <Link
            to="/unified-signup"
            className="font-medium hover:underline transition-colors duration-200"
            style={{ color: "var(--brand-primary)" }}
          >
            Create an account
          </Link>
        </div>

        {/* Account Types Info - Subtle */}
        <div className="mt-6 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
          <p>
            🔐 Supports: Customers • Vendors • Delivery Partners • Admins • Managers
          </p>
        </div>
      </div>
    </FormWrapper>
  );
};

export default UnifiedLoginImproved;
