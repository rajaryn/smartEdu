from flask import Blueprint, jsonify
from utils.db import db
from models.user import User
from models.class_model import Class
from models.attendance import Attendance
from utils.auth_middleware import requires_auth, requires_role

student_bp = Blueprint('student_bp', __name__)

# Note: In a real app, the student_id would come from the
# validated JWT token, not the URL.
# We use the URL here for demo purposes.

@student_bp.route('/<int:student_id>/dashboard', methods=['GET'])
@requires_auth
# @requires_role('student') # Add this back when JWT payload is parsed
def get_student_dashboard(student_id):
    """Get dashboard data for a specific student."""
    
    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({"error": "Student not found"}), 404
        
    student_class = Class.query.get(student.class_id)
    if not student_class:
        return jsonify({"error": "Student is not assigned to a class"}), 404
        
    # --- Calculate Real Attendance ---
    # Get all attendance records for the student's class
    attendance_records = Attendance.query.filter_by(class_id=student.class_id).all()
    
    total_classes = len(attendance_records)
    attended_classes = 0
    
    for record in attendance_records:
        # The list might contain student IDs (integers) or names (strings).
        # We check for both to be safe.
        if record.present_students and (student_id in record.present_students or student.name in record.present_students):
            attended_classes += 1
            
    attendance_summary = {
        "overall_percentage": int((attended_classes / total_classes) * 100) if total_classes > 0 else 100,
        "missed_classes": total_classes - attended_classes
    }
    
    dashboard_data = {
        "student_info": student.to_json(),
        "class_info": student_class.to_json(),
        "timetable": student_class.timetable,
        "attendance": attendance_summary
    }
    
    return jsonify(dashboard_data), 200