import React, { useState } from "react";

function Recommendations() {
  const [theme, setTheme] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const getRecommendations = async () => {
    const response = await fetch("http://localhost:5000/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });
    const data = await response.json();
    setRecommendations(data.recommendation);
  };

  return (
    <div>
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Enter theme (e.g., technology)"
      />
      <button onClick={getRecommendations}>Get Recommendations</button>
      {recommendations && <p>Recommendations: {recommendations}</p>}
    </div>
  );
}

export default Recommendations;
