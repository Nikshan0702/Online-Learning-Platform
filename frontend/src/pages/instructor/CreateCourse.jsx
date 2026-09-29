import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const CreateCourse = () => {
  const [form, setForm] = useState({ title: '', description: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await api.post('/courses', form);
      navigate('/instructor');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Link to="/instructor" className="back-link">← Back to Dashboard</Link>

      <div className="form-page">
        <h2>Create New Course</h2>
        <p className="sub">Add a new course for students to enroll in</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Course Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Full Stack Development" required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief summary of the course..." required />
          </div>
          <div className="field">
            <label>Course Content / Syllabus</label>
            <textarea name="content" rows={8} value={form.content} onChange={handleChange} placeholder="Module 1: Introduction&#10;Module 2: Core Concepts&#10;Module 3: Final Project" required />
          </div>
          <div className="form-actions">
            <Link to="/instructor" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
