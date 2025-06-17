import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { usePageContentStore } from "../store/usePageContentStore";
import {
  FaBuilding,
  FaAward,
  FaUsers,
  FaHistory,
  FaLaptop,
  FaMobileAlt,
} from "react-icons/fa";

const About = () => {
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "About", link: ROUTES.ABOUT },
  ];

  const { content, loading, fetchPageContent, clearContent } =
    usePageContentStore();

  useEffect(() => {
    fetchPageContent("about");

    return () => {
      clearContent();
    };
  }, [fetchPageContent, clearContent]);

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
              About Us
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              We are a premier electronics retailer specializing in the latest
              mobile phones, laptops, tablets, and accessories. Our mission is
              to provide high-quality products with exceptional customer
              service.
            </p>
          </div>
        </div>
      </section>{" "}
      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : content ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <p className="text-gray-700 mb-4">
                    Founded in 2010, we began as a small mobile phone shop with
                    a vision to make technology accessible to everyone. Over the
                    years, we've grown to become one of the most trusted
                    electronics retailers in the region.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Our journey has been defined by a commitment to quality,
                    innovation, and customer satisfaction. We carefully select
                    each product in our inventory to ensure it meets our high
                    standards of performance and reliability.
                  </p>
                  <p className="text-gray-700">
                    Today, we continue to expand our offerings while maintaining
                    the personalized service that has been the cornerstone of
                    our success.
                  </p>
                </>
              )}
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our store"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaAward className="text-4xl text-indigo-500 mb-4" />,
                title: "Quality Assurance",
                description:
                  "All our products are genuine and come with official warranties.",
              },
              {
                icon: <FaUsers className="text-4xl text-indigo-500 mb-4" />,
                title: "Expert Support",
                description:
                  "Our knowledgeable team is always ready to help you make the right choice.",
              },
              {
                icon: <FaLaptop className="text-4xl text-indigo-500 mb-4" />,
                title: "Wide Selection",
                description:
                  "From budget-friendly to premium, we have options for every need and preference.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Our Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-indigo-50 p-8 rounded-lg">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--brand-primary)" }}
              >
                Our Vision
              </h3>
              <p className="text-gray-700">
                To be the leading electronics retailer known for exceptional
                customer experience, innovative product offerings, and making
                technology accessible to all segments of society.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--brand-primary)" }}
              >
                Our Mission
              </h3>
              <p className="text-gray-700">
                To provide our customers with high-quality electronics products
                at competitive prices, exceptional customer service, and an
                enjoyable shopping experience both online and in-store.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Visit our store today or browse our online collection to find the
            perfect device for your needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to={ROUTES.PRODUCTS}
              className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
