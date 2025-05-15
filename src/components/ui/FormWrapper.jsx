import React from "react";
import Logo from "./Logo";

const FormWrapper = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-md w-full space-y-7 p-8 rounded-xl animate-fadeIn"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          borderRadius: "var(--rounded-xl)",
        }}
      >
        <div className="flex flex-col items-center">
          <Logo size="large" />
          <h2
            className="mt-6 text-center text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
          <div
            className="h-1 w-16 mt-4 rounded-full"
            style={{ backgroundColor: "var(--brand-primary)" }}
          ></div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default FormWrapper;
