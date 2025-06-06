import Logo from "./Logo";

const FormWrapper = ({ children, title, titleColor }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"
        style={{ backgroundColor: "var(--brand-primary)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"
        style={{ backgroundColor: "var(--brand-secondary)" }}
      />

      <div
        className="max-w-md w-full space-y-7 p-8 rounded-xl animate-fadeIn relative z-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-large)",
          borderRadius: "var(--rounded-xl)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div className="flex flex-col items-center">
          <Logo size="large" titleColor={titleColor} />
          <h2
            className="mt-6 text-center text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
          <div
            className="h-1.5 w-20 mt-4 rounded-full"
            style={{
              background:
                "linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover))",
            }}
          ></div>
        </div>
        <div className="mt-8 relative">{children}</div>
      </div>
    </div>
  );
};

export default FormWrapper;
