from utils.db import db

class TeacherProfile(db.Model):
    """
    Holds detailed information for a user with the 'teacher' role.
    This table has a one-to-one relationship with the User table.
    """
    __tablename__ = 'teacher_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)

    # Detailed teacher information
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    address = db.Column(db.String(255))
    dob = db.Column(db.Date)
    photo_url = db.Column(db.String(255))
    blood_group = db.Column(db.String(10))
    phone = db.Column(db.String(20))

    user = db.relationship('User', back_populates='teacher_profile')