import React from "react";
import { FiBell, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import useThemeStore from "../../store/useTheme";

const AccountSettings = () => {
  const { theme, /*isDarkMode,*/ setTheme } = useThemeStore();
  
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    priceDrops: true,
    twoFactorAuth: false,
  });

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Account Settings
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage your notification preferences and account security
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Settings Section */}
        <div>
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            <div className="flex items-center gap-2">
              <FiBell />
              <span>Notification Preferences</span>
            </div>
          </h3>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email Notifications
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Receive updates via email
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("emailNotifications")}
                className="text-2xl"
                aria-label={
                  settings.emailNotifications
                    ? "Disable email notifications"
                    : "Enable email notifications"
                }
              >
                {settings.emailNotifications ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  SMS Notifications
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Receive updates via text message
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("smsNotifications")}
                className="text-2xl"
                aria-label={
                  settings.smsNotifications
                    ? "Disable SMS notifications"
                    : "Enable SMS notifications"
                }
              >
                {settings.smsNotifications ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Push Notifications
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Receive notifications on mobile app
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("pushNotifications")}
                className="text-2xl"
                aria-label={
                  settings.pushNotifications
                    ? "Disable push notifications"
                    : "Enable push notifications"
                }
              >
                {settings.pushNotifications ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Notification Types
          </h3>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order Updates
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Receive updates about your orders
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("orderUpdates")}
                className="text-2xl"
                aria-label={
                  settings.orderUpdates
                    ? "Disable order updates"
                    : "Enable order updates"
                }
              >
                {settings.orderUpdates ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Promotions & Deals
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Receive special offers and promotions
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("promotions")}
                className="text-2xl"
                aria-label={
                  settings.promotions
                    ? "Disable promotions"
                    : "Enable promotions"
                }
              >
                {settings.promotions ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  New Arrivals
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Be notified about new products
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("newArrivals")}
                className="text-2xl"
                aria-label={
                  settings.newArrivals
                    ? "Disable new arrivals notifications"
                    : "Enable new arrivals notifications"
                }
              >
                {settings.newArrivals ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Price Drops
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Be notified about price drops on your wishlist
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("priceDrops")}
                className="text-2xl"
                aria-label={
                  settings.priceDrops
                    ? "Disable price drop notifications"
                    : "Enable price drop notifications"
                }
              >
                {settings.priceDrops ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        
        <div>
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Appearance
          </h3>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Theme Mode
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Choose between light, dark, or system theme
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Current: {theme === 'system' ? 'Auto (System)' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    theme === 'light' 
                      ? 'shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: theme === 'light' ? 'var(--brand-primary)' : 'transparent',
                    color: theme === 'light' ? 'var(--text-on-brand)' : 'var(--text-primary)',
                    border: `1px solid ${theme === 'light' ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                  }}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--brand-primary)' : 'transparent',
                    color: theme === 'dark' ? 'var(--text-on-brand)' : 'var(--text-primary)',
                    border: `1px solid ${theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                  }}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    theme === 'system' 
                      ? 'shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: theme === 'system' ? 'var(--brand-primary)' : 'transparent',
                    color: theme === 'system' ? 'var(--text-on-brand)' : 'var(--text-primary)',
                    border: `1px solid ${theme === 'system' ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                  }}
                >
                  Auto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Security
          </h3>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Two-Factor Authentication
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleToggleSetting("twoFactorAuth")}
                className="text-2xl"
                aria-label={
                  settings.twoFactorAuth
                    ? "Disable two-factor authentication"
                    : "Enable two-factor authentication"
                }
              >
                {settings.twoFactorAuth ? (
                  <FiToggleRight style={{ color: "var(--brand-primary)" }} />
                ) : (
                  <FiToggleLeft style={{ color: "var(--text-secondary)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className="pt-4 border-t"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <button
            className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
