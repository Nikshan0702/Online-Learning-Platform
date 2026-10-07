import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AiRecommendation = () => {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      setError('');
      setMessage('');
      setCourses([]);
      const res = await api.post('/gpt/recommend', { prompt });
      setMessage(res.data.message || res.data.recommendations || '');
      setCourses(res.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <div>
          <h1>AI Course Recommendations</h1>
          <p>Enter your learning goals (e.g. "I want to be a software engineer, what courses I should follow") to receive personalized course recommendations.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-page form">
        <div className="field">
          <label>What do you want to learn?</label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Analyzing courses...' : 'Get Recommendations'}
        </button>
      </form>

      {message && (
        <div className="ai-note">
          <strong>💡 AI Advisor Recommendation:</strong>
          <p style={{ marginTop: '0.4rem', whiteSpace: 'pre-wrap' }}>{message}</p>
        </div>
      )}

      {courses.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
            Recommended Courses ({courses.length})
          </h2>
          <div className="card-grid">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <div className="card-body">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="card-meta">
                    By {course.instructor?.name || 'Instructor'}
                  </div>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-primary btn-block"
                  >
                    View Course Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRecommendation;
