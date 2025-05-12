// This file is kept for reference but is no longer the entry point
// Routing is now handled through src/routes/index.jsx and rendered directly in main.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiShoppingBag } from "react-icons/fi";

function App() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        Ecommerce App
      </motion.h1>
      <motion.p
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        This component is no longer used directly. The application now uses
        React Router.
      </motion.p>
      <div className="space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <FiHome /> <span>Go to Home</span>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/products"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <FiShoppingBag /> <span>View Products</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default App;
