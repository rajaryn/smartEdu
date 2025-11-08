from utils.db import db
from sqlalchemy.orm import relationship
import datetime

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign key for the class
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    
    date = db.Column(db.Date, nullable=False, default=datetime.date.today)
    
    # Store lists of student IDs (or names, JSON is flexible)
    present_students = db.Column(db.JSON, nullable=True)
    absent_students = db.Column(db.JSON, nullable=True)
    
    # Path to the photo used for this record
    image_path = db.Column(db.String(200), nullable=True)
    
    # Relationship
    class_obj = relationship('Class', back_populates='attendance_records')

    def to_json(self):
        return {
            "id": self.id,
            "class_id": self.class_id,
            "date": self.date.isoformat(),
            "present_students": self.present_students,
            "absent_students": self.absent_students,
            "image_path": self.image_path
        }