import Button from "../../components/UI/Button";
import { FiCreditCard, FiShoppingBag } from "react-icons/fi";

const CartSummary = ({ subtotal, tax, shipping, total }) => {
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
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
