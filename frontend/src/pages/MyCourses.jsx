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
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments/my-courses');
      setEnrollments(res.data);
    } catch (err) {
      setError('Failed to fetch your enrolled courses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>My Enrolled Courses</h1>
          <p className="subtitle">Welcome, {user?.name}. Here are the courses you are actively pursuing.</p>
        </div>
        <Link to="/courses" className="btn btn-secondary">
          + Explore More Courses
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your courses...</div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <p>You have not enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {enrollments.map((item) => (
            <div key={item._id} className="course-card">
              <div className="course-card-body">
                <div className="card-top-tag">
                  <span className="status-pill status-active">{item.status.toUpperCase()}</span>
                </div>
                <h3 className="course-title">{item.course?.title || 'Course'}</h3>
                <p className="course-desc">{item.course?.description || 'No description available'}</p>
                <div className="course-meta">
                  <p>
                    👤 Instructor: <strong>{item.course?.instructor?.name || 'Instructor'}</strong>
                  </p>
                  <p className="enrolled-date">
                    📅 Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="course-card-footer">
                {item.course && (
                  <Link to={`/courses/${item.course._id}`} className="btn btn-outline btn-block">
                    View Course Content
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
