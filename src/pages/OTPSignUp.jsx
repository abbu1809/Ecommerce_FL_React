import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuth';
import OTPSignupComponent from '../components/auth/OTPSignupComponent';
import FormWrapper from '../components/ui/FormWrapper';

const OTPSignUp = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleSignupSuccess = (userData) => {
    console.log('OTP Registration successful:', userData);
    
    // Store auth data
    if (userData.token) {
      setToken(userData.token);
    }
    if (userData.user) {
      setUser(userData.user);
    }
    
    // Redirect to home page after successful signup
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <OTPSignupComponent 
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  );
};

export default OTPSignUp;
