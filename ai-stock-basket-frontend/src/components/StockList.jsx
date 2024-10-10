import { useEffect, useState } from "react";

function StockList({ theme }) {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch(`/themes`)
      .then((response) => response.json())
      .then((data) => setStocks(data[theme]));
  }, [theme]);

  return (
    <div>
      <h2>Stocks in {theme} theme:</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock}>{stock}</li>
        ))}
      </ul>
    </div>
  );
}

export default StockList;
