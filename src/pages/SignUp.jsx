import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWrapper from "../components/ui/FormWrapper";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/useAuth";
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { OTPVerificationStep } from "../components/auth/OTPFormComponents";
import  useOTPIntegration  from "../hooks/useOTPIntegration";

const SignUp = () => {
  const navigate = useNavigate();
  const { error, clearError, isLoading } = useAuthStore();

  // OTP Integration
  const {
    sendOTP,
    verifyOTP,
    /*resendOTP,*/
    registerWithOTP,
    otpState,
    otpError
  } = useOTPIntegration();

  // State for OTP verification step
  const [showOTPStep, setShowOTPStep] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const validateField = useCallback(() => {
    const errors = {};

    if (touched.firstName && !formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (touched.lastName && !formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (touched.email) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ) {
        errors.email = "Invalid email address";
      }
    }

    if (touched.password) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
      }
    }

    if (
      touched.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (touched.phone) {
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = "Invalid phone number";
      }
    }

    setFormErrors(errors);
  }, [formData, touched]);

  // Validate the form fields whenever formData or touched changes
  useEffect(() => {
    validateField();
  }, [formData, touched, validateField]);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e, isOTPVerified = false) => {
    // Prevent default form submission if event exists
    if (e?.preventDefault) {
      e.preventDefault();
    }
    
    // Skip form validation if OTP is already verified
    if (!isOTPVerified && !validateForm()) {
      return;
    }

    if (!showOTPStep) {
      // First step: Send OTP with both email and name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const success = await sendOTP(formData.email, fullName || formData.firstName || 'Customer');
      if (success) {
        setShowOTPStep(true);
      }
    } else {
      // Second step: Verify OTP and register
      try {
        // Check if this is a Google user
        const googleAuthData = sessionStorage.getItem('google_auth_data');
        
        if (googleAuthData) {
          // Google user flow - use stored Google auth data
          const googleData = JSON.parse(googleAuthData);
          const userData = {
            idToken: googleData.idToken,
            email: googleData.email,
            first_name: formData.firstName || googleData.displayName?.split(' ')[0] || '',
            last_name: formData.lastName || googleData.displayName?.split(' ').slice(1).join(' ') || '',
            phone_number: formData.phone || '',
            authProvider: 'google',
            otp_verified: true // Mark as OTP verified
          };
          
          // Use the googleSignup function but with OTP verification
          const { googleSignup } = useAuthStore.getState();
          const response = await googleSignup(userData);
          console.log("Google signup with OTP successful:", response);
          
          // Clean up session storage
          sessionStorage.removeItem('google_auth_data');
          navigate("/");
        } else {
          // Regular email/password signup flow
          const userData = {
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,    // Backend expects first_name
            last_name: formData.lastName,      // Backend expects last_name
            phone_number: formData.phone,      // Backend expects phone_number
          };
          
          const response = await registerWithOTP(userData);
          if (response) {
            console.log("Regular signup successful:", response);
            navigate("/"); // Redirect to home page after successful signup
          }
        }
      } catch (err) {
        console.error("Signup error:", err);
        // Error is handled by the OTP hook and displayed in UI
      }
    }
  };
  const handleGoogleSignup = async () => {
    try {
      console.log("🔥 Starting Google signup flow...");
      
      // First, get Google user data
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, provider } = await import("../firebase");
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("✅ Google authentication successful for:", user.email);
      
      // Pre-fill form data with Google info
      const googleUserData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: ''
      };
      
      setFormData(googleUserData);
      
      // If email exists, start OTP verification process
      if (user.email) {
        console.log("📧 Starting OTP verification for Google user:", user.email);
        const fullName = user.displayName || `${googleUserData.firstName} ${googleUserData.lastName}`.trim() || 'Google User';
        
        console.log("🚀 Calling sendOTP with:", { email: user.email, name: fullName });
        
        try {
          const success = await sendOTP(user.email, fullName);
          console.log("📤 OTP send result:", success);
          
          if (success) {
            console.log("✅ OTP sent successfully, showing OTP step");
            setShowOTPStep(true);
            
            // Store Google auth data for later use
            sessionStorage.setItem('google_auth_data', JSON.stringify({
              idToken: await user.getIdToken(),
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            }));
            
            console.log("💾 Stored Google auth data in session");
          } else {
            console.error("❌ Failed to send OTP");
            // Show error message to user
            clearError();
          }
        } catch (otpError) {
          console.error("💥 OTP sending error:", otpError);
          // Handle OTP error
        }
      } else {
        console.error("❌ No email found in Google user data");
      }
    } catch (err) {
      console.error("💥 Google signup error:", err);
      // Show user-friendly error message
      if (err.code === 'auth/popup-blocked') {
        alert("Please allow popups for this site and try again.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        console.log("User closed the popup");
      } else {
        alert("Google signup failed. Please try again.");
      }
    }
  };
  return (
    <FormWrapper title="Join Anand Mobiles" titleColor="var(--brand-primary)">
      <div
        className="mt-3 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {showOTPStep 
          ? "Please verify your email address to complete registration" 
          : "Create an account to enjoy a personalized shopping experience"
        }
      </div>

      {showOTPStep ? (
        <OTPVerificationStep
          email={formData.email}
          onVerify={async (otp) => {
            console.log("✅ OTP verification attempt with code:", otp);
            // Use the verifyOTP function from the hook
            const success = await verifyOTP(otp);
            if (success) {
              console.log("✅ OTP verified successfully");
              // Complete the registration process without preventDefault error
              await handleSubmit(null, true); // Pass true to indicate OTP verification is complete
            } else {
              console.log("❌ OTP verification failed");
            }
          }}
          onResend={() => {
            console.log("🔄 Resending OTP");
            const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'User';
            return sendOTP(formData.email, fullName);
          }}
          onBack={() => {
            console.log("🔙 User clicked back, returning to main form");
            setShowOTPStep(false);
            clearError();
          }}
          loading={isLoading}
          error={otpError}
          otpExpiry={otpState.expiresAt ? Math.max(0, Math.floor((otpState.expiresAt - Date.now()) / 1000)) : 0}
          canResend={otpState.canResend}
          formatTime={(seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          }}
        />
      ) : (
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {/* Background decorative elements */}
          <div
            className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10"
            style={{ backgroundColor: "var(--brand-primary)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full opacity-10"
            style={{ backgroundColor: "var(--brand-secondary)" }}
          />
          <div className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.firstName}
                placeholder="John"
                icon={<FiUser />}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.lastName}
                placeholder="Doe"
                icon={<FiUser />}
              />
            </div>
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
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={formErrors.phone}
              placeholder="1234567890"
              icon={<FiPhone />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.confirmPassword}
                placeholder="••••••••"
                icon={<FiLock />}
              />
            </div>
          </div>
          {error && (
            <div
              className="text-sm text-center p-3 rounded-md animate-fadeIn flex items-center justify-center"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "var(--error-color)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <FiAlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          <div className="pt-2 mt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              fullWidth={true}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "var(--border-primary)" }}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-3 text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            {/* Social login buttons */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex items-center justify-center py-3 px-6 border rounded-md hover:shadow-md transition-all duration-300"
              style={{
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)",
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>
          </div>
          <div
            className="text-sm text-center mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Already have an account?
            <Link
              to="/login"
              className="font-medium hover:underline transition-colors duration-200"
              style={{ color: "var(--brand-primary)" }}
            >
              Sign in
            </Link>
          </div>
          <div
            className="text-xs text-center mt-4"
            style={{ color: "var(--text-secondary)" }}
          >
            By creating an account, you agree to our
            <br />
            <Link
              to="/terms"
              className="hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Terms of Service
            </Link>
            &
            <Link
              to="/privacy"
              className="hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Privacy Policy
            </Link>
          </div>
        </form>
      )}
    </FormWrapper>
  );
};

export default SignUp;
