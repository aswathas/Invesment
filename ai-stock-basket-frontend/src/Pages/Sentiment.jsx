import React, { useState } from "react";

function SentimentChecker() {
  const [stock, setStock] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [error, setError] = useState("");

  const checkSentiment = async () => {
    try {
      const response = await fetch("http://localhost:5000/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // This can throw an error if response is empty
      if (data.sentiment) {
        setSentiment(data.sentiment);
        setError("");
      } else {
        setError(data.error || "An unknown error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch sentiment. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Enter stock symbol"
      />
      <button onClick={checkSentiment}>Check Sentiment</button>
      {sentiment && <p>Sentiment: {sentiment}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SentimentChecker;
