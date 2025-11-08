"""
Main application file for the SmartEdu Flask backend.

This file is the entry point for the backend. It does the following:
1.  Imports necessary libraries and modules.
2.  Defines a `create_app` factory function.
3.  Inside `create_app`:
    - Initializes the Flask app.
    - Loads configuration from `config.py`.
    - Initializes extensions like SQLAlchemy (database) and CORS (Cross-Origin Resource Sharing).
    - Creates the file upload directory.
    - Registers all API blueprints (routes) from the `routes/` directory.
    - Sets up a route to serve uploaded images.
    - Defines a health check route (`/api/health`).
    - Creates all database tables based on the models in `models/`.
    - Seeds the database with initial data (e.g., an admin) if it's empty.
4.  Runs the Flask app when the script is executed directly.
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from utils.db import db  # Import the shared SQLAlchemy instance
import requests
# --- Import Blueprints ---
# Blueprints are collections of routes (API endpoints) that keep the app organized.
from routes.admin_routes import admin_bp
from routes.teacher_routes import teacher_bp
from routes.student_routes import student_bp
from routes.facerec_routes import facerec_bp

# --- Import Models ---
# We must import the models *before* `db.create_all()` is called.
# This ensures SQLAlchemy knows about these tables.
from models import user, subject, attendance
from models.class_model import Class

def create_app():
    """
    Application Factory Function.
    This pattern is good for testing and creating multiple instances of the app.
    """
    # 1. Initialize Flask App
    app = Flask(__name__)
    # 2. Load Configuration
    app.config.from_object(Config)
    # 3. Initialize Extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    # 4. Create Upload Directories
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # 5. Register Blueprints (API Routes)
    # This "plugs in" all the API endpoints from our `routes` files.
    # Each blueprint is given a URL prefix (e.g., /api/admin)
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(teacher_bp, url_prefix='/api/teacher')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(facerec_bp, url_prefix='/api/facerec')

    # 6. Define Static File Route for Uploads
    # This route allows the frontend to view the images
    # that have been uploaded (e.g., a class photo).
    @app.route('/uploads/class_images/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # 7. Define a Health Check Route
    # A simple endpoint to check if the backend is running.
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy", "message": "SmartEdu backend is running!"})


    # 8. Create Database Tables and Seed Data
    with app.app_context():
        db.create_all()
        if user.User.query.count() == 0:
            print("Database is empty, seeding with default data...")
            try:
                teacher1 = user.User(name='Dr. Alan Grant', email='alan@smartedu.com', role='teacher', password='password123')
                db.session.add(teacher1)
                admin1 = user.User(name='Admin User', email='admin@smartedu.com', role='admin', password='adminpass')
                db.session.add(admin1)
                db.session.commit()
                class1 = Class(name='Class 10-A', teacher_id=teacher1.id, timetable={})
                db.session.add(class1)
                db.session.commit()
                student1 = user.User(name='Ian Malcolm', email='ian@smartedu.com', role='student', class_id=class1.id, password='studentpass')
                db.session.add(student1)
                db.session.commit()
                print("Database seeded successfully.")
            except Exception as e:
                db.session.rollback()
                print(f"Error seeding database: {e}")

    # 9. Signup API for frontend
    from flask import request
    @app.route('/api/signup', methods=['POST'])
    def api_signup():
        data = request.get_json(force=True)
        if not data or not data.get('email') or not data.get('name') or not data.get('role') or not data.get('password'):
            print("Signup failed: Missing required fields")
            return jsonify({"message": "Missing required fields"}), 400
        if user.User.query.filter_by(email=data['email']).first():
            print("Signup failed: User with this email already exists")
            return jsonify({"message": "User with this email already exists"}), 409
        try:
            new_user = user.User(
                name=data['name'],
                email=data['email'],
                role=data['role'],
                class_id=data.get('class_id'),
                password=data['password']
            )
            db.session.add(new_user)
            db.session.commit()
            print(f"Signup success: User {new_user.email} registered.")
            return jsonify(new_user.to_json()), 201
        except Exception as e:
            db.session.rollback()
            print(f"Signup failed: {e}")
            return jsonify({"message": "Signup failed", "error": str(e)}), 500

    # 10. Login API for frontend
    @app.route('/api/login', methods=['POST'])
    def api_login():
        print("Login is called")
        data = request.get_json(force=True)
        if not data or not data.get('email') or not data.get('password') or not data.get('role'):
            print("Login failed: Missing required fields")
            return jsonify({"message": "Missing required fields"}), 400
        user_obj = user.User.query.filter_by(email=data['email'], password=data['password'], role=data['role']).first()
        if not user_obj:
            print("Login failed: Invalid credentials or role")
            return jsonify({"message": "Invalid credentials or role"}), 401
        print(f"Login success: User {user_obj.email} logged in.")
        return jsonify(user_obj.to_json()), 200

    # Return the fully configured app instance
    return app

# --- Run the Application ---
if __name__ == '__main__':
    # This block executes only when you run `python app.py` directly
    app = create_app()
    # Start the Flask development server on port 5000 with debug mode on.
    # Debug mode provides detailed errors and auto-reloads when you save changes.
    app.run(debug=True, port=5000)