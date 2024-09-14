from flask import Flask, request, jsonify, session
import pyrebase
from settings import Settings
from auth.routes import auth_routes

app = Flask(__name__)

settings = Settings()
firebase_config = {
    "apiKey": settings.firebase_credentials.apiKey,
    "authDomain": settings.firebase_credentials.authDomain,
    "projectId": settings.firebase_credentials.projectId,
    "storageBucket": settings.firebase_credentials.storageBucket,
    "messagingSenderId": settings.firebase_credentials.messagingSenderId,
    "appId": settings.firebase_credentials.appId,
    "databaseURL": settings.firebase_credentials.databaseURL
}
firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()
db = firebase.database()

@app.route('/')
def index():
    return "I'm Kevin!"

app.register_blueprint(auth_routes, url_prefix='/auth')
