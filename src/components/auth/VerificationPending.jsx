import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiClock, FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const VerificationPending = () => {
    const location = useLocation();
    const { userType = 'user', email = '' } = location.state || {};
    
    const userTypeDisplayNames = {
        'delivery_partner': 'Delivery Partner',
        'vendor': 'Vendor',
        'admin': 'Admin',
        'manager': 'Manager'
    };
    
    const verificationSteps = {
        'delivery_partner': [
            'Document verification',
            'Vehicle registration check',
            'License validation',
            'Background verification',
            'Final approval'
        ],
        'vendor': [
            'Business license verification',
            'GST number validation',
            'Product categories review',
            'Quality standards check',
            'Final approval'
        ],
        'admin': [
            'Identity verification',
            'Role assignment review',
            'Security clearance',
            'Department head approval',
            'System access setup'
        ],
        'manager': [
            'Identity verification',
            'Management level review',
            'Department assignment',
            'Authority level setup',
            'System access configuration'
        ]
    };
    
    const expectedTimelines = {
        'delivery_partner': '2-3 business days',
        'vendor': '3-5 business days',
        'admin': '1-2 business days',
        'manager': '1-2 business days'
    };
    
    const displayName = userTypeDisplayNames[userType] || 'User';
    const steps = verificationSteps[userType] || [];
    const timeline = expectedTimelines[userType] || '2-3 business days';

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    {/* Status Icon */}
                    <div className="mb-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                            <FiClock className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                    
                    {/* Main Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Account Under Review
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your <span className="font-semibold text-orange-600">{displayName}</span> account has been created successfully and is currently being reviewed by our team.
                    </p>
                    
                    {/* Email Confirmation */}
                    {email && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <div className="flex items-center justify-center mb-2">
                                <FiMail className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-900">Confirmation sent to:</span>
                            </div>
                            <p className="text-blue-800 font-semibold">{email}</p>
                        </div>
                    )}
                    
                    {/* Verification Process */}
                    <div className="mb-8 text-left">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Verification Process
                        </h2>
                        <div className="space-y-3">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                            <span className="text-sm text-gray-500">{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Timeline */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-center mb-2">
                            <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-900">Expected Timeline</span>
                        </div>
                        <p className="text-green-800 font-semibold">{timeline}</p>
                        <p className="text-green-700 text-sm mt-1">
                            You'll receive an email notification once approved
                        </p>
                    </div>
                    
                    {/* What happens next */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            What happens next?
                        </h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start">
                                <FiAlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Review Process:</span> Our team will verify your information and documents
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FiMail className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Email Notification:</span> You'll receive approval confirmation via email
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FiCheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Account Access:</span> Full account features will be unlocked after approval
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div>
                            <Link
                                to="/login"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Try Login Again
                            </Link>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Contact Support
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Additional Information */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Need Help?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Support Email</h4>
                            <p className="text-gray-600">support@anandmobiles.com</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Support Hours</h4>
                            <p className="text-gray-600">Mon-Fri: 9 AM - 6 PM IST</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Phone Support</h4>
                            <p className="text-gray-600">+91 98765 43210</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
                            <p className="text-gray-600">Within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPending;
