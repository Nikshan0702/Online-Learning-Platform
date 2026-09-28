import React, { useState } from 'react';
import api from '../api/axios';

const AiRecommendation = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please tell us what you want to learn.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setRecommendations('');

      const res = await api.post('/gpt/recommend', { prompt });
      setRecommendations(res.data.recommendations || res.data.message || 'No recommendations generated.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to get AI recommendations. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container form-page-container">
      <div className="form-card ai-card">
        <div className="ai-header">
          <span className="ai-icon">🤖</span>
          <h2>AI Course Assistant</h2>
          <p className="subtitle">
            Tell us your career goals or what you'd like to learn, and our AI will recommend the best courses available on our platform!
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label htmlFor="prompt">What do you want to learn?</label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want to become a software engineer. What courses should I follow?"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Analyzing courses...' : '✨ Get Recommendations'}
          </button>
        </form>

        {loading && (
          <div className="loading-state" style={{ marginTop: '2rem' }}>
            <div className="spinner"></div>
            <p>Our AI is searching available platform courses to craft recommendations for you...</p>
          </div>
        )}

        {recommendations && (
          <div className="ai-results-box">
            <h3>Recommendations</h3>
            <div className="ai-content">
              <pre className="recommendation-pre">{recommendations}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendation;
