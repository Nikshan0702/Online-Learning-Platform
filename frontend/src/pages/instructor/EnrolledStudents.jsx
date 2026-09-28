import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const EnrolledStudents = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseAndStudents();
  }, [id]);

  const fetchCourseAndStudents = async () => {
    try {
      setLoading(true);
      // Fetch course details for title header
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);

      // Fetch enrolled students list
      const studentsRes = await api.get(`/courses/${id}/students`);
      setStudents(studentsRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load enrolled students.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link to="/instructor">← Back to Dashboard</Link>
      </div>

      <div className="dashboard-header">
        <div>
          <h1>Enrolled Students</h1>
          <p className="subtitle">
            Course: <strong>{course?.title || 'Loading...'}</strong>
          </p>
        </div>
        <span className="badge">{students.length} total students</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading enrolled students...</div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <p>No students have enrolled in this course yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id || index}>
                  <td className="font-semibold">{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className="status-pill status-active">{student.status.toUpperCase()}</span>
                  </td>
                  <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrolledStudents;
