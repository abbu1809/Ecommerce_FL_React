import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../../components/ui/FormWrapper";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdminAuthStore } from "../../store/Admin/useAdminAuth";

// OTP Integration
import useOTPIntegration from "../../hooks/useOTPIntegration";
import { OTPVerificationStep } from "../../components/auth/OTPFormComponents";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { adminRegister, error, clearError, isLoading } = useAdminAuthStore();
  
  // OTP Integration
  const {
    otpState,
    sendOTP,
    verifyOTP,
    resendOTP,
    otpError
  } = useOTPIntegration('admin');

  const [formData, setFormData] = useState({
    username: "",
    email: "", // Added email field for OTP
    password: "",
    secretKey: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showOTPStep, setShowOTPStep] = useState(false);

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
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
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

    if (!showOTPStep) {
      // First step: Send OTP
      const success = await sendOTP(formData.email, formData.username);
      if (success) {
        setShowOTPStep(true);
      }
    } else {
      // Second step: Verify OTP and register
      try {
        // Verify OTP first
        const otpVerified = await verifyOTP(formData.email, ''); // OTP will be handled by the component
        if (otpVerified) {
          // Proceed with admin registration
          await adminRegister({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            secretKey: formData.secretKey,
          });
          navigate("/admin/login");
        }
      } catch (err) {
        console.error("Admin registration failed:", err);
      }
    }
  };

  return (
    <FormWrapper title="Create Admin Account">
      <div className="mt-4 text-center text-sm text-gray-500">
        Register to gain administrative access.
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* OTP Verification Step */}
        {showOTPStep && (
          <div className="mt-6">
            <OTPVerificationStep
              email={formData.email}
              onVerify={verifyOTP}
              onResend={() => resendOTP(formData.email)}
              isVerifying={otpState.loading}
              error={otpError}
              success={otpState.otpVerified}
              timeLeft={otpState.otpExpiry}
              canResend={otpState.canResend}
              onBack={() => setShowOTPStep(false)}
            />
          </div>
        )}

        {!showOTPStep && (
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
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={formErrors.email}
              placeholder="admin@anandmobiles.com"
              icon="mail"
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
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
              error={formErrors.secretKey}
              placeholder="Enter your secret key"
              icon="key"
            />
          </div>
        )}
        
        {(error || otpError) && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
            {error || otpError}
          </div>
        )}
        
        {!showOTPStep && (
          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              fullWidth={true}
            >
              {isLoading ? "Sending OTP..." : "Send Verification Code"}
            </Button>
          </div>
        )}
        <div className="text-sm text-center mt-4">
          Already have an admin account?
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
