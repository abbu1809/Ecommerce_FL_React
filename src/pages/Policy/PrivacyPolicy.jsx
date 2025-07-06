import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { usePageContentStore } from "../../store/usePageContentStore";

const PrivacyPolicy = () => {
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Privacy Policy", link: ROUTES.PRIVACY_POLICY },
  ];

  const { content, loading, fetchPageContent, clearContent } =
    usePageContentStore();

  useEffect(() => {
    fetchPageContent("privacy-policy");

    return () => {
      clearContent();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Header */}
      <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-700">
              Last Updated: January 1, 2023
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
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
                <div className="prose max-w-none">
                  <p className="mb-6">
                    This Privacy Policy describes how your personal information
                    is collected, used, and shared when you visit or make a
                    purchase from our website.
                  </p>

                  {/* Default content here as fallback */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
