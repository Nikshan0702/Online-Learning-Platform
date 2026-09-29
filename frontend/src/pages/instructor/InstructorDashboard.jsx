import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses?mine=true')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load your courses'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
      setSuccess(`"${title}" deleted.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Courses</h1>
          <p>Welcome, {user?.name}. Manage your courses below.</p>
        </div>
        <button onClick={() => navigate('/instructor/courses/create')} className="btn btn-primary">+ New Course</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="empty">
          <p>No courses yet.</p>
          <button onClick={() => navigate('/instructor/courses/create')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Create First Course</button>
        </div>
      ) : (
        <div className="rows">
          {courses.map(course => (
            <div key={course._id} className="course-row">
              <div className="course-row-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <small>Created {new Date(course.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="course-row-actions">
                <Link to={`/instructor/courses/${course._id}/students`} className="btn btn-secondary btn-sm">Students</Link>
                <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={() => handleDelete(course._id, course.title)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
