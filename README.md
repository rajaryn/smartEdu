# SmartEdu

The frontend for the SmartEdu applicationnis built using **Vite**, **React**, and **Tailwind CSS**.

## Project Architecture

To facilitate development and prototyping, frontend is built using a **single-file architecture**. All React components, pages, contexts, and API logic are contained within:

* `src/App.jsx`

This single file includes:
* **Authentication:** A full login/logout flow for different user roles (Admin, Teacher, Student, Parent).
* **State-Based Navigation:** Page routing is handled by a top-level React state (`activePage`) in the main `App` component, not by a traditional file-based router.
* **All Pages:** Components for each page (`AdminDashboard`, `ManageUsersPage`, `ManageClassesPage`, `TeacherDashboard`, `StudentDashboard`, `LoginPage`, etc.).
* **All Components:** Reusable components like `Sidebar`, `Navbar`, `StatCard`, and `ChartCard`.
* **API Layer:** An `api` object that manages all `fetch` calls to the backend.

## How to Run

**Prerequisites:** [Node.js](https://nodejs.org/) (which includes npm) must be installed.

1.  **Navigate to the Frontend Directory**
    Open a terminal and change to this directory:
    ```sh
    cd path/to/your/SmartEdu/frontend
    ```

2.  **Install Dependencies**
    This will read the `package.json` file and install React, Vite, and other required libraries.
    ```sh
    npm install
    ```

3.  **Run the Development Server**
    This command starts the Vite development server.
    ```sh
    npm run dev
    ```

4.  **Open the App**
    Your terminal will display a local URL, typically: `http://localhost:5173`. Open this URL in your web browser.

## File Structure

* `frontend/`
    * `package.json`: Lists all Node.js dependencies and scripts.
    * `vite.config.js`: Configuration file for the Vite build tool.
    * `index.html`: The main HTML entry point for the browser. This file contains the `<div id="root">`.
    * `src/`
        * `index.jsx`: The main JavaScript entry point. It imports `App.jsx` and renders it into the "root" div from `index.html`.
        * `App.jsx`: Contains the entire React application (all pages, components, and logic).
        * `styles/globals.css`: Imports and configures Tailwind CSS.

## Backend Connection

This frontend is designed to communicate with the **SmartEdu Flask Backend**. Please ensure the backend server is running (typically on `http://127.0.0.1:5000`) for API calls (like fetching users, creating classes, or uploading files) to work.

## Backend

Built with Python and Flask. Its core feature is an AI-powered attendance system that uses facial recognition to mark student attendance from a single class photo.

The system is built with a strong emphasis on security, ensuring all sensitive biometric data (face embeddings) is fully encrypted at rest.

---

## Core Features

* **Student Profile Management:** An admin-facing API for creating, viewing, and managing student profiles.
* **AI-Powered Enrollment:** When an admin uploads a student's photo, the system automatically:
    1.  Detects the face in the photo.
    2.  Generates a 512-dimension vector embedding using the `Facenet512` model.
    3.  **Encrypts** this vector using `Fernet` (from the `cryptography` library).
    4.  Saves the secure, encrypted string to the database.
* **Automated Attendance Recognition:**
    1.  A script (or future API route) loads the most recent class photo from the `uploads/class_images/` directory.
    2.  It detects all faces in the class photo.
    3.  It queries the database, loads the **encrypted** embeddings for all enrolled students, and **decrypts** them in memory.
    4.  It compares each face from the class photo against the decrypted student embeddings to find matches.
    5.  It generates a final report and an output image with faces boxed and labeled.

---

## Technology Stack

* **Backend:** Python, Flask
* **Database:** SQLAlchemy (with SQLite in development)
* **AI / Face Recognition:** `deepface`
* **AI Models:**
    * **Detection:** `mtcnn`
    * **Recognition:** `Facenet512` (Used for both enrollment and matching)
* **Security:** `cryptography` (for Fernet encryption)
* **Environment:** `python-dotenv` (for managing the encryption key)

---

## Installation & Setup

This project has specific dependencies. Following these steps is critical.

### 1. Project Setup

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd smartEdu/backend
    ```

2.  **Create a Python 3.11 Virtual Environment**
    This project's dependencies (especially `deepface`'s) are sensitive. Python 3.13 and 3.12 are not compatible. **You must use Python 3.10 or 3.11.**
    ```bash
    # (Assuming you have Python 3.11 installed as py -3.11)
    py -3.11 -m venv venv
    ```

3.  **Activate the Environment**
    * **Command Prompt (cmd.exe):**
        ```bash
        .\venv\Scripts\activate
        ```
    * **Git Bash / MINGW64:**
        ```bash
        source venv/Scripts/activate
        ```

### 2. Install Dependencies

Install all required Python packages:

```bash
pip install Flask Flask-SQLAlchemy Flask-Migrate deepface opencv-python cryptography python-dotenv tf-keras