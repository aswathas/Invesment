from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
import re
import requests
import random

app = Flask(__name__)

# Enable CORS and allow requests from your frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Groq API setup as before
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

# News API setup
NEWS_API_KEY = "657b17a81d714a92bd42478d75493457"
NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything"

def get_llm_response(prompt):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama3-8b-8192"
    )
    return chat_completion.choices[0].message.content

def get_simple_sentiment(sentiment_text):
    sentiment_text = sentiment_text.lower()
    if "bullish" in sentiment_text or "positive" in sentiment_text or "optimistic" in sentiment_text:
        return "Bullish"
    elif "bearish" in sentiment_text or "negative" in sentiment_text or "pessimistic" in sentiment_text:
        return "Bearish"
    else:
        return "Neutral"

def get_news_sentiment(stock_name):
    try:
        params = {
            "q": stock_name,
            "apiKey": NEWS_API_KEY,
            "language": "en",
            "sortBy": "relevancy"
        }
        response = requests.get(NEWS_API_ENDPOINT, params=params)
        response.raise_for_status()
        articles = response.json().get("articles", [])

        if not articles:
            # Use Groq to get sentiment if no news articles are found
            sentiment_prompt = f"Provide a sentiment analysis for the stock {stock_name}."
            detailed_sentiment = get_llm_response(sentiment_prompt)
            return get_simple_sentiment(detailed_sentiment)

        # Simple sentiment analysis: count positive vs negative mentions
        positive_keywords = ["gain", "rise", "profit", "positive", "growth"]
        negative_keywords = ["loss", "drop", "decline", "negative", "fall"]
        sentiment_score = 0

        for article in articles:
            content = article.get("title", "") + " " + article.get("description", "")
            content = content.lower()
            
            for word in positive_keywords:
                if word in content:
                    sentiment_score += 1
            for word in negative_keywords:
                if word in content:
                    sentiment_score -= 1

        if sentiment_score > 0:
            return "Bullish"
        elif sentiment_score < 0:
            return "Bearish"
        else:
            return "Neutral"

    except Exception as e:
        return f"Error fetching sentiment: {str(e)}"

def get_stock_future_performance(stock_name):
    # Simulate future performance score for each stock
    # In a real implementation, you would fetch this data from a financial API
    return random.uniform(0.5, 2.0)  # Example: Returns a value between 0.5 (poor) to 2.0 (excellent)

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
    stock = request.json.get('stock')
    if not stock:
        return jsonify({"error": "Stock symbol is required"}), 400
    
    sentiment = get_news_sentiment(stock)
    return jsonify(sentiment=sentiment)

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    theme = request.json.get('theme')
    investment_amount = request.json.get('investment_amount', 0)
    
    recommendation_prompt = f"Recommend top stocks for the {theme} sector in the Indian market."
    recommendation = get_llm_response(recommendation_prompt)
    
    # Extract stock names from the response using regex
    stock_names = re.findall(r'\*\*([^\*]+)\*\*', recommendation)
    
    # Get sentiment and future performance for each stock
    stock_data = []
    total_performance_score = 0
    for stock in stock_names:
        sentiment = get_news_sentiment(stock)
        future_performance = get_stock_future_performance(stock)
        total_performance_score += future_performance
        stock_data.append({
            "stock": stock,
            "sentiment": sentiment,
            "future_performance": future_performance
        })
    
    # Calculate weighting based on future performance
    if total_performance_score > 0:
        for stock in stock_data:
            stock["weight"] = (stock["future_performance"] / total_performance_score) * 100
            stock["allocation"] = (stock["weight"] / 100) * investment_amount if investment_amount > 0 else "N/A"
            stock["weight"] = f"{stock['weight']:.2f}%"
            stock["allocation"] = f"₹{stock['allocation']:.2f}" if investment_amount > 0 else "N/A"
    
    return jsonify(recommendation=stock_data)

if __name__ == '__main__':
    app.run(debug=True)