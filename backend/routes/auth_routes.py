from flask import Blueprint, request, jsonify
from models.user import User
from utils.db import db
from utils.security import hash_password, check_password

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def api_signup():
    data = request.get_json(force=True)
    if not data or not data.get('email') or not data.get('name') or not data.get('role') or not data.get('password'):
        print("Signup failed: Missing required fields")
        return jsonify({"message": "Missing required fields"}), 400
    if User.query.filter_by(email=data['email']).first():
        print("Signup failed: User with this email already exists")
        return jsonify({"message": "User with this email already exists"}), 409
    try:
        new_user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            class_id=data.get('class_id'),
            password=hash_password(data['password']) # Hash the password
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"Signup success: User {new_user.email} registered.")
        return jsonify(new_user.to_json()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Signup failed: {e}")
        return jsonify({"message": "Signup failed", "error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def api_login():
    print("Login is called")
    data = request.get_json(force=True)
    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        print("Login failed: Missing required fields")
        return jsonify({"message": "Missing required fields"}), 400
    
    user_obj = User.query.filter_by(email=data['email'], role=data['role']).first()
    
    # Check if user exists and if the provided password matches the stored hash
    if not user_obj or not check_password(data['password'], user_obj.password):
        print("Login failed: Invalid credentials or role")
        return jsonify({"message": "Invalid credentials or role"}), 401
    
    print(f"Login success: User {user_obj.email} logged in.")
    return jsonify(user_obj.to_json()), 200