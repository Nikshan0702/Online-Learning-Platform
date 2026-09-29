import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>Welcome, {user?.name}. Browse and enroll in available courses.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/my-courses" className="btn btn-secondary">My Courses</Link>
          <Link to="/ai-recommendation" className="btn btn-primary">AI Recommend</Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty">No courses available yet.</div>
      ) : (
        <div className="card-grid">
          {courses.map(course => (
            <div key={course._id} className="card">
              <div className="card-body">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="card-meta">By {course.instructor?.name}</div>
              </div>
              <div className="card-footer">
                <Link to={`/courses/${course._id}`} className="btn btn-secondary btn-block">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
