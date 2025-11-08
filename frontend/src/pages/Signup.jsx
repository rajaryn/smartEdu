import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', class_id: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        // After signup, call onSignup to set user and redirect
        if (onSignup) {
          onSignup(form.role, null);
        } else {
          navigate('/login');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ width: 350 }}>
        <form onSubmit={handleSubmit} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '40px 40px 24px 40px', boxShadow: '0 1px 3px rgba(27,31,35,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 28, textAlign: 'center', marginBottom: 24, color: '#c9d1d9' }}>Sign Up</h2>
          {error && <div style={{ color: '#f85149', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required />
          <select name="role" value={form.role} onChange={handleChange} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required>
            <option value="">Select Role</option>
           <option value="admin" disabled style={{ color: '#666' }}>Admin (Not available)</option>
            <option value="teacher" disabled style={{ color: '#666' }}>Teacher (Not available)</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <input type="text" name="class_id" value={form.class_id} onChange={handleChange} placeholder="Class ID (for students/parents)" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '9px 0 7px 8px', fontSize: 16, color: '#c9d1d9' }} required />
          <button type="submit" style={{ background: '#15b2f5ff', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>Sign Up</button>
        </form>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, marginTop: 12, padding: '20px 0', textAlign: 'center', fontSize: 15, color: '#c9d1d9' }}>
          Already have an account? <a href="/login" style={{ color: '#15b2f5ff', fontWeight: 600, textDecoration: 'none' }}>Log in</a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
