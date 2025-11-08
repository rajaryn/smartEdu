## Migration Note

If you have an existing database, you need to add a `password` column to the `user` table for signup and authentication. Use a migration tool like Flask-Migrate or manually alter the table.
SmartEdu - Automatic Attendance & Smart Curriculum ManagementThis is a full-stack web application for managing school attendance and curriculum, powered by a placeholder for AI facial recognition.Project StructureSmartEdu/
├── backend/            # Python Flask Backend
│   ├── app.py          # Main Flask application file
│   ├── config.py       # Configuration (DB URI, etc.)
│   ├── requirements.txt # Python dependencies
│   ├── models/         # SQLAlchemy DB Models
│   ├── routes/         # Flask Blueprints (API endpoints)
│   ├── utils/          # DB instance, Auth middleware
│   ├── static/
│   └── uploads/        # Saved class images
│       └── class_images/
│
├── frontend/           # React + Vite Frontend
│   ├── package.json    # NPM dependencies
│   ├── vite.config.js  # Vite configuration
│   └── src/
│       ├── App.jsx     # The (single) React application file
│       └── styles/
│           └── globals.css # Tailwind CSS base
│
└── README.md           # This file
How to Run1. Backend (Flask)Prerequisites: Python 3.7+ and pip.Navigate to the backend directory:cd backend
Create and activate a virtual environment (recommended):# On macOS/Linux
python3 -m venv venv
source venv/bin/activate


python -m venv venv
.\venv\Scripts\activate
Install the required Python packages:pip install -r requirements.txt
Run the Flask application:python app.py
(Or flask run if you have flask CLI installed and configured)The backend will start on http://127.0.0.1:5000. It will also create a smartedu.db SQLite file in the backend directory.2. Frontend (React + Vite)Prerequisites: Node.js and npm.Open a new terminal window.Navigate to the frontend directory:cd frontend
Install the Node.js dependencies:npm install
Start the Vite development server:npm run dev
Open your browser and go to the URL shown in the terminal (usually http://localhost:5173 or similar).3. Using the AppThe application will open to a mock login page.Select a role (Admin, Teacher, Student) from the dropdown and click "Log In".You will be redirected to the appropriate dashboard for that role.As a Teacher: You can try uploading an image file to test the facial recognition endpoint (it's connected!).As an Admin: You can see the dashboard now loads data live from the backend. You can also create new users and classes.As a Student: You can see the placeholder dashboard.Next StepsReal Auth: Replace the mock useAuth hook in App.jsx with the actual @auth0/auth0-react SDK.Real Backend Auth: Implement the JWT validation logic in backend/utils/auth_middleware.py using your Auth0 domain and audience.AI Model: Integrate your OpenCV or DeepFace model into the backend/routes/facerec_routes.py file, replacing the mock result.