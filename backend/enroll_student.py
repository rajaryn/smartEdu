from deepface import DeepFace
import numpy as np
import os
import json

# --- 1. Define Paths ---
# The new student's ID photo
student_photo = "student_db/raj.jpg" 
student_name = "raj"

# Where we will save the embedding
output_db_path = "student_embeddings"
os.makedirs(output_db_path, exist_ok=True)

print(f"Enrolling new student: {student_name}")

# --- 2. Generate the Embedding ---
try:
    # DeepFace.represent() takes an image and returns a
    # list of embeddings. We only want the first one.
    embedding_list = DeepFace.represent(
        img_path=student_photo,
        model_name='Facenet512',
        enforce_detection=True # Fails if no face is found
    )
    
    # Get the embedding vector
    student_embedding = embedding_list[0]['embedding']

    # Convert the numpy array to a standard Python list, then dump to a JSON string
    embedding_json_string = json.dumps(student_embedding)

    # Now, save this 'embedding_json_string' to your 'face_embeddings' TEXT column
    # (e.g., "UPDATE student_profiles SET face_embeddings = ? WHERE student_id = ?")
    
    # This is the "face signature": a list of 512 numbers
    print(f"Generated embedding with {len(student_embedding)} dimensions.")

    # --- 3. Save the Embedding to Your "Database" ---
    # We save the embedding as a simple file named after the student.
    # In a real app, you'd save this in a SQL/NoSQL database.
    output_file = os.path.join(output_db_path, f"{student_name}.npy")
    np.save(output_file, student_embedding)
    
    print(f"Successfully saved embedding to {output_file}")

except Exception as e:
    print(f"Error during enrollment: {e}")
    print("Could not find a face in the photo or another error occurred.")