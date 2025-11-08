from deepface import DeepFace
import cv2
import os

# --- 1. Define Paths ---
class_photo_path = "uploads/class_images/class_photo_1.png"
output_path = "output_detection_only.jpg"

print(f"Loading image: {class_photo_path}")

# Check if file exists
if not os.path.exists(class_photo_path):
    print(f"Error: Class photo not found at {class_photo_path}")
    exit()

# --- 2. Load the image with OpenCV ---
# We load it here so we can draw on it later
img = cv2.imread(class_photo_path)

# --- 3. Detect All Faces ---
try:
    print("Detecting faces... (This may take a moment on first run)")
    
    # Use DeepFace.extract_faces() to just find the faces
    # 'mtcnn' is a good, accurate detector
    # We set enforce_detection=False so it doesn't crash if no faces are found
    faces = DeepFace.extract_faces(
        img_path=class_photo_path,
        detector_backend='mtcnn',
        enforce_detection=False
    )

    if not faces:
        print("No faces found in the image.")
        exit()

    print(f"Found {len(faces)} faces!")

    # --- 4. Draw Bounding Boxes ---
    for face in faces:
        # 'facial_area' gives the bounding box as {'x':, 'y':, 'w':, 'h':}
        box = face['facial_area']
        x, y, w, h = box['x'], box['y'], box['w'], box['h']
        
        # Draw a green rectangle (BGR color format)
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # --- 5. Save the Result ---
    cv2.imwrite(output_path, img)
    print(f"Successfully saved result to {output_path}")

except Exception as e:
    print(f"An error occurred: {e}")