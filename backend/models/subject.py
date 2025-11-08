from utils.db import db
from sqlalchemy.orm import relationship

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Foreign key for the class it belongs to
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    
    # Foreign key for the teacher
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    class_obj = relationship("Class", back_populates='subjects')
    teacher = relationship("User", back_populates='subjects_taught')

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "class_id": self.class_id,
            "class_name": self.class_obj.name if self.class_obj else "N/A",
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.name if self.teacher else "N/A"
        }