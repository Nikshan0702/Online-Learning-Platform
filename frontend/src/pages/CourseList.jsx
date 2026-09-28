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
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Student Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p className="subtitle">Explore all available courses and enroll to start learning.</p>
        </div>
        <div className="quick-actions">
          <Link to="/my-courses" className="btn btn-secondary">
            📚 My Courses
          </Link>
          <Link to="/ai-recommendation" className="btn btn-primary">
            ✨ AI Recommendation
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="section-title">
        <h2>Available Courses</h2>
        <span className="badge">{courses.length} courses</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <p>No courses available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-body">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-instructor">
                    👤 Instructor: <strong>{course.instructor?.name || 'Instructor'}</strong>
                  </span>
                </div>
              </div>
              <div className="course-card-footer">
                <Link to={`/courses/${course._id}`} className="btn btn-outline btn-block">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
