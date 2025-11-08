import bcrypt
from cryptography.fernet import Fernet
import json
import os

# --- Password Hashing ---

def hash_password(password):
    """Hashes a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed_password):
    """Checks a password against a stored hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

# --- Data Encryption (for Embeddings) ---

# IMPORTANT: In a production environment, this key should be loaded securely,
# e.g., from an environment variable or a secret manager.
# For this example, we'll generate it if it doesn't exist.
key_path = 'secret.key'
if not os.path.exists(key_path):
    with open(key_path, 'wb') as key_file:
        key = Fernet.generate_key()
        key_file.write(key)
else:
    with open(key_path, 'rb') as key_file:
        key = key_file.read()

cipher_suite = Fernet(key)

def encrypt_data(data):
    """Encrypts data (like a face embedding list) into a secure string."""
    return cipher_suite.encrypt(json.dumps(data).encode('utf-8'))

def decrypt_data(encrypted_data):
    """Decrypts data and returns the original Python object."""
    decrypted_bytes = cipher_suite.decrypt(encrypted_data)
    return json.loads(decrypted_bytes.decode('utf-8'))