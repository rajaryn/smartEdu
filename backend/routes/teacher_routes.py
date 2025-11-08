from flask import Blueprint, jsonify, request
from utils.db import db
from models.attendance import Attendance
from utils.auth_middleware import requires_auth, requires_role

teacher_bp = Blueprint('teacher_bp', __name__)

@teacher_bp.route('/mark-attendance', methods=['POST'])
@requires_auth
@requires_role('teacher')
def mark_attendance():
    """
    Receives attendance data (from face rec) and saves it.
    The request should contain the output from the face rec.
    """
    data = request.json
    
    if not data or not data.get('class_id') or not data.get('present_students'):
        return jsonify({"error": "Missing required fields"}), 400
        
    new_attendance_record = Attendance(
        class_id=data['class_id'],
        present_students=data['present_students'],
        absent_students=data.get('absent_students', []),
        image_path=data.get('image_path')
    )
    
    db.session.add(new_attendance_record)
    db.session.commit()
    
    return jsonify(new_attendance_record.to_json()), 201

@teacher_bp.route('/class/<int:class_id>/reports', methods=['GET'])
@requires_auth
@requires_role('teacher')
def get_class_reports(class_id):
    """Get attendance reports for a specific class."""
    records = Attendance.query.filter_by(class_id=class_id).order_by(Attendance.date.desc()).limit(30).all()
    
    if not records:
        return jsonify({"message": "No records found for this class"}), 404
        
    return jsonify([record.to_json() for record in records]), 200