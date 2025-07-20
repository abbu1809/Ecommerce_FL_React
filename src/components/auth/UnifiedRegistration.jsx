import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiUserCheck, FiTruck, FiShoppingBag, FiSettings } from 'react-icons/fi';
import { useUnifiedAuthStore } from '../../store/unifiedAuthStore';

const UnifiedRegistration = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useUnifiedAuthStore();
    const [step, setStep] = useState(1); // 1: Role Selection, 2: Registration Form
    const [selectedRole, setSelectedRole] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Role-specific fields
        vehicle_type: '',
        vehicle_number: '',
        license_number: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        business_name: '',
        business_license: '',
        gst_number: '',
        business_address: '',
        department: '',
        role: 'admin'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userTypes = [
        {
            id: 'customer',
            title: 'Customer',
            description: 'Browse and purchase mobile phones',
            icon: FiShoppingBag,
            color: 'bg-blue-500',
            features: ['Browse products', 'Place orders', 'Track deliveries', 'Write reviews']
        },
        {
            id: 'delivery_partner',
            title: 'Delivery Partner',
            description: 'Deliver orders to customers',
            icon: FiTruck,
            color: 'bg-green-500',
            features: ['Accept delivery requests', 'Update delivery status', 'Earn money', 'Flexible hours']
        },
        {
            id: 'vendor',
            title: 'Vendor',
            description: 'Sell your mobile phones',
            icon: FiUser,
            color: 'bg-purple-500',
            features: ['List products', 'Manage inventory', 'View analytics', 'Process orders']
        },
        {
            id: 'admin',
            title: 'Admin',
            description: 'Manage the platform',
            icon: FiSettings,
            color: 'bg-red-500',
            features: ['User management', 'Order oversight', 'Analytics', 'System settings']
        }
    ];

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);
        setStep(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        
        if (selectedRole === 'delivery_partner') {
            if (!formData.vehicle_type || !formData.license_number) {
                setError('Vehicle type and license number are required for delivery partners');
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const registrationData = {
                email: formData.email,
                password: formData.password,
                firstName: formData.first_name,
                lastName: formData.last_name,
                phone: formData.phone,
                userType: selectedRole,
                profileData: {
                    // Role-specific fields
                    ...(selectedRole === 'delivery_partner' && {
                        vehicle_type: formData.vehicle_type,
                        vehicle_number: formData.vehicle_number,
                        license_number: formData.license_number,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    }),
                    ...(selectedRole === 'vendor' && {
                        business_name: formData.business_name,
                        business_license: formData.business_license,
                        gst_number: formData.gst_number,
                        business_address: formData.business_address
                    }),
                    ...(selectedRole === 'admin' && {
                        department: formData.department,
                        role: formData.role
                    })
                }
            };
            
            const response = await registerUser(registrationData);
            
            if (response.success) {
                // Show success message
                alert(`Registration successful! ${response.message || 'Welcome to our platform!'}`);
                
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
                        'vendor': '/vendor/dashboard'
                    };
                    navigate(dashboardRoutes[selectedRole] || '/dashboard');
                }
            } else {
                setError(response.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRoleSpecificFields = () => {
        switch (selectedRole) {
            case 'delivery_partner':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Type *
                            </label>
                            <select
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Vehicle Type</option>
                                <option value="bike">Motorcycle/Bike</option>
                                <option value="scooter">Scooter</option>
                                <option value="car">Car</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                name="vehicle_number"
                                value={formData.vehicle_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="MH 01 AB 1234"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                License Number *
                            </label>
                            <input
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="DL Number"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your City"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your complete address"
                            />
                        </div>
                    </div>
                );
            
            case 'vendor':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your Business Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business License
                            </label>
                            <input
                                type="text"
                                name="business_license"
                                value={formData.business_license}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="License Number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GST Number
                            </label>
                            <input
                                type="text"
                                name="gst_number"
                                value={formData.gst_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="GST Number"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Address
                            </label>
                            <textarea
                                name="business_address"
                                value={formData.business_address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your business address"
                            />
                        </div>
                    </div>
                );
            
            case 'admin':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Department</option>
                                <option value="operations">Operations</option>
                                <option value="customer_service">Customer Service</option>
                                <option value="inventory">Inventory Management</option>
                                <option value="finance">Finance</option>
                                <option value="marketing">Marketing</option>
                                <option value="technical">Technical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role Level
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {step === 1 ? (
                    // Role Selection Step
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Join Anand Mobiles
                            </h1>
                            <p className="text-gray-600">
                                What best describes you? Choose your role to get started.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userTypes.map((userType) => {
                                const IconComponent = userType.icon;
                                return (
                                    <div
                                        key={userType.id}
                                        onClick={() => handleRoleSelect(userType.id)}
                                        className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:scale-105 transition-all duration-200"
                                    >
                                        <div className={`w-12 h-12 ${userType.color} rounded-lg flex items-center justify-center mb-4`}>
                                            <IconComponent className="text-white text-2xl" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {userType.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {userType.description}
                                        </p>
                                        <ul className="space-y-1">
                                            {userType.features.map((feature, index) => (
                                                <li key={index} className="text-sm text-gray-500 flex items-center">
                                                    <FiUserCheck className="text-green-500 mr-2 text-xs" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="text-center mt-8">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    // Registration Form Step
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => setStep(1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                ← Back to role selection
                            </button>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {userTypes.find(type => type.id === selectedRole)?.title} Registration
                                </h2>
                                <p className="text-gray-600">
                                    Fill in your details to create your account
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role-specific fields */}
                            {renderRoleSpecificFields()}

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedRegistration;
