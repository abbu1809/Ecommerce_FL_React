import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Contact", link: ROUTES.CONTACT },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <FiPhone className="text-lg" />,
      title: "Phone Number",
      details: ["+91 98765 43210", "+91 12345 67890"],
    },
    {
      icon: <FiMail className="text-lg" />,
      title: "Email Address",
      details: ["support@yourdomain.com", "info@yourdomain.com"],
    },
    {
      icon: <FiMapPin className="text-lg" />,
      title: "Office Address",
      details: ["123 Main Street", "New Delhi, India 110001"],
    },
    {
      icon: <FiClock className="text-lg" />,
      title: "Working Hours",
      details: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-500">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.link}
                    className="text-gray-500 hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: "var(--brand-primary)" }}
            >
              Contact Us
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Have questions or need assistance? We're here to help! Our team is
              ready to provide you with the support you need.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "white",
                  }}
                >
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                    style={{ focusRing: "var(--brand-primary)" }}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition duration-300"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                  disabled={loading}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="h-full min-h-[400px]">
              <div className="relative h-full w-full rounded-lg overflow-hidden shadow-md">
                <iframe
                  title="Location Map"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4784043211377!2d77.22117627415673!3d28.63483068241763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd3724ed1d4b%3A0xff78448cc3bba8e2!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1693231423844!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "What are your store hours?",
                  answer:
                    "Our stores are open Monday through Saturday from 10:00 AM to 8:00 PM. We are closed on Sundays and major holidays.",
                },
                {
                  question: "Do you offer product repairs?",
                  answer:
                    "Yes, we offer repair services for most of the products we sell. Please bring your device to the nearest store or contact our customer service team for more information.",
                },
                {
                  question: "How can I track my order?",
                  answer:
                    "You can track your order by visiting the Track Order page on our website and entering your order number and email address.",
                },
                {
                  question: "What is your return policy?",
                  answer:
                    "We offer a 7-day return policy for most products. Items must be returned in their original packaging with all accessories. Please check our Returns & Refunds page for more details.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
