from utils.db import db
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'admin', 'teacher', 'student', 'parent'
    photo_path = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(128), nullable=False) # Store hashed password in production
    # Foreign key for students/parents
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
    # Relationships
    classes_taught = relationship('Class', back_populates='teacher', foreign_keys='Class.teacher_id')
    subjects_taught = relationship('Subject', back_populates='teacher', foreign_keys='Subject.teacher_id')
    student_class = relationship('Class', back_populates='students', foreign_keys=[class_id])

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "photo_path": self.photo_path,
            "class_id": self.class_id
        }