from utils.db import db

class StudentProfile(db.Model):
    """
    Holds detailed information for a user with the 'student' role.
    This table has a one-to-one relationship with the User table.
    """
    __tablename__ = 'student_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Detailed student information
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    father_name = db.Column(db.String(100))
    mother_name = db.Column(db.String(100))
    address = db.Column(db.String(255))
    dob = db.Column(db.Date)
    photo_url = db.Column(db.String(255))
    interests = db.Column(db.String(255))
    blood_group = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    
    #Column to store the numerical face embedding
    face_embedding=db.Column(db.JSON,nullable=True)

    user = db.relationship('User', back_populates='student_profile')