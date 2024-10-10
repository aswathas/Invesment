import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import Recommendations from "./Pages/Recommendations";
import SavedPortfolios from "./Pages/SavedPortfolios";
import AboutUs from "./Pages/AboutUs";
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/saved-portfolios" element={<SavedPortfolios />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </main>
      </motion.div>
    </Router>
  );
}

export default App;
