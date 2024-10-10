import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";

const Navbar = () => {
  const navItems = ["Home", "Recommendations", "Saved-Portfolios", "About Us"];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <FaMoneyBillWave className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">
                Money Heist
              </span>
            </Link>
          </motion.div>
          <div className="flex">
            {navItems.map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:text-blue-600 focus:border-blue-300 transition duration-150 ease-in-out"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
