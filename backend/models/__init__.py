# This file makes the 'models' directory a Python package.

# By importing the models here, we make them easily accessible
# and help prevent circular import issues.
from .user import User
from .class_model import Class
from .subject import Subject
from .attendance import Attendance
from .student_profile import StudentProfile
from .teacher_profile import TeacherProfile