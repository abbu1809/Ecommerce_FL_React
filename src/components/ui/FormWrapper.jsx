import React from "react";
import Logo from "./Logo";

const FormWrapper = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white p-8 rounded-xl shadow-sm">
        <div className="flex flex-col items-center">
          <Logo size="large" />
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
