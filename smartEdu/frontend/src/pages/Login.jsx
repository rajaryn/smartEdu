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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: '320px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#222' }}>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Email</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Role</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#007bff', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <a href="/signup" style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>Don't have an account? Sign up</a>
      </div>
    </div>
  );
}
