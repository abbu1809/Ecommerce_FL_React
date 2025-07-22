import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUnifiedAuthStoreImproved } from '../store/unifiedAuthStoreImproved';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import FormWrapper from '../components/ui/FormWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { 
  FiUser, FiMail, FiPhone, FiLock, FiAlertCircle, 
  FiShoppingBag, FiTruck, FiSettings, FiBarChart2, FiKey, FiShield 
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

/**
 * 🎯 Unified Registration Component - HackerRank Style Role Selection
 * Matches old design interface while implementing RBAC role selection
 * FIXED: Google OAuth infinite loop, CSRF endpoint, import paths, duplicate functions
 */
const UnifiedRegistrationImproved = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, isLoading } = useUnifiedAuthStoreImproved();
  
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Registration Form
  const [selectedRole, setSelectedRole] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Role-specific fields
    business_name: '',
    business_license: '',
    gst_number: '',
    business_address: '',
    department: '',
    role: '',
    vehicle_type: '',
    license_number: '',
    secret_key: '' // For admin registration
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Get CSRF token - FIXED endpoint
  useEffect(() => {
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

  // HackerRank-style role options
  const roleOptions = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shop and explore products',
      description: 'Browse our extensive collection, track orders, and enjoy personalized shopping experience',
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      features: ['Product browsing', 'Order tracking', 'Wishlist', 'Reviews & ratings']
    },
    {
      id: 'vendor',
      title: 'Vendor', 
      subtitle: 'Sell your products',
      description: 'List and manage your products, handle orders, and grow your business with us',
      icon: FiShoppingBag,
      color: 'bg-green-500',
      features: ['Product management', 'Inventory control', 'Sales analytics', 'Order fulfillment']
    },
    {
      id: 'delivery_partner',
      title: 'Delivery Partner',
      subtitle: 'Deliver products to customers',
      description: 'Join our delivery network and earn by delivering products in your area',
      icon: FiTruck,
      color: 'bg-yellow-500',
      features: ['Delivery tracking', 'Route optimization', 'Earnings dashboard', 'Performance metrics']
    },
    {
      id: 'manager',
      title: 'Manager',
      subtitle: 'Oversee operations',
      description: 'Manage teams, monitor performance, and ensure smooth business operations',
      icon: FiBarChart2,
      color: 'bg-purple-500',
      features: ['Team management', 'Performance analytics', 'Report generation', 'Process optimization']
    },
    {
      id: 'admin',
      title: 'Administrator',
      subtitle: 'Manage the platform',
      description: 'Full system access to manage users, configure settings, and maintain the platform',
      icon: FiShield,
      color: 'bg-red-500',
      features: ['User management', 'System configuration', 'Security settings', 'Platform maintenance']
    }
  ];

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) {
      clearError();
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (fieldName) => {
    const errors = {};
    
    if (touched[fieldName]) {
      switch (fieldName) {
        case 'firstName':
          if (!formData.firstName.trim()) errors.firstName = "First name is required";
          break;
        case 'lastName':
          if (!formData.lastName.trim()) errors.lastName = "Last name is required";
          break;
        case 'email':
          if (!formData.email.trim()) {
            errors.email = "Email is required";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = "Invalid email address";
          }
          break;
        case 'phone':
          if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
          } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Invalid phone number (10 digits required)";
          }
          break;
        case 'password':
          if (!formData.password) {
            errors.password = "Password is required";
          } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
          }
          break;
        case 'confirmPassword':
          if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
          }
          break;
        case 'secret_key':
          if (selectedRole === 'admin' && !formData.secret_key) {
            errors.secret_key = "Secret key is required for admin registration";
          }
          break;
      }
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
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
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
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

    // Role-specific validation
    if (selectedRole === 'vendor') {
      if (!formData.business_name.trim()) {
        errors.business_name = "Business name is required";
      }
    }

    if (selectedRole === 'delivery_partner') {
      if (!formData.vehicle_type.trim()) {
        errors.vehicle_type = "Vehicle type is required";
      }
      if (!formData.license_number.trim()) {
        errors.license_number = "License number is required";
      }
    }

    if (selectedRole === 'admin') {
      if (!formData.secret_key.trim()) {
        errors.secret_key = "Admin secret key is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare registration data with correct structure
      const registrationData = {
        user_type: selectedRole,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        profile_data: {}
      };

      // Add role-specific data
      if (selectedRole === 'vendor') {
        registrationData.profile_data = {
          business_name: formData.business_name,
          business_license: formData.business_license,
          gst_number: formData.gst_number,
          business_address: formData.business_address
        };
      } else if (selectedRole === 'delivery_partner') {
        registrationData.profile_data = {
          vehicle_type: formData.vehicle_type,
          license_number: formData.license_number
        };
      } else if (selectedRole === 'admin') {
        registrationData.profile_data = {
          department: formData.department,
          role: formData.role,
          secret_key: formData.secret_key
        };
      }
      
      const response = await registerUser(registrationData);
      
      if (response.success) {
        // Smart redirect based on response
        const dashboardUrl = response.data?.dashboard_url;
        if (response.data?.requires_verification) {
          navigate('/verification-pending', { 
            state: { 
              userType: response.data.user.user_type,
              email: response.data.user.email 
            }
          });
        } else if (dashboardUrl) {
          navigate(dashboardUrl);
        } else {
          // Fallback routing
          const dashboardRoutes = {
            'customer': '/dashboard',
            'admin': '/admin/dashboard',
            'delivery_partner': '/delivery/dashboard',
            'vendor': '/vendor/dashboard',
            'manager': '/manager/dashboard'
          };
          navigate(dashboardRoutes[selectedRole] || '/dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  // FIXED: Google Auth with proper Firebase implementation (no infinite loop)
  const handleGoogleSignup = async () => {
    try {
      clearError();
      
      // Sign in with Google popup using Firebase
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Extract user information from Google account
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Send to backend - Google OAuth with role selection and user data
      const googleUserData = {
        user_type: selectedRole,
        idToken: idToken,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        phone: user.phoneNumber || '', // May be empty for Google OAuth
        profile_data: {}
      };

      // Add role-specific data if needed
      if (selectedRole === 'vendor') {
        googleUserData.profile_data = {
          business_name: formData.business_name || '',
          business_license: formData.business_license || '',
          gst_number: formData.gst_number || '',
          business_address: formData.business_address || ''
        };
      } else if (selectedRole === 'delivery_partner') {
        googleUserData.profile_data = {
          vehicle_type: formData.vehicle_type || '',
          license_number: formData.license_number || ''
        };
      } else if (selectedRole === 'admin') {
        googleUserData.profile_data = {
          department: formData.department || '',
          role: formData.role || '',
          secret_key: formData.secret_key || ''
        };
      }

      const response = await registerUser(googleUserData);
      console.log("Google signup successful:", response);
      
      if (response.success) {
        // IMPORTANT: Wait a moment for authentication state to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Smart redirect based on response - but ensure user is authenticated first
        const dashboardUrl = response.data?.dashboard_url;
        
        console.log("Navigation data:", {
          requires_verification: response.data?.requires_verification,
          dashboard_url: dashboardUrl,
          user_type: response.data?.user?.user_type
        });
        
        if (response.data?.requires_verification) {
          navigate('/verification-pending', { 
            state: { 
              userType: response.data.user.user_type,
              email: response.data.user.email 
            }
          });
        } else if (dashboardUrl) {
          console.log("Navigating to dashboard URL:", dashboardUrl);
          navigate(dashboardUrl);
        } else {
          // Fallback routing
          const dashboardRoutes = {
            'customer': '/dashboard',
            'admin': '/admin/dashboard',
            'delivery_partner': '/delivery/dashboard',
            'vendor': '/vendor/dashboard',
            'manager': '/manager/dashboard'
          };
          const fallbackRoute = dashboardRoutes[selectedRole] || '/dashboard';
          console.log("Navigating to fallback route:", fallbackRoute);
          navigate(fallbackRoute);
        }
      } else {
        console.error("Registration failed:", response.error);
      }
    } catch (err) {
      console.error("Google signup error:", err);
    }
  };

  // Step 1: Role Selection (HackerRank style)
  if (step === 1) {
    return (
      <FormWrapper 
        title="Choose Your Role" 
        titleColor="var(--brand-primary)"
      >
        <div className="mt-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          What describes you best? Select your role to continue with registration
        </div>

        <div className="mt-8 space-y-4">
          {roleOptions.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="relative cursor-pointer group"
              >
                <div
                  className="p-6 rounded-xl border-2 border-transparent transition-all duration-300 hover:border-primary hover:shadow-lg transform hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: selectedRole === role.id ? "2px solid var(--brand-primary)" : "2px solid var(--border-primary)",
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${role.color} bg-opacity-10 flex-shrink-0`}
                      style={{ backgroundColor: `var(--brand-primary)20` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: "var(--brand-primary)" }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                        {role.title}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {role.subtitle}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {role.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: selectedRole === role.id ? "var(--brand-primary)" : "var(--border-primary)",
                          backgroundColor: selectedRole === role.id ? "var(--brand-primary)" : "transparent",
                        }}
                      >
                        {selectedRole === role.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: "var(--brand-primary)10",
                          color: "var(--brand-primary)",
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/unified-login"
            className="text-sm"
            style={{ color: "var(--brand-primary)" }}
          >
            Already have an account? Sign in
          </Link>
        </div>
      </FormWrapper>
    );
  }

  // Step 2: Registration Form
  return (
    <FormWrapper 
      title={`Register as ${roleOptions.find(r => r.id === selectedRole)?.title}`}
      titleColor="var(--brand-primary)"
    >
      <div className="mt-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Complete your registration to get started
      </div>

      {/* Back button */}
      <button
        onClick={() => setStep(1)}
        className="mb-4 flex items-center text-sm"
        style={{ color: "var(--brand-primary)" }}
      >
        ← Back to role selection
      </button>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg flex items-center space-x-2 text-sm" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
            <FiAlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Information */}
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
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={formErrors.email}
            placeholder="john@example.com"
            icon={<FiMail />}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={formErrors.phone}
            placeholder="1234567890"
            icon={<FiPhone />}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={formErrors.password}
            placeholder="Enter your password"
            icon={<FiLock />}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={formErrors.confirmPassword}
            placeholder="Confirm your password"
            icon={<FiLock />}
          />

          {/* Role-specific fields */}
          {selectedRole === 'vendor' && (
            <>
              <Input
                label="Business Name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.business_name}
                placeholder="Your Business Name"
                icon={<FiShoppingBag />}
              />
              <Input
                label="Business License (Optional)"
                name="business_license"
                value={formData.business_license}
                onChange={handleChange}
                placeholder="License Number"
                icon={<FiSettings />}
              />
              <Input
                label="GST Number (Optional)"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="GST Number"
                icon={<FiSettings />}
              />
              <Input
                label="Business Address (Optional)"
                name="business_address"
                value={formData.business_address}
                onChange={handleChange}
                placeholder="Business Address"
                icon={<FiSettings />}
              />
            </>
          )}

          {selectedRole === 'delivery_partner' && (
            <>
              <Input
                label="Vehicle Type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.vehicle_type}
                placeholder="e.g., Motorcycle, Car, Bicycle"
                icon={<FiTruck />}
              />
              <Input
                label="License Number"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.license_number}
                placeholder="Driving License Number"
                icon={<FiKey />}
              />
            </>
          )}

          {selectedRole === 'admin' && (
            <>
              <Input
                label="Department (Optional)"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., IT, Operations"
                icon={<FiSettings />}
              />
              <Input
                label="Role (Optional)"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., System Admin, Manager"
                icon={<FiBarChart2 />}
              />
              <Input
                label="Admin Secret Key"
                name="secret_key"
                type="password"
                value={formData.secret_key}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.secret_key}
                placeholder="Enter admin secret key"
                icon={<FiShield />}
              />
            </>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          style={{
            backgroundColor: "var(--brand-primary)",
            color: "white",
          }}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Google OAuth - Available for all roles */}
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "var(--border-primary)" }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center space-x-2"
            disabled={isLoading}
            style={{
              backgroundColor: "white",
              color: "var(--text-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <FcGoogle className="w-5 h-5" />
            <span>Sign up with Google</span>
          </Button>
        </>

        <div className="text-center">
          <Link
            to="/unified-login"
            className="text-sm"
            style={{ color: "var(--brand-primary)" }}
          >
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
};

export default UnifiedRegistrationImproved;
