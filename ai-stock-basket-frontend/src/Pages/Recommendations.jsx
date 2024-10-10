import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line, Pie } from "react-chartjs-2";
import { Tabs, Tab } from "@mui/material";

function Recommendations() {
  const [theme, setTheme] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navData, setNavData] = useState({ dates: [], nav_values: [] });
  const [userId, setUserId] = useState("user123"); // Dummy user ID for now
  const [selectedTab, setSelectedTab] = useState(0);

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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setStocks(data.recommendation);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (stocks.length === 0) {
      alert("No portfolio to save");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/save_portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          portfolio: stocks,
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const getFuturePrediction = async () => {
    if (stocks.length === 0) {
      alert("No portfolio found for prediction");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/future_prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolio: stocks }),
      });
      const data = await response.json();
      setNavData(data);
    } catch (error) {
      console.error("Error fetching future prediction:", error);
    }
  };

  const executeOrder = async () => {
    try {
      const response = await fetch("http://localhost:5001/execute_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert("Order execution completed. Check console for details.");
    } catch (error) {
      console.error("Error executing order:", error);
      alert("Failed to execute order.");
    }
  };

  useEffect(() => {
    // Fetch saved portfolios if needed
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Future NAV Prediction",
      },
    },
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="recommendations-container bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Recommendations</h1>
      <input
        type="text"
        placeholder="Enter investment theme (e.g., Green Energy)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="p-2 mb-4 w-full bg-gray-800 text-white rounded"
      />
      <input
        type="number"
        placeholder="Enter investment amount (e.g., 500000)"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        className="p-2 mb-4 w-full bg-gray-800 text-white rounded"
      />
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={getRecommendations}
          className="p-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
        >
          Get Recommendations
        </button>
        <button
          onClick={savePortfolio}
          className="p-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold rounded"
        >
          Save Portfolio
        </button>
        <button
          onClick={getFuturePrediction}
          className="p-2 w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded"
        >
          Get Future Prediction
        </button>
        <button
          onClick={executeOrder}
          className="p-2 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold rounded"
        >
          Execute Order
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="About" />
            <Tab label="Stock Split (Pie Chart)" />
            <Tab label="Financial Metrics (Table)" />
          </Tabs>

          {selectedTab === 0 && (
            <div className="about-section mt-6">
              <h2 className="text-2xl font-semibold mb-4">About this Basket</h2>
              <p>
                This portfolio contains stocks selected based on the theme "
                {theme}". It aims to maximize returns by focusing on companies
                leading in this sector. The allocation is designed to balance
                risk and reward while ensuring diversification.
              </p>
            </div>
          )}

          {selectedTab === 1 && (
            <div className="stock-split-chart mt-6">
              <h2 className="text-2xl font-semibold mb-4">Stock Split</h2>
              <Pie
                data={{
                  labels: stocks.map((stock) => stock.stock),
                  datasets: [
                    {
                      data: stocks.map((stock) =>
                        parseFloat(stock.allocation.replace(/[^0-9.-]+/g, ""))
                      ),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: true,
                      text: "Portfolio Allocation",
                    },
                  },
                }}
              />
            </div>
          )}

          {selectedTab === 2 && (
            <div className="financial-metrics-table mt-6">
              <h2 className="text-2xl font-semibold mb-4">Financial Metrics</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-700 p-2">Stock</th>
                    <th className="border border-gray-700 p-2">
                      Current Price
                    </th>
                    <th className="border border-gray-700 p-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-700 p-2">
                        {item.stock}
                      </td>
                      <td className="border border-gray-700 p-2">
                        {item.current_price}
                      </td>
                      <td className="border border-gray-700 p-2">
                        {item.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {navData.dates.length > 0 && (
        <div className="nav-chart mt-6">
          <h2 className="text-2xl font-semibold mb-4">Future NAV Prediction</h2>
          <Line
            data={{
              labels: navData.dates,
              datasets: [
                {
                  label: "NAV Value",
                  data: navData.nav_values,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      )}
    </div>
  );
}

export default Recommendations;
