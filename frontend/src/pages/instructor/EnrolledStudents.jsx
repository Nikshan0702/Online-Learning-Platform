import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const EnrolledStudents = () => {
  const { id } = useParams();
  const [courseName, setCourseName] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/students`),
    ])
      .then(([courseRes, studentsRes]) => {
        setCourseName(courseRes.data.title);
        setStudents(studentsRes.data);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page">
      <Link to="/instructor" className="back-link">← Back to Dashboard</Link>

      <div className="page-header">
        <div>
          <h1>Enrolled Students</h1>
          <p>{courseName}</p>
        </div>
        <span style={{ fontSize: '0.88rem', color: '#666' }}>{students.length} student{students.length !== 1 ? 's' : ''}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : students.length === 0 ? (
        <div className="empty">No students enrolled yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id || i}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td><span className="status">{s.status.toUpperCase()}</span></td>
                  <td>{new Date(s.enrolledAt).toLocaleDateString()}</td>
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
