from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
import re
import requests
import random
import datetime
import numpy as np
import sqlite3
import logging

app = Flask(__name__)

# Enable CORS and allow requests from your frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Groq API setup as before
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

# News API setup
NEWS_API_KEY = "9f395191ad33418590214c9afc835e32"
NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything"

# Alpha Vantage API setup
ALPHA_VANTAGE_API_KEY = "HMYVFEUS7YF39YJ1"
ALPHA_VANTAGE_ENDPOINT = "https://www.alphavantage.co/query"

# Set up logging
logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

# Initialize SQLite Database
def init_db():
    conn = sqlite3.connect('portfolios.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS portfolios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            portfolio TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Utility functions
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
            sentiment_prompt = f"Provide a sentiment analysis for the stock {stock_name}."
            detailed_sentiment = get_llm_response(sentiment_prompt)
            return get_simple_sentiment(detailed_sentiment)

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

def validate_stock(stock_name):
    validation_prompt = f"Is '{stock_name}' a valid stock in the Indian market? Provide a simple Yes or No answer."
    validation_response = get_llm_response(validation_prompt).strip().lower()
    return validation_response == "yes"

def get_stock_future_performance(stock_name):
    return random.uniform(0.5, 2.0)  # Simulate future performance

def get_realtime_stock_price(stock_name):
    try:
        params = {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": stock_name,
            "interval": "5min",
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        response = requests.get(ALPHA_VANTAGE_ENDPOINT, params=params)
        response.raise_for_status()
        data = response.json()

        if "Time Series (5min)" in data:
            latest_timestamp = sorted(data["Time Series (5min)"].keys(), reverse=True)[0]
            latest_data = data["Time Series (5min)"][latest_timestamp]
            current_price = float(latest_data["4. close"])
            return current_price
        else:
            return "No data available for the given stock."

    except Exception as e:
        return f"Error fetching stock price: {str(e)}"

def calculate_minimum_investment(stock_data):
    return len(stock_data) * 1000

# API Routes
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
    
    stock_names = re.findall(r'\*\*([^\*]+)\*\*', recommendation)
    valid_stocks = [stock for stock in stock_names if validate_stock(stock)]
    
    stock_data = []
    total_performance_score = 0
    for stock in valid_stocks:
        sentiment = get_news_sentiment(stock)
        future_performance = get_stock_future_performance(stock)
        current_price = get_realtime_stock_price(stock)
        total_performance_score += future_performance
        stock_data.append({
            "stock": stock,
            "sentiment": sentiment,
            "future_performance": future_performance,
            "current_price": f"\u20b9{current_price:.2f}" if isinstance(current_price, (int, float)) else current_price
        })
    
    if total_performance_score > 0:
        for stock in stock_data:
            stock["weight"] = (stock["future_performance"] / total_performance_score) * 100
            stock["allocation"] = (stock["weight"] / 100) * investment_amount if investment_amount > 0 else "N/A"
            stock["weight"] = f"{stock['weight']:.2f}%"
            stock["allocation"] = f"\u20b9{stock['allocation']:.2f}" if investment_amount > 0 else "N/A"
    
    minimum_investment = calculate_minimum_investment(stock_data)
    recommended_investment = minimum_investment * 5
    
    return jsonify(
        recommendation=stock_data,
        minimum_investment=f"\u20b9{minimum_investment}",
        recommended_investment=f"\u20b9{recommended_investment}"
    )

@app.route('/save_portfolio', methods=['POST'])
def save_portfolio():
    portfolio = request.json.get('portfolio')
    user_id = request.json.get('user_id')

    if not portfolio or not user_id:
        return jsonify({"error": "Portfolio and user ID are required"}), 400

    portfolio_str = str(portfolio)
    conn = sqlite3.connect('portfolios.db')
    c = conn.cursor()
    c.execute('INSERT INTO portfolios (user_id, portfolio) VALUES (?, ?)', (user_id, portfolio_str))
    conn.commit()
    conn.close()

    return jsonify({"message": "Portfolio saved successfully!"})

@app.route('/saved_portfolios', methods=['GET'])
def get_saved_portfolios():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    conn = sqlite3.connect('portfolios.db')
    c = conn.cursor()
    c.execute('SELECT portfolio, timestamp FROM portfolios WHERE user_id = ?', (user_id,))
    rows = c.fetchall()
    conn.close()

    portfolios = [{"portfolio": eval(row[0]), "timestamp": row[1]} for row in rows]
    return jsonify({"portfolios": portfolios})

@app.route('/future_prediction', methods=['POST'])
def future_prediction():
    portfolio = request.json.get('portfolio')
    if not portfolio:
        return jsonify({"error": "Portfolio is required"}), 400

    num_days = 30
    start_date = datetime.datetime.now()
    dates = [(start_date + datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(num_days)]
    nav_values = [100]

    for i in range(1, num_days):
        daily_growth = sum([random.uniform(-0.01, 0.02) * stock['future_performance'] for stock in portfolio])
        nav_values.append(nav_values[-1] * (1 + daily_growth))

    return jsonify({
        "dates": dates,
        "nav_values": nav_values
    })

if __name__ == '__main__':
    app.run(debug=True)
