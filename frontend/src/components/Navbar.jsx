import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{ background: '#24292f', borderBottom: '1px solid #444d56', padding: '16px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
      <div style={{ fontWeight: 700, fontSize: 24, color: '#fff', letterSpacing: 1 }}>SmartEdu</div>
      {user && (
        <button onClick={onLogout} style={{ marginLeft: 32, background: '#2ea44f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 2px rgba(27,31,35,0.04)' }}>Logout</button>
      )}
    </nav>
  );
}
