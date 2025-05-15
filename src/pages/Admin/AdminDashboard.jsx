import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-text-primary">
        Admin Dashboard
      </h1>
      <p className="text-text-secondary mt-2">
        Welcome to the admin control panel. Manage your products, orders, and
        users from here.
      </p>
      {/* TODO: Add more dashboard widgets and summaries here */}
    </div>
  );
};

export default AdminDashboard;
