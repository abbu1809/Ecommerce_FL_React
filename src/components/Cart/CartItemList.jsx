import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ROUTES } from "../../utils/constants";
import CartItem from "./CartItem";

const CartItemList = ({ cartItems, updateQuantity, removeItem }) => {
  return (
    <div className="lg:col-span-2">
      <div
        className="bg-white rounded-xl overflow-hidden mb-7"
        style={{
          boxShadow: "var(--shadow-medium)",
          borderLeft: "4px solid var(--brand-primary)",
        }}
      >
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <h2
            className="text-xl font-bold flex items-center"
            style={{ color: "var(--text-primary)" }}
          >
            Cart Items
            <span
              className="ml-2 px-2.5 py-1 text-sm rounded-full"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              {cartItems.length}
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full">
            <thead>
              <tr
                className="text-left"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <th
                  className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Product
                </th>
                <th
                  className="py-4 px-5 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Quantity
                </th>
                <th
                  className="py-4 px-5 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Amount
                </th>
                <th
                  className="py-4 px-5 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center px-5 py-3 rounded-lg transition-all duration-300 font-medium text-sm hover:translate-x-[-5px]"
          style={{
            color: "var(--brand-primary)",
            backgroundColor: "var(--bg-accent-light)",
          }}
        >
          <FiArrowLeft className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartItemList;
