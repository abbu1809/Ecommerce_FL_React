import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const ShippingDeliveryPolicy = () => {
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    {
      label: "Shipping & Delivery Policy",
      link: ROUTES.SHIPPING_DELIVERY_POLICY,
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

      {/* Header */}
      <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Shipping & Delivery Policy
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
                  This Shipping & Delivery Policy outlines the terms and
                  conditions for the delivery of products purchased from our
                  website or physical stores. By placing an order with us, you
                  agree to the terms of this policy.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  1. Shipping Methods and Timeframes
                </h2>
                <h3 className="text-lg font-medium mt-6 mb-3">
                  1.1 Standard Shipping
                </h3>
                <p className="mb-4">
                  Standard shipping typically takes 3-5 business days for
                  delivery after your order has been processed and shipped.
                  Processing time is usually 1-2 business days from the time
                  your payment is confirmed.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">
                  1.2 Express Shipping
                </h3>
                <p className="mb-4">
                  Express shipping is available for most products and locations,
                  with delivery typically within 1-2 business days after your
                  order has been processed and shipped. Additional charges apply
                  for express shipping.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">
                  1.3 Same-Day Delivery
                </h3>
                <p className="mb-4">
                  Same-day delivery is available in select cities for orders
                  placed before 12:00 PM local time, subject to product
                  availability and delivery slot availability. Additional
                  charges apply for same-day delivery.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  2. Shipping Costs
                </h2>
                <p className="mb-4">
                  Shipping costs are calculated based on the following factors:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Delivery destination</li>
                  <li>Shipping method selected</li>
                  <li>Order weight and dimensions</li>
                  <li>Order value</li>
                </ul>
                <p className="mb-4">
                  Shipping costs will be displayed during checkout before
                  payment is processed. We offer free standard shipping on
                  orders above ₹1000.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  3. Service Areas
                </h2>
                <p className="mb-4">
                  We ship to most locations across India. However, some remote
                  areas may not be serviceable or may have extended delivery
                  timeframes. You will be notified during checkout if your
                  delivery location is not serviceable.
                </p>
                <p className="mb-4">
                  For international shipping, please contact our customer
                  service team for availability and rates.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  4. Order Processing
                </h2>
                <p className="mb-4">
                  Your order will be processed once payment has been confirmed.
                  You will receive an order confirmation email with your order
                  number and details.
                </p>
                <p className="mb-4">
                  Orders placed on weekends or public holidays will be processed
                  on the next business day. During sale periods or promotional
                  events, order processing may take longer than usual.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  5. Order Tracking
                </h2>
                <p className="mb-4">
                  Once your order has been shipped, you will receive a shipping
                  confirmation email with a tracking number. You can track your
                  order status by:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>
                    Visiting the
                    <Link
                      to={ROUTES.TRACK_ORDER}
                      className="text-blue-600 hover:underline"
                    >
                      Order Tracking
                    </Link>
                    page on our website
                  </li>
                  <li>
                    Logging into your account and viewing your order history
                  </li>
                  <li>
                    Contacting our customer service team with your order number
                  </li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">6. Delivery</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">
                  6.1 Delivery Attempts
                </h3>
                <p className="mb-4">
                  Our delivery partner will make up to three attempts to deliver
                  your order at the provided address. If nobody is available to
                  receive the order after three attempts, the package may be
                  returned to our warehouse, and you will be contacted to
                  arrange for redelivery or pickup.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">
                  6.2 Inspection at Delivery
                </h3>
                <p className="mb-4">
                  Please inspect your package at the time of delivery. If the
                  package appears damaged or tampered with, please note this on
                  the delivery receipt and contact our customer service team
                  immediately.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">
                  6.3 Proof of Delivery
                </h3>
                <p className="mb-4">
                  For security purposes, our delivery partners may require a
                  signature or photograph upon delivery. In some cases, they may
                  also verify the recipient's identity through an OTP sent to
                  the registered mobile number.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  7. Delays and Issues
                </h2>
                <p className="mb-4">
                  While we strive to meet our delivery timeframes, delays may
                  occur due to factors beyond our control, including but not
                  limited to:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Adverse weather conditions</li>
                  <li>Natural disasters</li>
                  <li>Civil disturbances</li>
                  <li>Public holidays</li>
                  <li>Incorrect or incomplete delivery information</li>
                </ul>
                <p className="mb-4">
                  We will make reasonable efforts to notify you of any
                  significant delays and provide updated delivery estimates.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  8. Address Changes
                </h2>
                <p className="mb-4">
                  If you need to change your delivery address after placing an
                  order, please contact our customer service team as soon as
                  possible. We will attempt to accommodate your request if the
                  order has not been shipped. Once an order has been shipped, we
                  may not be able to change the delivery address.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">9. Order Pickup</h2>
                <p className="mb-4">
                  For some products, we offer the option to pick up your order
                  from our store. When selecting this option:
                </p>
                <ul className="list-disc pl-8 mb-4">
                  <li>
                    You will receive a notification when your order is ready for
                    pickup
                  </li>
                  <li>
                    You must bring a valid photo ID and the order confirmation
                  </li>
                  <li>
                    Orders not picked up within 7 days may be canceled and
                    refunded
                  </li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  10. Large or Heavy Items
                </h2>
                <p className="mb-4">
                  For large or heavy items, additional delivery charges may
                  apply, and delivery may take longer. Our team will contact you
                  to schedule a convenient delivery time for such items.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  11. Installation Services
                </h2>
                <p className="mb-4">
                  For certain products that require installation, we offer
                  installation services at an additional cost. Installation
                  services can be added during checkout or arranged after
                  delivery by contacting our customer service team.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">12. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about our Shipping & Delivery
                  Policy, please contact us:
                </p>
                <p className="mb-4">
                  Email: shipping@yourdomain.com
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
                  website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingDeliveryPolicy;
