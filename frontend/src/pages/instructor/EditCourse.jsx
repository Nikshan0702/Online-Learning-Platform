import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      setTitle(res.data.title || '');
      setDescription(res.data.description || '');
      setContent(res.data.content || '');
    } catch (err) {
      setError('Failed to load course details for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !content) {
      setError('Please fill in all fields (Title, Description, and Content)');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/courses/${id}`, { title, description, content });
      navigate('/instructor');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update course.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-container loading-state">Loading course for editing...</div>;
  }

  return (
    <div className="page-container form-page-container">
      <div className="breadcrumbs">
        <Link to="/instructor">← Back to Dashboard</Link>
      </div>

      <div className="form-card">
        <h2>Edit Course</h2>
        <p className="subtitle">Update course details and syllabus</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              required
            />
          </div>

          <div className="form-actions">
            <Link to="/instructor" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
