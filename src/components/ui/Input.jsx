import React from "react";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdErrorOutline,
} from "react-icons/md";

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
    const iconStyle = { color: "var(--text-secondary)" };

    switch (iconName) {
      case "email":
        return <MdEmail style={iconStyle} className="h-5 w-5" />;
      case "lock":
        return <MdLock style={iconStyle} className="h-5 w-5" />;
      case "user":
        return <MdPerson style={iconStyle} className="h-5 w-5" />;
      case "phone":
        return <MdPhone style={iconStyle} className="h-5 w-5" />;
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
          <MdErrorOutline className="h-4 w-4 mr-1.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
