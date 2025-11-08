from deepface import DeepFace
# import numpy as np  # <-- NO LONGER NEEDED FOR THIS SCRIPT
import cv2
import os
import glob
from app import create_app
from utils.db import db
from models.user import User
from models.student_profile import StudentProfile
from embedding_utils import decrypt_embedding_from_db

# --- 0. Setup Application Context ---
app = create_app()
app.app_context().push()

# Query all users who are students and have a profile with an embedding
students_with_embeddings = db.session.query(User).join(StudentProfile).filter(
    User.role == 'student',
    StudentProfile.face_embedding.isnot(None)
).all()

# --- 1. Load database of Enrolled Students---

enrolled_students = {} # 1. Initialize the dictionary
print("Loading enrolled students from database...")

for student_user in students_with_embeddings:
    # --- MODIFIED BLOCK ---
    # 1. Get the encrypted string from the database
    encrypted_string = student_user.student_profile.face_embedding
    
    if encrypted_string:
        # 2. Decrypt the string to get the original list
        decrypted_list = decrypt_embedding_from_db(encrypted_string)
        
        if decrypted_list:
            # 3. Store the decrypted list in your dictionary
            enrolled_students[student_user.name] = decrypted_list
            print(f"- Loaded and Decrypted {student_user.name}")
        else:
            print(f"!! FAILED to decrypt embedding for {student_user.name}")

# --- 2. Load the Class Photo ---
# ... (This part is correct) ...
class_images_folder = "uploads/class_images"
image_files = glob.glob(os.path.join(class_images_folder, "*.png")) + \
              glob.glob(os.path.join(class_images_folder, "*.jpg")) + \
              glob.glob(os.path.join(class_images_folder, "*.jpeg"))
if not image_files:
    print(f"Error: No image files found in {class_images_folder}")
    exit()
class_photo_path = max(image_files, key=os.path.getmtime)
print(f"Processing the most recent class photo: {class_photo_path}")
img = cv2.imread(class_photo_path)
if img is None:
    print(f"Error: Could not load image {class_photo_path}")
    exit()

# --- 3. Find All Faces in the Class Photo ---
# ... (This part is correct) ...
print("Detecting all faces in class photo...")
try:
    all_faces = DeepFace.extract_faces(
        img_path=class_photo_path,
        detector_backend='mtcnn',
        enforce_detection=False
    )
    if not all_faces:
        print("No faces were found in the class photo.")
        exit()

    print(f"Found {len(all_faces)} faces. Now trying to match...")
    
    present_students = set()

    # --- 4. Looping Through Each Face and Compare (MODIFIED) ---
    for face_data in all_faces:
        box = face_data['facial_area']
        x, y, w, h = box['x'], box['y'], box['w'], box['h']
        cropped_face = face_data['face']
        
        # 'unknown_embedding' is a Python LIST
        unknown_embedding = DeepFace.represent(
            img_path=cropped_face,
            model_name='Facenet512',
            enforce_detection=False,
            detector_backend='skip'
        )[0]['embedding']
        
        # --- 5. Compare this Face to All Enrolled Students (MODIFIED) ---
        found_match = False
        for student_name, known_embedding in enrolled_students.items():
            
            # --- FIX: Go back to using DeepFace.verify() ---
            # It will now work because both 'unknown_embedding' and
            # 'known_embedding' are standard Python lists.
            result = DeepFace.verify(
                img1_path=unknown_embedding,
                img2_path=known_embedding,
                model_name='Facenet512',
                detector_backend='skip'
            )
            
            if result['verified']:
                print(f"MATCH! -> {student_name}")
                present_students.add(student_name)
                
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.rectangle(img, (x, y - 25), (x + w, y), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, student_name, (x + 6, y - 6), cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), 1)
                
                found_match = True
                break 
        
        if not found_match:
            cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), 2)


    # --- 6. Save and Report ---
    # ... (This part is correct) ...
    output_path = "output_attendance_manual.jpg"
    cv2.imwrite(output_path, img)
    print(f"Saved result image to {output_path}")

    print("\n--- Attendance Report ---")
    print(f"Present: {', '.join(present_students)}")
    
    full_roster = set(enrolled_students.keys())
    absent_students = full_roster - present_students
    if absent_students:
        print(f"Absent: {', '.join(absent_students)}")
    else:
        print("All registered students are present!")

except Exception as e:
    print(f"An error occurred: {e}")