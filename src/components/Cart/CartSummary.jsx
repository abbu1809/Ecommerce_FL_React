import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { FiCheck, FiTag, FiCreditCard, FiShoppingBag } from "react-icons/fi";

const CartSummary = ({ subtotal, tax, shipping, total }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setTimeout(() => setPromoApplied(false), 3000);
    }
  };

  return (
    <div className="lg:col-span-1 sticky top-4">
      <div
        className="bg-white rounded-xl p-6 overflow-hidden"
        style={{
          boxShadow: "var(--shadow-medium)",
          borderTop: "4px solid var(--brand-primary)",
        }}
      >
        <h2
          className="text-xl font-bold mb-6 pb-4 border-b flex items-center"
          style={{
            color: "var(--text-primary)",
            borderColor: "var(--border-primary)",
          }}
        >
          <FiShoppingBag
            className="mr-2"
            style={{ color: "var(--brand-primary)" }}
          />
          Order Summary
        </h2>

        <div className="space-y-5">
          <div className="flex justify-between items-center py-1">
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Subtotal
            </span>
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              ₹{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              GST (18%)
            </span>
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              ₹{tax.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Shipping
            </span>
            <span
              className="font-medium"
              style={
                shipping === 0
                  ? { color: "var(--success-color)" }
                  : { color: "var(--text-primary)" }
              }
            >
              {shipping > 0 ? `₹${shipping.toLocaleString()}` : "Free"}
            </span>
          </div>

          <div
            className="h-px my-3"
            style={{ background: "var(--border-primary)" }}
          ></div>

          <div className="flex justify-between items-center py-2">
            <span
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Total
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className="mt-8 p-5 rounded-xl"
          style={{
            background: "var(--bg-accent-light)",
            boxShadow: "var(--shadow-small)",
          }}
        >
          <h3
            className="font-semibold mb-3 flex items-center"
            style={{ color: "var(--text-primary)" }}
          >
            <FiTag className="mr-2" style={{ color: "var(--brand-primary)" }} />
            Have a Promo Code?
          </h3>
          <div className="flex">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-4 py-2.5 rounded-l-lg focus:outline-none text-sm"
              style={{
                border: "1px solid var(--border-primary)",
                borderRight: "none",
                backgroundColor: "var(--bg-primary)",
              }}
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2.5 rounded-r-lg font-medium transition-all duration-300 flex items-center"
              style={{
                background: promoApplied
                  ? "var(--success-color)"
                  : "var(--brand-primary)",
                color: "var(--text-on-brand)",
                boxShadow: "var(--shadow-small)",
              }}
            >
              {promoApplied ? (
                <>
                  <FiCheck className="mr-1" /> Applied
                </>
              ) : (
                "Apply"
              )}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Button
            className="text-base py-3.5 transition-all duration-300 transform hover:translate-y-[-2px] rounded-lg font-medium"
            style={{
              background: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <FiCreditCard className="mr-2" /> Proceed to Checkout
          </Button>

          <div className="mt-6">
            <p
              className="text-center mb-4 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              or checkout with
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="rounded-lg px-6 py-2.5 font-medium text-sm transition-all duration-300 flex items-center justify-center"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-small)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                GPay
              </button>
              <button
                className="rounded-lg px-6 py-2.5 font-medium text-sm transition-all duration-300 flex items-center justify-center"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-small)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                PayPal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
