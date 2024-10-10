import { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";
import "chart.js/auto";

Modal.setAppElement("#root");

function SavedPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const userId = "user123"; // Replace with actual user ID

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/saved_portfolios?user_id=${userId}`
        );
        const data = await response.json();
        setPortfolios(data.portfolios);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    };
    fetchPortfolios();
  }, []);

  const openModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const closeModal = () => {
    setSelectedPortfolio(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateNetWorth = () => {
    return portfolios.reduce((total, portfolio) => {
      return (
        total +
        portfolio.portfolio.reduce((sum, stock) => {
          return sum + stock.current_price * stock.weight;
        }, 0)
      );
    }, 0);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-500">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-4xl font-bold text-gray-900 dark:text-white flex items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaMoneyBillWave className="mr-2" /> Net Worth
          </motion.h1>
          <button
            onClick={toggleDarkMode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Total Net Worth: ${calculateNetWorth().toFixed(2)}
          </h2>
        </div>
        {portfolios.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No saved portfolios found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-red-500 cursor-pointer"
                onClick={() => openModal(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Portfolio {index + 1}
                </h2>
                <img
                  src={`https://via.placeholder.com/150?text=Portfolio+${
                    index + 1
                  }`}
                  alt={`Portfolio ${index + 1}`}
                  className="rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        )}

        {selectedPortfolio && (
          <Modal
            isOpen={!!selectedPortfolio}
            onRequestClose={closeModal}
            contentLabel="Portfolio Details"
            className="bg-gray-900 text-white p-4 rounded-lg max-w-4xl mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Portfolio Details</h2>
              <div className="space-y-4">
                {selectedPortfolio.portfolio.map((stock, idx) => (
                  <div key={idx} className="border-b border-gray-700 pb-4">
                    <h3 className="text-lg font-semibold">{stock.stock}</h3>
                    <p>Weight: {stock.weight}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={closeModal}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </motion.div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default SavedPortfolios;
