import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role
        })
      });
      if (res.ok) {
        const user = await res.json();
        if (onLogin) {
          onLogin(user.role, user.id);
        } else {
          navigate(`/${user.role}`);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
      <div style={{ width: 350 }}>
        <form onSubmit={handleSubmit} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '40px 40px 24px 40px', boxShadow: '0 1px 3px rgba(27,31,35,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontWeight: 600, fontSize: 28, textAlign: 'center', marginBottom: 24, color: '#c9d1d9' }}>Login</h2>
          {error && <div style={{ color: '#f85149', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required />
          <select name="role" value={form.role} onChange={handleChange} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required />
          <button type="submit" style={{ background: 'blue', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>Log In</button>
        </form>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, marginTop: 12, padding: '20px 0', textAlign: 'center', fontSize: 15, color: '#c9d1d9' }}>
          Don't have an account? <a href="/signup" style={{ color: 'blue', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}
