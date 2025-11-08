from utils.db import db
from sqlalchemy.orm import relationship

class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    
    # Link to the teacher (User model)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    teacher = relationship("User", back_populates='classes_taught', foreign_keys=[teacher_id])
    
    # Timetable (stored as JSON)
    # Example: {"Monday": ["Math", "Science"], "Tuesday": ...}
    timetable = db.Column(db.JSON, nullable=True)
    
    # Relationships
    students = relationship("User", back_populates='student_class', foreign_keys='User.class_id')
    subjects = relationship("Subject", back_populates='class_obj')
    attendance_records = relationship("Attendance", back_populates='class_obj')

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.name if self.teacher else "N/A",
            "timetable": self.timetable,
            "student_count": len(self.students)
        }