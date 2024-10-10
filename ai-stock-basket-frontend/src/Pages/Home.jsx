import React from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaHandHoldingUsd,
  FaChartPie,
  FaHome,
  FaBitcoin,
  FaExchangeAlt,
  FaRocket,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const categories = [
  { name: "Stocks", icon: FaChartLine },
  { name: "Bonds", icon: FaHandHoldingUsd },
  { name: "Mutual Funds", icon: FaChartPie },
  { name: "Real Estate", icon: FaHome },
  { name: "Cryptocurrency", icon: FaBitcoin },
  { name: "ETFs", icon: FaExchangeAlt },
];

const features = [
  {
    name: "AI-Powered Insights",
    icon: FaRocket,
    description:
      "Get cutting-edge investment recommendations powered by advanced AI algorithms.",
  },
  {
    name: "Real-time Analytics",
    icon: FaChartBar,
    description:
      "Track your investments with real-time data and comprehensive analytics.",
  },
  {
    name: "Secure Transactions",
    icon: FaShieldAlt,
    description:
      "Rest easy with our bank-level security measures protecting your investments.",
  },
];

const testimonials = [
  {
    name: "John Doe",
    role: "Investor",
    quote:
      "Money Heist revolutionized my investment strategy. I've seen a 30% increase in my portfolio!",
  },
  {
    name: "Jane Smith",
    role: "Financial Advisor",
    quote:
      "This app provides insights that used to take me hours to compile. It s a game-changer.",
  },
];

const riskAnalysis = [
  {
    risk: "Market Volatility",
    mitigation: "Diversification across multiple asset classes",
  },
  {
    risk: "Economic Downturns",
    mitigation: "Allocation to defensive sectors and bonds",
  },
  { risk: "Inflation", mitigation: "Investment in real assets and TIPS" },
  {
    risk: "Geopolitical Events",
    mitigation: "Global diversification and regular rebalancing",
  },
];

const portfolioData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Portfolio Value",
      data: [10000, 11000, 10500, 12000, 12500, 13000],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50 to-blue-100"
    >
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Money Heist
        </h1>
        <p className="text-xl text-gray-600">
          Discover and manage your perfect investment portfolio.
        </p>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <motion.div
              className="p-6"
              whileHover={{
                backgroundColor: ["#ffffff", "#e6f7ff", "#ffe6e6"],
                transition: { duration: 0.3 },
              }}
            >
              <category.icon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600">
                Explore opportunities in {category.name.toLowerCase()} and grow
                your wealth.
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Portfolio Performance Graph */}
      <motion.div
        className="w-full max-w-4xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Portfolio Performance
        </h2>
        <Line data={portfolioData} />
      </motion.div>

      {/* Risk Analysis Table */}
      <motion.div
        className="w-full max-w-4xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Risk Analysis
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mitigation Strategy
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {riskAnalysis.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.risk}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.mitigation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="w-full max-w-6xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <feature.icon className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="w-full max-w-4xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="w-full max-w-4xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Investing?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join Money Heist today and take control of your financial future.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
        >
          Get Started Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
