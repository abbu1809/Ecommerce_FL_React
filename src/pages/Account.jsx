import React from "react";
import { useParams } from "react-router-dom";
import AccountSidebar from "../components/Account/AccountSidebar";
import ProfileInfo from "../components/Account/ProfileInfo";
import AddressList from "../components/Account/AddressList";
import PaymentMethods from "../components/Account/PaymentMethods";
import AccountSettings from "../components/Account/AccountSettings";

const Account = () => {
  const { section = "profile" } = useParams();
  const [activeSection, setActiveSection] = React.useState(section);

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
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-2xl font-bold mb-6 md:mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        My Account
      </h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AccountSidebar />
        </div>

        <div className="md:col-span-2 lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Account;
