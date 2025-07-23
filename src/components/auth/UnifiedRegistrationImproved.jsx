import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormWrapper from '../ui/FormWrapper';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle, FiSettings, FiShoppingBag, FiTruck, FiBarChart2, FiShield } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useUnifiedAuthStoreImproved } from '../../store/unifiedAuthStoreImproved';
//import { useUnifiedAuthStore } from '../../store/unifiedAuthStoreImproved';
//import { useUnifiedAuthStore } from '../store/unifiedAuthStoreImproved';

/**
 * 🎯 HackerRank-Style Registration Component
 * Professional role selection with old design consistency
 */
const UnifiedRegistrationImproved = () => {
  const navigate = useNavigate();
  const { register, error, isLoading } = useUnifiedAuthStoreImproved();
  
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form
  const [selectedRole, setSelectedRole] = useState('');
  
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
    admin_role: '',
    secretKey: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Professional role definitions (HackerRank style)
  const roles = [
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

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
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
          } else if (!/^\\d{10}$/.test(formData.phone)) {
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
        case 'secretKey':
          if (selectedRole === 'admin' && !formData.secretKey) {
            errors.secretKey = "Secret key is required for admin registration";
          }
          break;
      }
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (!/^\\d{10}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number (10 digits required)";
    }

    // Role-specific validation
    if (selectedRole === 'admin' && !formData.secretKey) {
      errors.secretKey = "Secret key is required for admin registration";
    }

    if (selectedRole === 'vendor') {
      if (!formData.business_name.trim()) {
        errors.business_name = "Business name is required for vendors";
      }
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
      // Prepare registration data
      const registrationData = {
        user_type: selectedRole,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        role_specific_data: {
          // Vendor-specific data
          ...(selectedRole === 'vendor' && {
            business_name: formData.business_name,
            business_license: formData.business_license,
            gst_number: formData.gst_number,
            business_address: formData.business_address
          }),
          // Admin-specific data
          ...(selectedRole === 'admin' && {
            department: formData.department,
            admin_role: formData.admin_role,
            secret_key: formData.secretKey
          })
        }
      };
      
      const response = await register(registrationData);
      
      if (response.success) {
        const userTypeDisplay = response.data.user.user_type_display || response.data.user.user_type;
        alert(`Registration successful! Welcome ${formData.firstName}! (${userTypeDisplay})`);
        
        // Smart redirect based on role
        const dashboardUrl = response.data.dashboard_url || '/dashboard';
        navigate(dashboardUrl);
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Use existing Google OAuth flow
      const response = await handleGoogleSignup();
      console.log("Google signup successful:", response);
      navigate("/");
    } catch (err) {
      console.error("Google signup error:", err);
    }
  };

  const getRoleIcon = (role) => {
    const iconProps = { className: "w-8 h-8" };
    switch (role.id) {
      case 'customer': return <FiShoppingBag {...iconProps} />;
      case 'vendor': return <FiShoppingBag {...iconProps} />;
      case 'delivery_partner': return <FiTruck {...iconProps} />;
      case 'manager': return <FiBarChart2 {...iconProps} />;
      case 'admin': return <FiShield {...iconProps} />;
      default: return <FiUser {...iconProps} />;
    }
  };

  // Step 1: Role Selection (HackerRank Style)
  if (step === 1) {
    return (
      <FormWrapper title="What describes you best?" titleColor="var(--brand-primary)">
        <div className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Choose your role to get started with the right features for you
        </div>

        <div className="mt-8 space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg text-white ${role.color}`}>
                  {getRoleIcon(role)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    {role.title}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: "var(--brand-primary)" }}>
                    {role.subtitle}
                  </p>
                  <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                    {role.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--bg-accent-light)",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{' '}
            <Link
              to="/unified-login"
              className="font-medium hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </FormWrapper>
    );
  }

  // Step 2: Registration Form (Old Design Style)
  const selectedRoleData = roles.find(r => r.id === selectedRole);
  
  return (
    <FormWrapper title={`Join as ${selectedRoleData?.title}`} titleColor="var(--brand-primary)">
      <div className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Create your {selectedRoleData?.title.toLowerCase()} account to get started
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Background decorative elements */}
        <div
          className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10"
          style={{ backgroundColor: "var(--brand-primary)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full opacity-10"
          style={{ backgroundColor: "var(--brand-secondary)" }}
        />
        
        <div className="space-y-5 relative z-10">
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

          {/* Role-specific fields */}
          {selectedRole === 'vendor' && (
            <>
              <h4 className="text-md font-semibold mt-6" style={{ color: "var(--text-primary)" }}>
                Business Information
              </h4>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business License (Optional)"
                  name="business_license"
                  value={formData.business_license}
                  onChange={handleChange}
                  placeholder="License Number"
                  icon={<FiShield />}
                />
                <Input
                  label="GST Number (Optional)"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="GST Number"
                  icon={<FiBarChart3 />}
                />
              </div>
              <Input
                label="Business Address"
                name="business_address"
                value={formData.business_address}
                onChange={handleChange}
                placeholder="Complete Business Address"
                icon={<FiSettings />}
              />
            </>
          )}

          {selectedRole === 'admin' && (
            <>
              <h4 className="text-md font-semibold mt-6" style={{ color: "var(--text-primary)" }}>
                Administrator Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Department (Optional)"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="IT, Sales, Operations"
                  icon={<FiSettings />}
                />
                <Input
                  label="Role (Optional)"
                  name="admin_role"
                  value={formData.admin_role}
                  onChange={handleChange}
                  placeholder="System Admin, Manager"
                  icon={<FiShield />}
                />
              </div>
              <Input
                label="Secret Key"
                type="password"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={formErrors.secretKey}
                placeholder="Admin Secret Key"
                icon={<FiShield />}
              />
            </>
          )}
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

        <div className="pt-2">
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
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            ← Change Role
          </button>
        </div>
      </form>

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
      
      <div className="text-center mt-6">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{' '}
          <Link
            to="/unified-login"
            className="font-medium hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};

export default UnifiedRegistrationImproved;
