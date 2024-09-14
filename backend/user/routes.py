from flask import Blueprint, request, jsonify, session
import pyrebase
from settings import Settings

user_routes = Blueprint('auth', __name__)
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

@user_routes.route('/login', methods=['POST'])
def login():
    id_token = request.json.get('idToken')
    try:
        token = auth.create_custom_token(id_token)
        user = auth.sign_in_with_custom_token(token)
        print(user)
        uid = user['users'][0]['localId']
        session['user'] = uid
        return jsonify({'message': 'User logged in successfully'}), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401

@user_routes.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'User logged out successfully'}), 200

@user_routes.route('/get-programs', methods=['GET'])
def protected():
    if 'user' in session:
        uid = session['user']
        try:
            programs = db.child("programs").order_by_child("user_id").equal_to(uid).get().val()
            return jsonify(programs), 200
        except Exception as e:
            return jsonify({'message': 'Error getting programs', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401

@user_routes.route('/create-program', methods=['POST'])
def create_program():
    if 'user' in session:
        uid = session['user']
        program = request.json
        program['user_id'] = uid
        try:
            db.child("programs").push(program)
            return jsonify({'message': 'Program created successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Error creating program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401

@user_routes.route('/delete-program', methods=['POST'])
def delete_program():
    if 'user' in session:
        uid = session['user']
        program_id = request.json.get('program_id')
        try:
            db.child("programs").child(program_id).remove()
            return jsonify({'message': 'Program deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Error deleting program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401
    
@user_routes.route('/update-program', methods=['POST'])
def update_program():
    if 'user' in session:
        uid = session['user']
        program = request.json
        program_id = program.get('program_id')
        try:
            db.child("programs").child(program_id).update(program)
            return jsonify({'message': 'Program updated successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Error updating program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401
    
