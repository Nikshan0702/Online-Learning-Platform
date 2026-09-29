import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/enrollments/my-courses')
      .then(res => setEnrollments(res.data))
      .catch(() => setError('Failed to load your courses'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Courses</h1>
          <p>Courses you are enrolled in, {user?.name}.</p>
        </div>
        <Link to="/courses" className="btn btn-secondary">Browse Courses</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : enrollments.length === 0 ? (
        <div className="empty">
          <p>You have not enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Courses</Link>
        </div>
      ) : (
        <div className="card-grid">
          {enrollments.map(item => (
            <div key={item._id} className="card">
              <div className="card-body">
                <div style={{ marginBottom: '0.5rem' }}>
                  <span className="status">{item.status.toUpperCase()}</span>
                </div>
                <h3>{item.course?.title}</h3>
                <p>{item.course?.description}</p>
                <div className="card-meta">
                  By {item.course?.instructor?.name} · Enrolled {new Date(item.enrolledAt).toLocaleDateString()}
                </div>
              </div>
              <div className="card-footer">
                <Link to={`/courses/${item.course?._id}`} className="btn btn-secondary btn-block">View Course</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
