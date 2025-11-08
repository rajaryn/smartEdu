import React from 'react';

export default function TeacherDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>Teacher Dashboard</h2>
        <p style={{ color: '#555' }}>Welcome, Teacher! Here you can manage attendance, assignments, and view student progress.</p>
      </div>
    </div>
  );
// ...existing code...
}
