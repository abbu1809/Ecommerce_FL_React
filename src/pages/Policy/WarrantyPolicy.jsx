import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const WarrantyPolicy = () => {
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Warranty Policy", link: ROUTES.WARRANTY_POLICY },
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
              <div className="prose max-w-none">
                <p className="mb-6">
                  This Warranty Policy outlines the terms and conditions of the
                  warranty coverage for products purchased from our stores or
                  website. By purchasing a product from us, you agree to the
                  terms of this policy.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  1. Standard Manufacturer's Warranty
                </h2>
                <p className="mb-4">
                  All new products sold through our stores or website carry the
                  standard manufacturer's warranty. The warranty period varies
                  by product category and brand as follows:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Mobile Phones: 1 year from the date of purchase</li>
                  <li>
                    Laptops: 1-3 years from the date of purchase (varies by
                    brand)
                  </li>
                  <li>Tablets: 1 year from the date of purchase</li>
                  <li>Accessories: 3-6 months from the date of purchase</li>
                  <li>
                    TVs and Home Appliances: 1-2 years from the date of purchase
                  </li>
                </ul>
                <p className="mb-4">
                  The warranty covers manufacturing defects and malfunctions
                  that occur during normal use of the product. The exact
                  coverage details may vary by manufacturer and will be included
                  in the product documentation.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  2. Extended Warranty
                </h2>
                <p className="mb-4">
                  We offer optional extended warranty plans for most products.
                  Extended warranties provide additional coverage beyond the
                  manufacturer's warranty period. Details of the extended
                  warranty plans are available at the time of purchase.
                </p>
                <p className="mb-4">
                  Extended warranty plans must be purchased at the time of
                  buying the product or within 30 days of the purchase date.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  3. Warranty Claims Process
                </h2>
                <p className="mb-4">
                  To initiate a warranty claim, please follow these steps:
                </p>
                <ol className="list-decimal pl-8 mb-4">
                  <li className="mb-2">
                    <strong>Contact Us:</strong> Reach out to our customer
                    service team through email, phone, or visit any of our
                    stores with your product and proof of purchase.
                  </li>
                  <li className="mb-2">
                    <strong>Product Assessment:</strong> Our technical team will
                    assess the product to determine if the issue is covered
                    under warranty.
                  </li>
                  <li className="mb-2">
                    <strong>Repair or Replacement:</strong> If the claim is
                    valid, we will either repair the product or replace it as
                    per the warranty terms.
                  </li>
                  <li>
                    <strong>Return of Repaired/Replaced Product:</strong> Once
                    repaired or replaced, you will be notified to collect your
                    product.
                  </li>
                </ol>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  4. Required Documentation
                </h2>
                <p className="mb-4">
                  To process a warranty claim, you will need to provide:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Original purchase invoice or receipt</li>
                  <li>Warranty card (if provided with the product)</li>
                  <li>Valid ID proof</li>
                  <li>Details of the issue or defect</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  5. Warranty Exclusions
                </h2>
                <p className="mb-4">
                  The warranty does not cover damage or malfunction resulting
                  from:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Accidents, misuse, abuse, or negligence</li>
                  <li>Improper installation, operation, or maintenance</li>
                  <li>Unauthorized repairs or modifications</li>
                  <li>Normal wear and tear</li>
                  <li>Use of incompatible accessories or peripherals</li>
                  <li>
                    Exposure to extreme conditions (water, fire, heat, etc.)
                  </li>
                  <li>Power fluctuations or electrical surges</li>
                  <li>Software issues, viruses, or malware</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  6. Dead on Arrival (DOA) Policy
                </h2>
                <p className="mb-4">
                  If a product is found to be defective within 7 days of
                  purchase (Dead on Arrival), you have the following options:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>
                    Immediate replacement with the same model (subject to
                    availability)
                  </li>
                  <li>Full refund</li>
                  <li>Store credit for the full purchase amount</li>
                </ul>
                <p className="mb-4">
                  The product must be returned in its original packaging with
                  all accessories and documentation.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  7. Repair Timeframes
                </h2>
                <p className="mb-4">
                  We strive to complete warranty repairs as quickly as possible.
                  The typical repair timeframes are:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Basic repairs: 5-7 working days</li>
                  <li>Complex repairs: 10-15 working days</li>
                  <li>
                    Repairs requiring parts from overseas: 15-30 working days
                  </li>
                </ul>
                <p className="mb-4">
                  You will be informed if there are any delays in the repair
                  process.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">8. Data Backup</h2>
                <p className="mb-4">
                  We are not responsible for any loss of data during the
                  warranty service. It is your responsibility to back up all
                  data, software, and programs before submitting your product
                  for warranty service.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  9. Transferability
                </h2>
                <p className="mb-4">
                  Manufacturer warranties are generally transferable to
                  subsequent owners within the warranty period. However,
                  extended warranties purchased from us are typically
                  non-transferable unless otherwise specified.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  10. International Warranty
                </h2>
                <p className="mb-4">
                  Most products carry an India-specific warranty and may not be
                  covered by international warranty services. Some premium
                  brands offer international warranty coverage; please check the
                  product documentation for details.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  11. Warranty for Refurbished Products
                </h2>
                <p className="mb-4">
                  Refurbished products sold by us come with a limited warranty
                  of 6 months covering manufacturing defects only, unless
                  otherwise specified at the time of purchase.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  12. Contact for Warranty Claims
                </h2>
                <p className="mb-4">
                  For warranty claims or inquiries, please contact us:
                </p>
                <p className="mb-4">
                  Email: warranty@yourdomain.com
                  <br />
                  Phone: +91 98765 43210
                  <br />
                  Hours: Monday to Saturday, 10:00 AM - 7:00 PM (IST)
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  13. Modifications to This Policy
                </h2>
                <p className="mb-4">
                  We reserve the right to modify this policy at any time.
                  Changes will be effective immediately upon posting on our
                  website and will not affect existing warranty claims.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-8">
                  <p className="text-sm">
                    <strong>Note:</strong> This warranty policy is in addition
                    to, and does not affect, your statutory rights as a consumer
                    under the Consumer Protection Act, 2019, and other
                    applicable laws in India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WarrantyPolicy;
