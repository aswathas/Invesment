import React, { useState } from "react";

function Recommendations() {
  const [theme, setTheme] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!theme) {
      alert("Please enter a theme");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          investment_amount: parseFloat(investmentAmount) || 0,
        }),
      });
      const data = await response.json();
      setStocks(data.recommendation);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="recommendations-container"
      style={{ backgroundColor: "#ffffff", color: "#000000", padding: "20px" }}
    >
      <h1>Stock Recommendations</h1>
      <input
        type="text"
        placeholder="Enter investment theme (e.g., Green Energy)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "80%" }}
      />
      <input
        type="number"
        placeholder="Enter investment amount (e.g., 500000)"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "80%" }}
      />
      <button
        onClick={getRecommendations}
        style={{ padding: "10px", margin: "10px", width: "40%" }}
      >
        Get Recommendations
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="stocks-list">
          {stocks.map((item, index) => (
            <div
              key={index}
              className="stock-card"
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                margin: "10px",
                borderRadius: "5px",
              }}
            >
              <h2>{item.stock}</h2>
              <p>Sentiment: {item.sentiment}</p>
              <p>Weight: {item.weight}</p>
              <p>Allocation: {item.allocation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
