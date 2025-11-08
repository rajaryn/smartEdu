import os
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
import time
from utils.auth_middleware import requires_auth

facerec_bp = Blueprint('facerec_bp', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@facerec_bp.route('/identify', methods=['POST'])
@requires_auth # Protect this route
def identify_faces():
    """
    Placeholder endpoint for facial recognition.
    Accepts an image upload, saves it, and returns mock JSON.
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
        
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        # Create a unique filename
        filename = secure_filename(f"{int(time.time())}_{file.filename}")
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(save_path)
            
            # --- AI Model Integration Point ---
            # Here, you would pass 'save_path' to your
            # OpenCV / DeepFace / TensorFlow model.
            # model.recognize(save_path)
            # ----------------------------------
            
            # Mock processing delay
            time.sleep(1) 
            
            # Mock result
            mock_result = {
                "recognized_students": ["John Doe", "Mary Smith", "Ian Malcolm", "Jane Doe"],
                "unrecognized_faces": 1,
                "image_path": f"/uploads/class_images/{filename}" # Path to retrieve the image
            }
            
            return jsonify(mock_result), 200
            
        except Exception as e:
            return jsonify({"error": f"Failed to save or process file: {str(e)}"}), 500
            
    return jsonify({"error": "File type not allowed"}), 400