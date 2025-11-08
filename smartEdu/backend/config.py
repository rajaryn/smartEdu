import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'smartedu.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # File upload configuration
    UPLOAD_FOLDER = os.path.join(basedir, 'uploads/class_images')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload size

    # Auth0 Configuration (placeholders)
    # These will be needed for real JWT validation
    AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN', 'your-auth0-domain.auth0.com')
    AUTH0_AUDIENCE = os.environ.get('AUTH0_AUDIENCE', 'your-api-audience')
    ALGORITHMS = ["RS256"]