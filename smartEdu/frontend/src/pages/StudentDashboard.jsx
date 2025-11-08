import React from 'react';

export default function StudentDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, boxShadow: '0 1px 3px rgba(27,31,35,0.04)', padding: '40px 40px 24px 40px', maxWidth: 400, width: '100%' }}>
        <h2 style={{ fontWeight: 600, fontSize: 24, color: '#c9d1d9', marginBottom: 16, textAlign: 'center' }}>Student Dashboard</h2>
        <p style={{ color: '#c9d1d9', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>Welcome, Student! Here you can view your attendance, assignments, and progress.</p>
        {/* Add student features here */}
      </div>
    </div>
  );
}
