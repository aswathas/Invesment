from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)

# Enable CORS and allow requests from your frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Groq API setup as before
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

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

@app.route('/sentiment', methods=['POST'])
def get_sentiment():
    stock = request.json.get('stock')
    if not stock:
        return jsonify({"error": "Stock symbol is required"}), 400
    
    sentiment_prompt = f"Analyze the sentiment for the stock {stock}."
    
    try:
        sentiment = get_llm_response(sentiment_prompt)
        return jsonify(sentiment=sentiment)
    except Exception as e:
        return jsonify({"error": "Error processing the sentiment request", "details": str(e)}), 500


@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    theme = request.json.get('theme')
    recommendation_prompt = f"Recommend top stocks for the {theme} sector in the Indian market."
    recommendation = get_llm_response(recommendation_prompt)
    return jsonify(recommendation=recommendation)

if __name__ == '__main__':
    app.run(debug=True)
