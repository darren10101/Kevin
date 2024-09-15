from flask import Flask, request, jsonify, session
from flask_cors import CORS
from settings import Settings
from user.routes import user_routes
from llm.routes import groq_routes
from tts.routes import tts_routes

app = Flask(__name__)
app.secret_key = 'welovekevin'
CORS(app, supports_credentials=True)

@app.route('/')
def index():
    return "I'm Kevin!"

app.register_blueprint(user_routes, url_prefix='/user')
app.register_blueprint(groq_routes, url_prefix='/llm')
app.register_blueprint(tts_routes, url_prefix='/tts')