import React from 'react';

export default function AdminDashboard() {
  // ...existing code...
  const [activeTab, setActiveTab] = React.useState('classes');
  const [managingClass, setManagingClass] = React.useState(null); // State to hold the class being managed
  const [classes, setClasses] = React.useState([]);
  const [newClassName, setNewClassName] = React.useState('');
  const [newSubject, setNewSubject] = React.useState({ name: '', teacher: '' });
  // Navbar actions

  // State for the Add Student form
  const initialStudentFormState = {
    firstName: '', lastName: '', email: '', password: 'password123', // Default password
    fatherName: '', motherName: '', address: '', dob: '', class_id: '',
    interests: '', bloodGroup: '', phone: ''
  };
  const [studentForm, setStudentForm] = React.useState(initialStudentFormState);
  const [studentPhoto, setStudentPhoto] = React.useState(null);
  const [formStatus, setFormStatus] = React.useState({ message: '', isError: false });

  const handleStudentFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setStudentPhoto(files[0]);
    } else {
      setStudentForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setFormStatus({ message: 'Submitting student details...', isError: false });

    const formData = new FormData();
    // Append all the text fields from the form state
    for (const key in studentForm) {
      formData.append(key, studentForm[key]);
    }
    // Append the photo file if it exists
    if (studentPhoto) {
      formData.append('photo', studentPhoto);
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/students', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus({ message: 'Student added successfully!', isError: false });
        setStudentForm(initialStudentFormState); // Reset the form
        setStudentPhoto(null); // Reset the file input
      } else {
        setFormStatus({ message: data.error || 'Failed to add student.', isError: true });
      }
    } catch (error) {
      console.error("Error submitting student form:", error);
      setFormStatus({ message: 'A network error occurred. Please try again.', isError: true });
    }
  };

  const navActions = [
    { key: 'classes', label: 'Classes' },
    { key: 'addStudent', label: 'Add Student' },
    { key: 'addTeacher', label: 'Add Teacher' },
    { key: 'import', label: 'Import Excel' }
  ];

  // Fetch classes from backend on component mount
  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/admin/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Add class handler
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName) return;
    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassName }),
      });
      if (res.ok) {
        const newClass = await res.json();
        setClasses([...classes, newClass]);
        setNewClassName('');
      }
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };

  // Delete class handler
  const handleDeleteClass = (id) => {
    // Add backend DELETE request here
    setClasses(classes.filter(cls => cls.id !== id));
  };

  // Add subject to the currently managed class
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.teacher || !managingClass) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/admin/classes/${managingClass.id}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject.name, teacher_id: newSubject.teacher }), // Assuming teacher is an ID
      });
      if (res.ok) {
        // Refetch or update class data to show the new subject
        const addedSubject = await res.json();
        const updatedManagingClass = { ...managingClass, subjects: [...(managingClass.subjects || []), addedSubject] };
        setManagingClass(updatedManagingClass);
        setClasses(classes.map(c => c.id === managingClass.id ? updatedManagingClass : c));
        setNewSubject({ name: '', teacher: '' });
      }
    } catch (error) {
      console.error("Failed to add subject:", error);
    }
  };

  const renderManageClassView = () => (
    <div style={{ fontFamily: 'smartEDU, sans-serif' }}>
      <button onClick={() => setManagingClass(null)} style={{ background: '#30363d', color: '#c9d1d9', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', marginBottom: 24 }}>← Back to All Classes</button>
      <h3 style={{ color: '#2f81f7', fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Manage Class: {managingClass.name}</h3>
      
      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="Subject Name" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '8px', color: '#c9d1d9', flex: 1 }} />
        <input value={newSubject.teacher} onChange={e => setNewSubject({ ...newSubject, teacher: e.target.value })} placeholder="Assign Teacher ID" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '8px', color: '#c9d1d9', flex: 1 }} />
        <button type="submit" style={{ background: '#2f81f7', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Add Subject</button>
      </form>

      {/* Subjects List */}
      <h4 style={{ color: '#c9d1d9', fontSize: 18, marginTop: 24, marginBottom: 12 }}>Subjects in this Class</h4>
      <table style={{ width: '100%', background: '#161b22', color: '#c9d1d9', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #30363d' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Subject Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Assigned Teacher</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managingClass.subjects && managingClass.subjects.map(sub => (
            <tr key={sub.id} style={{ borderBottom: '1px solid #30363d' }}>
              <td style={{ padding: '8px' }}>{sub.name}</td>
              <td style={{ padding: '8px' }}>{sub.teacher}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ background: '#30363d', color: '#c9d1d9', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Edit</button>
                <button style={{ background: '#da3633', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'row' }}>
      {/* Fixed Sidebar Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, height: '100vh', background: '#161b22', borderRight: '1px solid #30363d', boxShadow: '0 1px 3px rgba(27,31,35,0.04)', padding: '32px 0', width: 200, display: 'flex', flexDirection: 'column', gap: 16, zIndex: 10, fontFamily: 'smartEDU, sans-serif' }}>
        <h2 style={{ fontWeight: 600, fontSize: 20, color: '#c9d1d9', marginBottom: 24, textAlign: 'center', fontFamily: 'smartEDU, sans-serif' }}>Admin</h2>
        {navActions.map(action => (
          <button key={action.key} onClick={() => setActiveTab(action.key)} style={{ background: activeTab === action.key ? '#2f81f7' : '#161b22', color: activeTab === action.key ? '#fff' : '#c9d1d9', border: '1px solid #30363d', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: activeTab === action.key ? '0 1px 3px rgba(27,31,35,0.08)' : 'none', width: '90%', alignSelf: 'center', fontFamily: 'smartEDU, sans-serif' }}>{action.label}</button>
        ))}
      </nav>
      {/* Main Content */}
      <div style={{ marginLeft: 200, width: '100%', padding: '40px 40px 24px 40px', boxSizing: 'border-box', fontFamily: 'smartEDU, sans-serif' }}>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, boxShadow: '0 1px 3px rgba(27,31,35,0.04)', padding: '40px', width: '100%', fontFamily: 'smartEDU, sans-serif' }}>
          <h2 style={{ fontWeight: 600, fontSize: 24, color: '#c9d1d9', marginBottom: 16, textAlign: 'center', fontFamily: 'smartEDU, sans-serif' }}>Admin Dashboard</h2>
          {/* Tab Content */}
          {activeTab === 'classes' && !managingClass && (
            <>
              <p style={{ color: '#c9d1d9', fontSize: 16, textAlign: 'center', marginBottom: 24, fontFamily: 'smartEDU, sans-serif' }}>Manage classes below:</p>
              {/* Add Class Form */}
              <form onSubmit={handleAddClass} style={{ display: 'flex', gap: 12, marginBottom: 24, fontFamily: 'smartEDU, sans-serif' }}>
                <input value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="New Class Name (e.g., 'Grade 10 - Section A')" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '8px', color: '#c9d1d9', flex: 1, fontFamily: 'smartEDU, sans-serif' }} />
                <button type="submit" style={{ background: '#2f81f7', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontFamily: 'smartEDU, sans-serif' }}>Add</button>
              </form>
              {/* Classes List */}
              <table style={{ width: '100%', background: '#161b22', color: '#c9d1d9', borderCollapse: 'collapse', marginBottom: 24, fontFamily: 'smartEDU, sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #30363d' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Class Name</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Subjects</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => (
                    <tr key={cls.id} style={{ borderBottom: '1px solid #30363d' }}>
                      <td style={{ padding: '8px' }}>{cls.name || 'Unnamed Class'}</td>
                      <td style={{ padding: '8px' }}>{cls.subjects ? cls.subjects.length : 0}</td>
                      <td style={{ padding: '8px' }}>
                        <button onClick={() => setManagingClass(cls)} style={{ background: '#2f81f7', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Manage</button>
                        <button onClick={() => handleDeleteClass(cls.id)} style={{ background: '#da3633', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {activeTab === 'classes' && managingClass && renderManageClassView()}
          {/* Add Student Tab */}
          {activeTab === 'addStudent' && (
            <div style={{ color: '#c9d1d9', marginTop: 32, fontFamily: 'smartEDU, sans-serif', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ color: '#2f81f7', fontWeight: 600, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>Add New Student</h3>
              {formStatus.message && <div style={{ color: formStatus.isError ? '#da3633' : '#2f81f7', textAlign: 'center', marginBottom: 16 }}>{formStatus.message}</div>}
              <form onSubmit={handleAddStudentSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                <input placeholder="First Name" name="firstName" value={studentForm.firstName} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} required />
                <input placeholder="Last Name" name="lastName" value={studentForm.lastName} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} required />
                <input type="email" placeholder="Email" name="email" value={studentForm.email} onChange={handleStudentFormChange} style={{ flex: '1 1 100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} required />
                <input placeholder="Father's Name" name="fatherName" value={studentForm.fatherName} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Mother's Name" name="motherName" value={studentForm.motherName} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Address" name="address" value={studentForm.address} onChange={handleStudentFormChange} style={{ flex: '1 1 100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input type="text" name="dob" value={studentForm.dob} onChange={handleStudentFormChange} onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} placeholder="Date of Birth" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Class ID" name="class_id" value={studentForm.class_id} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} required />
                <input placeholder="Interests" name="interests" value={studentForm.interests} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Blood Group" name="bloodGroup" value={studentForm.bloodGroup} onChange={handleStudentFormChange} style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <label style={{ flex: '1 1 100%', color: '#c9d1d9', fontSize: 14 }}>Student Photo:</label>
                <input type="file" name="photo" accept="image/*" onChange={handleStudentFormChange} style={{ flex: '1 1 100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <button type="submit" style={{ background: '#2f81f7', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontFamily: 'smartEDU, sans-serif', marginTop: 8 }}>Add Student</button>
              </form>
              <div style={{ color: '#c9d1d9', fontSize: 15, marginTop: 24, borderTop: '1px solid #30363d', paddingTop: 24, textAlign: 'center' }}>
                <strong>Or upload via Excel file:</strong>
                <input type="file" accept=".xlsx,.xls" style={{ marginLeft: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
              </div>
            </div>
          )}
          {/* Add Teacher Tab */}
          {activeTab === 'addTeacher' && (
            <div style={{ color: '#c9d1d9', marginTop: 32, fontFamily: 'smartEDU, sans-serif', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ color: '#2f81f7', fontWeight: 600, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>Add New Teacher</h3>
              <form style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                <input placeholder="First Name" name="firstName" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Last Name" name="lastName" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input type="email" placeholder="Email" name="email" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input type="tel" placeholder="Phone" name="phone" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Address" style={{ flex: '1 1 100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input type="text" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} placeholder="Date of Birth" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <input placeholder="Blood Group" name="bloodGroup" style={{ flex: '1 1 45%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <label style={{ flex: '1 1 100%', color: '#c9d1d9', fontSize: 14 }}>Teacher Photo:</label>
                <input type="file" accept="image/*" style={{ flex: '1 1 100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 8, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
                <button type="submit" style={{ background: '#2f81f7', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontFamily: 'smartEDU, sans-serif', marginTop: 8 }}>Add Teacher</button>
              </form>
              <div style={{ color: '#c9d1d9', fontSize: 15, marginTop: 24, borderTop: '1px solid #30363d', paddingTop: 24, textAlign: 'center' }}>
                <strong>Or upload via Excel file:</strong>
                <input type="file" accept=".xlsx,.xls" style={{ marginLeft: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#c9d1d9', fontFamily: 'smartEDU, sans-serif' }} />
              </div>
            </div>
          )}
          {activeTab === 'import' && (
            <div style={{ color: '#c9d1d9', textAlign: 'center', marginTop: 32, fontFamily: 'smartEDU, sans-serif' }}>
              <h3 style={{ color: '#2f81f7', fontWeight: 600, fontSize: 20, marginBottom: 12, fontFamily: 'smartEDU, sans-serif' }}>Register Students via Excel</h3>
              <p style={{ color: '#c9d1d9', fontSize: 16, marginBottom: 16, fontFamily: 'smartEDU, sans-serif' }}>Upload an Excel file containing student details. Each row should include student information and an image file reference. Images will be registered for each student.</p>
              <div style={{ color: '#c9d1d9', fontSize: 15, marginBottom: 8, fontFamily: 'smartEDU, sans-serif' }}>
                <strong>Required columns:</strong> Name, Email, Class, Image (file path or upload)
              </div>
              <div style={{ color: '#c9d1d9', fontSize: 15, marginBottom: 8, fontFamily: 'smartEDU, sans-serif' }}>
                <strong>Note:</strong> Admin only registers students via Excel. Attendance is marked separately.
              </div>
              <div style={{ color: '#c9d1d9', fontSize: 15, marginBottom: 8, fontFamily: 'smartEDU, sans-serif' }}>
                <strong>Bulk import feature coming soon...</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
