from utils.db import db
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'admin', 'teacher', 'student', 'parent'
    password = db.Column(db.LargeBinary, nullable=False) # Store hashed password

    # Foreign key for students/parents
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=True)
    # Relationships
    classes_taught = relationship("Class", back_populates='teacher', foreign_keys='Class.teacher_id')
    student_class = relationship("Class", back_populates='students', foreign_keys=[class_id])
    subjects_taught = relationship("Subject", back_populates='teacher', foreign_keys='Subject.teacher_id')
    
    # One-to-one relationships to profile tables
    student_profile = relationship("StudentProfile", back_populates='user', uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("TeacherProfile", back_populates='user', uselist=False, cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "class_id": self.class_id
        }