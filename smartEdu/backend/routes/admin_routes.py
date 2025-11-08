from datetime import datetime
from flask import Blueprint, jsonify, request
import os, time, random
from utils.db import db
from models.user import User
from models.class_model import Class
from models.student_profile import StudentProfile # This import is correct, the issue is likely path-related.
from models.subject import Subject
from utils.security import hash_password, encrypt_data
from utils.auth_middleware import requires_auth, requires_role

admin_bp = Blueprint('admin_bp', __name__)

def _generate_mock_embedding(image_path):
    """
    --- AI Model Integration Point ---
    This is a placeholder function. In a real application, you would use
    a library like face_recognition, DeepFace, or a custom model here
    to convert the image at `image_path` into a numerical vector.
    """
    print(f"Generating mock embedding for image: {image_path}")
    return [random.uniform(-1, 1) for _ in range(128)]

@admin_bp.route('/users', methods=['GET'])
@requires_auth
def get_users():
    """Get all users."""
    try:
        users = User.query.all()
        return jsonify([user.to_json() for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users', methods=['POST'])
@requires_auth
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
        password=hash_password(data.get('password', ''))
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_json()), 201

@admin_bp.route('/students', methods=['POST'])
@requires_auth
def create_student_detailed():
    """Create a new student with detailed information from the admin form."""
    # Handle multipart/form-data
    data = request.form
    required_fields = ['firstName', 'lastName', 'email', 'password', 'class_id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields like name, email, password, or class ID"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User with this email already exists"}), 409

    try:
        face_embedding = None
        photo_url = None

        if 'photo' in request.files:
            photo_file = request.files['photo']
            if photo_file.filename != '':
                # In a real app, you'd save this to a cloud storage (S3, etc.)
                # For now, we save it locally to generate the embedding.
                filename = f"{int(time.time())}_{photo_file.filename}"
                # Correctly reference the upload folder from the app's config
                upload_folder = os.path.join(os.getcwd(), 'uploads', 'class_images')
                os.makedirs(upload_folder, exist_ok=True)
                image_path = os.path.join(upload_folder, filename)
                photo_file.save(image_path)
                raw_embedding = _generate_mock_embedding(image_path)
                face_embedding = encrypt_data(raw_embedding) # Encrypt the embedding
                photo_url = f"/uploads/class_images/{filename}"

        # Step 1: Create the core User for authentication
        new_user = User(
            role='student',
            email=data['email'],
            password=hash_password(data['password']), # Hash the password
            name=f"{data.get('firstName')} {data.get('lastName')}",
            class_id=data.get('class_id')
        )
        db.session.add(new_user)
        db.session.flush() # Flush to get the new_user.id before committing

        # Step 2: Create the detailed StudentProfile
        new_profile = StudentProfile(
            user_id=new_user.id,
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            father_name=data.get('fatherName'),
            mother_name=data.get('motherName'),
            address=data.get('address'),
            # Safely convert date string to date object
            dob=datetime.strptime(data.get('dob'), '%Y-%m-%d').date() if data.get('dob') else None,
            interests=data.get('interests'),
            blood_group=data.get('bloodGroup'),
            phone=data.get('phone'),
            photo_url=photo_url,
            face_embedding=face_embedding
        )
        db.session.add(new_profile)
        db.session.commit()
        return jsonify(new_user.to_json()), 201
    except Exception as e:
        print("str",e)
        db.session.rollback()
        return jsonify({"error": "Failed to create student", "details": str(e)}), 500

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

@admin_bp.route('/analytics/summary', methods=['GET']) # Removed auth for now
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

@admin_bp.route('/classes/<int:class_id>/subjects', methods=['POST'])
@requires_auth
def add_subject_to_class(class_id):
    data = request.get_json()
    if not data or not data.get('name') or not data.get('teacher_id'):
        return jsonify({"message": "Missing subject name or teacher ID"}), 400
    
    cls = Class.query.get(class_id)
    if not cls:
        return jsonify({"message": "Class not found"}), 404

    new_subject = Subject(
        name=data['name'],
        teacher_id=data['teacher_id'],
        class_id=class_id
    )
    db.session.add(new_subject)
    db.session.commit()
    
    return jsonify({'id': new_subject.id, 'name': new_subject.name, 'class_id': new_subject.class_id, 'teacher_id': new_subject.teacher_id}), 201