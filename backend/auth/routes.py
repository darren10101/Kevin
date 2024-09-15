from flask import Blueprint, request, jsonify, session
import pyrebase
from settings import Settings

auth_routes = Blueprint('auth', __name__)
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

@auth_routes.route('/signup', methods=['POST'])
def signup():
    email = request.json['email']
    password = request.json['password']
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return jsonify({"message": "User created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_routes.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        session['user'] = user['idToken']
        return jsonify({"message": "Logged in successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
