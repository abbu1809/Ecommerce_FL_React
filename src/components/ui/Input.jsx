import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  icon = null,
}) => {
  // Icon mapping function
  const getIcon = (iconName) => {
    const iconClasses = "h-5 w-5";
    const iconStyle = { color: "var(--text-secondary)" };

    switch (iconName) {
      case "email":
        return (
          <svg
            className={iconClasses}
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );

      case "lock":
        return (
          <svg
            className={iconClasses}
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "user":
        return (
          <svg
            className={iconClasses}
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "phone":
        return (
          <svg
            className={iconClasses}
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );

      default:
        return null;
    }
  };

  const inputStyle = {
    borderRadius: "var(--rounded-md)",
    backgroundColor: error ? "var(--bg-primary)" : "var(--bg-primary)",
    borderColor: error ? "var(--error-color)" : "var(--border-primary)",
    transition: "all 0.3s ease-in-out",
  };

  const labelStyle = {
    color: "var(--text-primary)",
  };

  const errorStyle = {
    color: "var(--error-color)",
  };

  return (
    <div className="mb-4 group">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1.5 transition-colors duration-200"
        style={labelStyle}
      >
        {label} {required && <span style={errorStyle}>*</span>}
      </label>
      <div className="relative rounded-md">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200">
            {typeof icon === "string"
              ? getIcon(icon)
              : React.cloneElement(icon, {
                  className: "h-5 w-5",
                  style: { color: "var(--text-secondary)" },
                })}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`block w-full ${
            icon ? "pl-10" : "px-4"
          } py-3 border shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-all duration-300 ${
            error
              ? "focus:ring-red-500 border-red-300"
              : "focus:ring-opacity-50 focus:border-transparent focus:ring-opacity-50 group-hover:border-opacity-70"
          }`}
          style={{
            ...inputStyle,
            boxShadow: error
              ? "0 0 0 1px var(--error-color)"
              : "var(--shadow-small)",
            ...(error
              ? {}
              : {
                  focusBorderColor: "var(--brand-primary)",
                  focusRing: "var(--brand-primary)",
                }),
          }}
        />

        {/* Add focus effect border line */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 transform scale-x-0 transition-transform duration-300 ease-out ${
            error ? "bg-red-500" : ""
          }`}
          style={{
            backgroundColor: error
              ? "var(--error-color)"
              : "var(--brand-primary)",
            transformOrigin: "left",
            width: "100%",
          }}
        />
      </div>
      {error && (
        <p
          className="mt-2 text-sm flex items-center animate-fadeIn"
          style={errorStyle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
