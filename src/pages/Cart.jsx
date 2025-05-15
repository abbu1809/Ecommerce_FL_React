import  { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
} from "react-icons/fi";
import Button from "../components/UI/Button";
import { ROUTES } from "../utils/constants";

const Cart = () => {
  // In a real app, this would come from a context or store
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Samsung Galaxy S25 Edge",
      price: 84999,
      image: "https://via.placeholder.com/150x150?text=Samsung+S25",
      quantity: 1,
    },
    {
      id: 3,
      name: "Xiaomi Redmi Note 13 Pro",
      price: 26999,
      image: "https://via.placeholder.com/150x150?text=Redmi+Note+13",
      quantity: 2,
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 99) : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to={ROUTES.HOME} className="hover:text-orange-500">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Shopping Cart</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiShoppingBag className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button
                variant="primary"
                fullWidth={false}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-contain rounded"
                            />
                            <div className="ml-4">
                              <Link
                                to={`/products/${item.id}`}
                                className="font-medium text-gray-800 hover:text-orange-500"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-gray-600 focus:outline-none p-1"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="mx-2 text-gray-700 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-gray-600 focus:outline-none p-1"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-800 font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-6">
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-flex items-center text-orange-500"
                >
                  <FiArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping}` : "Free"}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">or checkout with</p>
                    <div className="flex justify-center space-x-4 mt-2">
                      <button className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-gray-800 font-medium text-sm">
                        GPay
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-gray-800 font-medium text-sm">
                        PayPal
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Have a Promo Code?
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-md text-gray-800 font-medium">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
