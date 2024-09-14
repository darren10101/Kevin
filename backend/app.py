from flask import Flask, request, jsonify, session
from flask_cors import CORS
from settings import Settings
from user.routes import user_routes
from llm.routes import groq_routes

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "I'm Kevin!"

app.register_blueprint(user_routes, url_prefix='/user')
app.register_blueprint(groq_routes, url_prefix='/llm')