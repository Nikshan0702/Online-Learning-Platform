import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !content) {
      setError('Please fill in all fields (Title, Description, and Content)');
      return;
    }

    try {
      setLoading(true);
      await api.post('/courses', { title, description, content });
      navigate('/instructor');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create course.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container form-page-container">
      <div className="breadcrumbs">
        <Link to="/instructor">← Back to Dashboard</Link>
      </div>

      <div className="form-card">
        <h2>Create New Course</h2>
        <p className="subtitle">Publish a new learning module for students</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Full Stack Development"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what students will achieve..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Course Content / Syllabus</label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Module 1: Getting started&#10;Module 2: Core concepts&#10;Module 3: Hands-on project"
              required
            />
          </div>

          <div className="form-actions">
            <Link to="/instructor" className="btn btn-secondary">
              Cancel
            </Link>
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
