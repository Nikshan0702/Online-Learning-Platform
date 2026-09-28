import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses?mine=true');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch your courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setSuccess(`Course "${courseTitle}" deleted successfully.`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete course.';
      setError(msg);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p className="subtitle">Instructor Dashboard — Manage your courses and track enrolled students.</p>
        </div>
        <Link to="/instructor/courses/create" className="btn btn-primary">
          + Create New Course
        </Link>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="section-title">
        <h2>My Courses</h2>
        <span className="badge">{courses.length} created</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading your courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any courses yet.</p>
          <Link to="/instructor/courses/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="instructor-course-list">
          {courses.map((course) => (
            <div key={course._id} className="instructor-card">
              <div className="instructor-card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <small className="created-text">
                  Created on: {new Date(course.createdAt).toLocaleDateString()}
                </small>
              </div>

              <div className="instructor-card-actions">
                <Link
                  to={`/instructor/courses/${course._id}/students`}
                  className="btn btn-info btn-sm"
                >
                  👥 View Students
                </Link>
                <Link
                  to={`/instructor/courses/${course._id}/edit`}
                  className="btn btn-secondary btn-sm"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(course._id, course.title)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
