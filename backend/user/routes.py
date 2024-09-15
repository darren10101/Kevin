from flask import Blueprint, request, jsonify, session
import pyrebase
from settings import Settings
from flask_cors import cross_origin

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
    email = request.json.get('email')
    password = request.json.get('password')
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        print(user)
        uid = user['localId']
        session['user'] = uid
        return jsonify({"message": "User logged in", "token": user['idToken']}), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': 'Invalid credentials', 'error': str(e)}), 401

@user_routes.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    username = data['username']
    try:
        user = auth.create_user_with_email_and_password(email, password)
        try:
            db.child("usernames").child(user['localId']).push(username)
            return jsonify({"message": "User created successfully", "token": user['idToken']}), 200
        except Exception as e:
            print(str(e))
            return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@user_routes.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'User logged out successfully'}), 200

@user_routes.route('verify', methods=['GET'])
def verify():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        try:
            user = auth.get_account_info(token)
            return jsonify({'status': 'success', 'uid': user['users'][0]['localId']}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 401
    
    return jsonify({'message': 'No token provided'}), 401

@user_routes.route('/get-user', methods=['GET'])
def get_user():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        try:
            user = auth.get_account_info(token)
            username = db.child("usernames").child(user['users'][0]['localId']).get().val()
            return jsonify({'status': 'success', 'user': user, 'username':username}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 401
    return jsonify({'message': 'No token provided'}), 401

@user_routes.route('/get-programs', methods=['GET'])
@cross_origin()
def get_programs():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        user = auth.get_account_info(token)
        uid = user['users'][0]['localId']
        try:
            programs = db.child("programs").child(uid).get().val()
            return jsonify(programs), 200
        except Exception as e:
            return jsonify({'message': 'Error getting programs', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401

@user_routes.route('/get-program/<program_id>', methods=['GET'])
def get_program(program_id):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        user = auth.get_account_info(token)
        uid = user['users'][0]['localId']
        try:
            program = db.child("programs").child(uid).child(program_id).get().val()
            if program is None:
                return jsonify({'message': 'Program not found'}), 404
            return jsonify(program), 200
        except Exception as e:
            return jsonify({'message': 'Error getting program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401

@user_routes.route('/create-program', methods=['POST'])
def create_program():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        user = auth.get_account_info(token)
        uid = user['users'][0]['localId']
        id = 1
        try:
            last_program = db.child("programs").child(uid).order_by_key().get().val()
            print(last_program)
            id = len(last_program)
            program = {
                "user_id": uid,
                "name": "Untitled Program",
                "html": "",
                "css": "",
            }
            db.child("programs").child(uid).child(id).push(program)
            return jsonify({'message': 'Program created successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Error creating program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401

# @user_routes.route('/delete-program', methods=['POST'])
# def delete_program():
#     if 'user' in session:
#         uid = session['user']
#         program_id = request.json.get('program_id')
#         try:
#             db.child("programs").child(program_id).remove()
#             return jsonify({'message': 'Program deleted successfully'}), 200
#         except Exception as e:
#             return jsonify({'message': 'Error deleting program', 'error': str(e)}), 500
#     else:
#         return jsonify({'message': 'Unauthorized'}), 401
    
@user_routes.route('/update-program', methods=['POST'])
def update_program():
    name = request.json.get('name')
    html = request.json.get('html')
    css = request.json.get('css')
    id = request.json.get('id')
    oid = request.json.get('oid')
    print(name, html, css, id, oid)
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(' ')[1]
        user = auth.get_account_info(token)
        uid = user['users'][0]['localId']
        program = {}
        if (name):
            program['name'] = name
        if (html):
            program['html'] = html
        if (css):
            program['css'] = css
        try:
            db.child("programs").child(uid).child(id).child(oid).update(program)
            return jsonify({'message': 'Program updated successfully'}), 200
        except Exception as e:
            return jsonify({'message': 'Error updating program', 'error': str(e)}), 500
    else:
        return jsonify({'message': 'Unauthorized'}), 401
    
