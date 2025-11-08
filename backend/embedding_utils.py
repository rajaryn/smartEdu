import os
import json
import numpy as np
from deepface import DeepFace
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load the secret key from your environment
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY not found in .env file. Please generate one.")

# Initialize the Fernet cipher
cipher = Fernet(ENCRYPTION_KEY.encode('utf-8'))

def encrypt_embedding(embedding_list: list) -> str:
    """
    Encrypts a face embedding (Python list) and returns 
    a secure, storable string.
    """
    try:
        # Convert the list to a JSON string
        embedding_json = json.dumps(embedding_list)
        
        # Encrypt the string (must be in bytes)
        encrypted_bytes = cipher.encrypt(embedding_json.encode('utf-8'))
        
        # Return the encrypted bytes as a storable string
        return encrypted_bytes.decode('utf-8')
        
    except Exception as e:
        print(f"Error encrypting embedding: {e}")
        return None

def decrypt_embedding_from_db(encrypted_string: str) -> np.ndarray:
    """
    Decrypts the string from the database and returns the
    NumPy array for DeepFace to use.
    """
    try:
        # Convert the string back to bytes
        encrypted_bytes = encrypted_string.encode('utf-8')
        
        # Decrypt the bytes
        decrypted_bytes = cipher.decrypt(encrypted_bytes)
        
        # Decode the bytes to our original JSON string
        embedding_json = decrypted_bytes.decode('utf-8')
        
        # Convert the JSON string back to a Python list
        embedding_list = json.loads(embedding_json)
        
        # Return as a list for DeepFace.verify()
        return embedding_list
        
    except Exception as e:
        print(f"Error decrypting embedding: {e}")
        return None

def generate_and_encrypt_embedding(image_path: str) -> str | None:
    """
    This is your main function.
    It takes an image path, generates the embedding,
    and returns the final *encrypted string* for the database.
    """
    print(f"Generating embedding for: {image_path}")
    try:
        # 1. Generate the embedding
        embedding_list = DeepFace.represent(
            img_path=image_path,
            model_name='Facenet512',
            enforce_detection=True
        )
        
        # Get the vector (it's a list)
        embedding_vector = embedding_list[0]['embedding']
        
        # Ensure it's a standard Python list (not NumPy array) for JSON
        if isinstance(embedding_vector, np.ndarray):
            embedding_vector = embedding_vector.tolist()

        # 2. Encrypt the embedding
        encrypted_string = encrypt_embedding(embedding_vector)
        
        if encrypted_string:
            print("Successfully generated and encrypted embedding.")
            return encrypted_string
        else:
            print("Failed to encrypt embedding.")
            return None

    except Exception as e:
        print(f"Error in embedding generation: {e}")
        return None