import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import Navbar from './components/Navbar.jsx';

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
};

const AppLayout = ({ user, onLogout }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar user={user} onLogout={onLogout} />
    <main className="p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (role, id) => {
    const newUser = { role, id };
    setUser(newUser);
    navigate(`/${role}`);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
  <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
  <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />

      <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
        <Route path="/admin" element={<ProtectedRoute user={user} role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute user={user} role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute user={user} role="student"><StudentDashboard /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
    </Routes>
  );
}

export default App;