import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', description: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(res => setForm({ title: res.data.title, description: res.data.description, content: res.data.content }))
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      await api.put(`/courses/${id}`, form);
      navigate('/instructor');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading course...</div></div>;

  return (
    <div className="page">
      <Link to="/instructor" className="back-link">← Back to Dashboard</Link>

      <div className="form-page">
        <h2>Edit Course</h2>
        <p className="sub">Update the course details</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Course Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Course Content / Syllabus</label>
            <textarea name="content" rows={8} value={form.content} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <Link to="/instructor" className="btn btn-secondary">Cancel</Link>
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
