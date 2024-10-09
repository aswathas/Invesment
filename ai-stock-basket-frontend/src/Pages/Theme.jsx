import { useState } from "react";

function ThemeRecommendations({ theme }) {
  const [recommendation, setRecommendation] = useState("");

  const fetchRecommendations = async () => {
    const response = await fetch("/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    const data = await response.json();
    setRecommendation(data.recommendation);
  };

  return (
    <div>
      <h2>{theme} Stock Recommendations</h2>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <p>{recommendation}</p>
    </div>
  );
}

export default ThemeRecommendations;
