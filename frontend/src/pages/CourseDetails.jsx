import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(() => setError('Course not found'))
      .finally(() => setLoading(false));

    if (isStudent) {
      api.get('/enrollments/my-courses')
        .then(res => setEnrolled(res.data.some(e => e.course?._id === id)))
        .catch(() => {});
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const res = await api.post('/enrollments', { courseId: id });
      setEnrollMsg(res.data.message);
      setEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;

  if (!course) return (
    <div className="page">
      <div className="empty">{error}</div>
      <Link to="/courses" className="btn btn-secondary" style={{ marginTop: '1rem' }}>← Back</Link>
    </div>
  );

  return (
    <div className="page">
      <Link to="/courses" className="back-link">← Back to Courses</Link>

      <div className="detail-box">
        <h1>{course.title}</h1>
        <p className="instructor">By {course.instructor?.name} · {course.instructor?.email}</p>

        {enrollMsg && <div className="alert alert-success" style={{ marginTop: '1rem' }}>{enrollMsg}</div>}
        {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

        <div className="section">
          <h3>Description</h3>
          <p>{course.description}</p>
        </div>

        <div className="section">
          <h3>Course Content</h3>
          <div className="content-block">{course.content}</div>
        </div>

        {isStudent && (
          <div className="enroll-area">
            {enrolled ? (
              <div className="enrolled-msg">You are enrolled in this course</div>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary">
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
