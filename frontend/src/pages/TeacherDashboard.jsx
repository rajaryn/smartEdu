import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLogout = () => {
    // Here you would typically clear any auth tokens
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('class_photo', file);

    try {
      // Assuming the backend is running on http://127.0.0.1:5000
      const response = await fetch('http://127.0.0.1:5000/api/teacher/upload_class_photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'File uploaded successfully');
      } else {
        setMessage(data.error || 'Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    }
  };

  const navActions = [
    { key: 'upload', label: 'Upload Photo' },
    { key: 'attendance', label: 'Attendance' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'row' }}>
      {/* Fixed Sidebar Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, height: '100vh', background: '#161b22', borderRight: '1px solid #30363d', boxShadow: '0 1px 3px rgba(27,31,35,0.04)', padding: '32px 0', width: 200, display: 'flex', flexDirection: 'column', zIndex: 10, fontFamily: 'smartEDU, sans-serif' }}>
        <h2 style={{ fontWeight: 600, fontSize: 20, color: '#c9d1d9', marginBottom: 24, textAlign: 'center', fontFamily: 'smartEDU, sans-serif' }}>Teacher</h2>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {navActions.map(action => (
            <button key={action.key} onClick={() => setActiveTab(action.key)} style={{ background: activeTab === action.key ? '#2f81f7' : '#161b22', color: activeTab === action.key ? '#fff' : '#c9d1d9', border: '1px solid #30363d', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: activeTab === action.key ? '0 1px 3px rgba(27,31,35,0.08)' : 'none', width: '90%', alignSelf: 'center', fontFamily: 'smartEDU, sans-serif' }}>{action.label}</button>
          ))}
        </div>
        <button onClick={handleLogout} style={{ background: '#da3633', color: '#fff', border: '1px solid #30363d', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', width: '90%', alignSelf: 'center', marginTop: 'auto', marginBottom: 16 }}>Logout</button>
      </nav>
      {/* Main Content */}
      <div style={{ marginLeft: 200, width: '100%', padding: '40px 40px 24px 40px', boxSizing: 'border-box', fontFamily: 'smartEDU, sans-serif' }}>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, boxShadow: '0 1px 3px rgba(27,31,35,0.04)', padding: '40px', width: '100%' }}>
          <h2 style={{ fontWeight: 600, fontSize: 24, color: '#c9d1d9', marginBottom: 16, textAlign: 'center' }}>Teacher Dashboard</h2>
          
          {activeTab === 'upload' && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontWeight: 600, fontSize: 20, color: '#c9d1d9', marginBottom: 16, textAlign: 'center' }}>Upload Class Photo</h3>
              <form onSubmit={handleSubmit}>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{ display: 'block', width: '100%', padding: '8px 12px', fontSize: 14, color: '#c9d1d9', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, marginBottom: 16 }}
                />
                <button 
                  type="submit"
                  style={{ width: '100%', background: '#238636', color: 'white', padding: '10px 0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}
                >
                  Upload
                </button>
              </form>
              {message && <p style={{ color: '#c9d1d9', textAlign: 'center', marginTop: 16 }}>{message}</p>}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div style={{ color: '#c9d1d9', textAlign: 'center', marginTop: 32 }}>
              <h3 style={{ color: '#2f81f7', fontWeight: 600, fontSize: 20, marginBottom: 12 }}>View Attendance</h3>
              <p>Attendance records will be displayed here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
