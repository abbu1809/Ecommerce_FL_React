import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { usePageContentStore } from "../../store/usePageContentStore";

const WarrantyPolicy = () => {
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Warranty Policy", link: ROUTES.WARRANTY_POLICY },
  ];

  const { content, loading, fetchPageContent, clearContent } =
    usePageContentStore();

  useEffect(() => {
    fetchPageContent("warranty-policy");

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

      {/* Header */}
      <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Warranty Policy
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
                    This Warranty Policy outlines the terms and conditions of
                    the warranty coverage for products purchased from our stores
                    or website. By purchasing a product from us, you agree to
                    the terms of this policy.
                  </p>

                  <h2 className="text-xl font-bold mt-8 mb-4">
                    1. Standard Manufacturer's Warranty
                  </h2>
                  <p className="mb-4">
                    All products sold come with the standard manufacturer's
                    warranty. The warranty period varies by product and
                    manufacturer and is specified on the product page.
                  </p>

                  <h2 className="text-xl font-bold mt-8 mb-4">
                    2. Extended Warranty Options
                  </h2>
                  <p className="mb-4">
                    We offer extended warranty options on select products for an
                    additional fee. These extended warranties provide coverage
                    beyond the standard manufacturer's warranty period and may
                    offer additional benefits.
                  </p>

                  <h2 className="text-xl font-bold mt-8 mb-4">
                    3. Warranty Coverage
                  </h2>
                  <p className="mb-4">
                    Our warranty covers defects in materials and workmanship
                    under normal use during the warranty period. This warranty
                    does not cover damage caused by accidents, misuse, abuse,
                    neglect, improper installation, unauthorized modifications,
                    or natural disasters.
                  </p>

                  <h2 className="text-xl font-bold mt-8 mb-4">
                    4. Warranty Claims Process
                  </h2>
                  <p className="mb-4">
                    To make a warranty claim, customers must present the
                    original invoice or receipt as proof of purchase. All
                    warranty claims will be processed according to the
                    manufacturer's warranty policies.
                  </p>

                  <h2 className="text-xl font-bold mt-8 mb-4">
                    5. Repair, Replacement, or Refund
                  </h2>
                  <p className="mb-4">
                    For valid warranty claims, we will repair or replace
                    defective products at our discretion. If a product cannot be
                    repaired or replaced, we will provide a refund or store
                    credit for the purchase price.
                  </p>

                  <p className="mt-8 text-sm italic">
                    <strong>Note:</strong> This warranty policy is in addition
                    to, and does not affect, your statutory rights as a consumer
                    under the Consumer Protection Act, 2019, and other
                    applicable laws in India.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WarrantyPolicy;
