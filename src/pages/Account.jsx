import React from "react";
import { useParams } from "react-router-dom";
import { useUnifiedAuthStoreImproved } from "../store/unifiedAuthStoreImproved";
import AccountSidebar from "../components/Account/AccountSidebar";
import ProfileInfo from "../components/Account/ProfileInfo";
import AddressList from "../components/Account/AddressList";
import PaymentMethods from "../components/Account/PaymentMethods";
import AccountSettings from "../components/Account/AccountSettings";
import { FiUser, FiShield } from "react-icons/fi";

const Account = () => {
  const { section = "profile" } = useParams();
  const [activeSection, setActiveSection] = React.useState(section);
  const { user } = useUnifiedAuthStoreImproved();

  React.useEffect(() => {
    // Update active section when URL param changes
    setActiveSection(section);
  }, [section]);

  // Render the appropriate component based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case "addresses":
        return <AddressList />;
      case "payment":
        return <PaymentMethods />;
      case "settings":
        return <AccountSettings />;
      case "profile":
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with User Welcome */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg font-bold text-xl"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                color: 'var(--text-on-brand)'
              }}
            >
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : <FiUser className="text-2xl" />}
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Welcome back, {user?.first_name || 'User'}!
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: 'var(--brand-secondary)',
                    color: 'var(--text-on-brand)'
                  }}
                >
                  {user?.user_type?.replace('_', ' ').toUpperCase() || 'USER'}
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: '#10B981',
                    color: 'white'
                  }}
                >
                  <span className="w-2 h-2 bg-white rounded-full inline-block mr-1.5"></span>
                  Active
                </span>
                {user?.is_verified && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                    style={{ 
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    <FiShield className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AccountSidebar />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
