import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiArrowRight,
} from "react-icons/fi";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import FormWrapper from "../../components/UI/FormWrapper";
import { DeliveryLayout } from "../../components/Delivery";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    vehicleType: "bike",
    vehicleNumber: "",
    idProof: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      idProof: e.target.files[0],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.vehicleNumber)
      newErrors.vehicleNumber = "Vehicle number is required";
    if (!formData.idProof) newErrors.idProof = "ID proof is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Registration successful
      navigate("/delivery/login", {
        state: {
          message:
            "Registration successful! Please wait for admin verification.",
        },
      });
    } catch (error) {
      setErrors({
        form: "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeliveryLayout hideMenu>
      <div className="w-full max-w-3xl mx-auto">
        <FormWrapper>
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Become a Delivery Partner
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Join our team and start earning. We'll review your application
              within 24 hours.
            </p>
          </div>

          {errors.form && (
            <div
              className="mb-4 p-3 rounded-md"
              style={{
                backgroundColor: "var(--error-color)20",
                color: "var(--error-color)",
              }}
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<FiUser />}
                error={errors.fullName}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<FiMail />}
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={<FiLock />}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={<FiLock />}
                error={errors.confirmPassword}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                icon={<FiPhone />}
                error={errors.phone}
              />

              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                icon={<FiMapPin />}
                error={errors.address}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Vehicle Type
                </label>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <FiTruck />
                  </div>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-primary)",
                      borderWidth: "1px",
                    }}
                  >
                    <option value="bike">Bike/Scooter</option>
                    <option value="car">Car</option>
                    <option value="van">Van/Mini Truck</option>
                  </select>
                </div>
              </div>

              <Input
                label="Vehicle Number"
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="Enter vehicle registration number"
                icon={<FiTruck />}
                error={errors.vehicleNumber}
              />
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                ID Proof (Driving License/Govt ID)
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="idProof"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-md text-sm border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: errors.idProof
                      ? "var(--error-color)"
                      : "var(--border-primary)",
                  }}
                  accept="image/*,.pdf"
                />
                {errors.idProof && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--error-color)" }}
                  >
                    {errors.idProof}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                fullWidth={true}
                variant="primary"
                isLoading={isLoading}
                icon={<FiArrowRight />}
              >
                Register as Delivery Partner
              </Button>
            </div>

            <div className="text-center mt-4">
              <p style={{ color: "var(--text-secondary)" }}>
                Already have an account?{" "}
                <Link
                  to="/delivery/login"
                  style={{ color: "var(--brand-primary)", fontWeight: 500 }}
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </FormWrapper>
      </div>
    </DeliveryLayout>
  );
};

export default PartnerRegister;
