from logzero import logger
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)  # Enable CORS to avoid CORS issues with frontend

backend_url = "http://localhost:5000/recommendations"  # Replace with the actual backend URL

# Polygon.io API setup
polygon_api_key = "1rKKD9xqzp0QYpcW8wQ1q7CEAgXpKXBh"
polygon_base_url = "https://api.polygon.io/v2"

# Redirect endpoint to handle OAuth flow
@app.route('/redirect', methods=['GET'])
def handle_redirect():
    return jsonify({"message": "Mock redirect handled successfully"}), 200

@app.route('/execute_order', methods=['POST'])
def execute_order():
    # Step 1: Fetch the basket of stocks from the backend
    try:
        logger.info("Fetching basket of stocks from backend...")
        response = requests.post(backend_url, json={"theme": "green energy", "investment_amount": 100000})  # Example request
        response.raise_for_status()
        basket_of_stocks = response.json().get("recommendation", [])
        logger.info(f"Fetched basket of stocks: {basket_of_stocks}")
    except Exception as e:
        logger.error(f"Failed to fetch basket of stocks: {str(e)}")
        return jsonify({"error": f"Failed to fetch basket of stocks: {str(e)}"}), 500

    # Step 2: Mock placing orders using Polygon.io API data
    order_results = []
    for stock in basket_of_stocks:
        try:
            logger.info(f"Mock placing order for stock: {stock}")
            # Using Polygon.io to get the latest price as a reference
            stock_symbol = stock["stock"]
            price_url = f"{polygon_base_url}/aggs/ticker/{stock_symbol}/prev?adjusted=true&apiKey={polygon_api_key}"
            price_response = requests.get(price_url)
            price_response.raise_for_status()
            price_data = price_response.json()
            if "results" in price_data and len(price_data["results"]) > 0:
                latest_price = price_data["results"][0]["c"]  # Close price from the previous day
                logger.info(f"Latest price for {stock_symbol} is {latest_price}")
            else:
                latest_price = "N/A"
                logger.warning(f"No price data available for {stock_symbol}")

            order_id = f"MOCK_ORDER_{random.randint(1000, 9999)}"
            logger.info(f"Mock order placed successfully for {stock_symbol}. Order ID: {order_id}")
            order_results.append({"stock": stock_symbol, "order_id": order_id, "status": "success", "price": latest_price})
        except Exception as e:
            logger.error(f"Order placement failed for {stock['stock']}: {str(e)}")
            order_results.append({"stock": stock["stock"], "status": "failed", "error": str(e)})

    return jsonify(order_results)

if __name__ == '__main__':
    app.run(debug=True, port=5001)