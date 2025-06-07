import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../utils/constants";

const EmptyCart = () => {
  return (
    <div
      className="bg-white rounded-xl p-10 text-center transition-all duration-300 hover:shadow-lg"
      style={{
        boxShadow: "var(--shadow-medium)",
        background:
          "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))",
      }}
    >
      <div
        className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-7 animate-pulse"
        style={{
          background: "var(--bg-accent-light)",
          boxShadow: "var(--shadow-medium)",
        }}
      >
        <FiShoppingBag
          className="h-12 w-12"
          style={{ color: "var(--brand-primary)" }}
        />
      </div>
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Your cart is empty
      </h2>
      <p
        className="mb-8 max-w-md mx-auto text-base"
        style={{ color: "var(--text-secondary)" }}
      >
        Looks like you haven't added any products to your cart yet. Start
        shopping to fill it with amazing products!
      </p>
      <Link to={ROUTES.PRODUCTS} className="inline-block">
        <Button
          variant="primary"
          fullWidth={false}
          className="px-8 py-3.5 text-base group flex items-center transition-all duration-300 transform hover:translate-y-[-3px]"
          style={{
            background: "var(--brand-primary)",
            color: "var(--text-on-brand)",
            boxShadow: "var(--shadow-medium)",
            borderRadius: "1rem",
          }}
        >
          Browse Products
          <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
