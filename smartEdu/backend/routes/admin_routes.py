from flask import Blueprint, jsonify, request
from utils.db import db
from models.user import User
from models.class_model import Class
from utils.auth_middleware import requires_auth, requires_role

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/signup', methods=['POST'])
def signup():
    """Public endpoint to register a new user."""
    data = request.json
    if not data or not data.get('email') or not data.get('name') or not data.get('role') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User with this email already exists"}), 409

    new_user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        class_id=data.get('class_id'),
        # NOTE: You should hash the password in production
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_json()), 201

@admin_bp.route('/users', methods=['GET'])
@requires_auth
@requires_role('admin')
def get_users():
    """Get all users."""
    try:
        users = User.query.all()
        return jsonify([user.to_json() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users', methods=['POST'])
@requires_auth
@requires_role('admin')
def create_user():
    """Create a new user."""
    data = request.json
    if not data or not data.get('email') or not data.get('name') or not data.get('role'):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User with this email already exists"}), 409
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        class_id=data.get('class_id'),
        password=data.get('password', '')
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_json()), 201

@admin_bp.route('/classes', methods=['GET'])
@requires_auth
@requires_role('admin')
def get_classes():
    """Get all classes."""
    classes = Class.query.all()
    return jsonify([c.to_json() for c in classes]), 200

@admin_bp.route('/classes', methods=['POST'])
@requires_auth
@requires_role('admin')
def create_class():
    """Create a new class."""
    data = request.json
    if not data or not data.get('name'):
        return jsonify({"error": "Missing class name"}), 400

    new_class = Class(
        name=data['name'],
        teacher_id=data.get('teacher_id'),
        timetable=data.get('timetable', {})
    )
    db.session.add(new_class)
    db.session.commit()
    
    return jsonify(new_class.to_json()), 201

@admin_bp.route('/analytics/summary', methods=['GET'])
@requires_auth
@requires_role('admin')
def get_analytics_summary():
    """Get high-level analytics."""
    # Placeholder data
    summary = {
        "total_students": User.query.filter_by(role='student').count(),
        "total_teachers": User.query.filter_by(role='teacher').count(),
        "total_classes": Class.query.count(),
        "overall_attendance_today": "92%" # Mocked
    }
    return jsonify(summary), 200