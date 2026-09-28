import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState('');
  const [error, setError] = useState('');
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (isStudent) checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch {
      setError('Course not found.');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await api.get('/enrollments/my-courses');
      const enrolled = res.data.some((item) => item.course?._id === id);
      setAlreadyEnrolled(enrolled);
    } catch {
      // ignore
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError('');
      const res = await api.post('/enrollments', { courseId: id });
      setEnrollSuccess(res.data.message);
      setAlreadyEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="page-container loading-state">Loading...</div>;

  if (!course) {
    return (
      <div className="page-container empty-state">
        <p>{error || 'Course not found'}</p>
        <Link to="/courses" className="btn btn-secondary">← Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/courses">← Back to Courses</Link>
      </div>

      <div className="course-detail-card">
        <div className="course-detail-header">
          <h1>{course.title}</h1>
          <p className="course-detail-instructor">
            👤 Taught by <strong>{course.instructor?.name}</strong> ({course.instructor?.email})
          </p>
        </div>

        {enrollSuccess && <div className="alert alert-success">{enrollSuccess}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="course-detail-section">
          <h3>Overview</h3>
          <p className="course-detail-desc">{course.description}</p>
        </div>

        <div className="course-detail-section">
          <h3>Course Content</h3>
          <div className="course-content-box">
            <pre className="content-pre">{course.content}</pre>
          </div>
        </div>

        {isStudent && (
          <div className="course-action-section">
            {alreadyEnrolled ? (
              <div className="enrolled-badge">✅ You are enrolled in this course (Status: Active)</div>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary btn-lg">
                {enrolling ? 'Enrolling...' : 'Enroll in this Course'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
