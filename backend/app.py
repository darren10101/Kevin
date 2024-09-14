from flask import Flask, request, jsonify, session
import pyrebase
from settings import Settings
from auth.routes import auth_routes

app = Flask(__name__)

@app.route('/')
def index():
    return "I'm Kevin!"

app.register_blueprint(auth_routes, url_prefix='/auth')
