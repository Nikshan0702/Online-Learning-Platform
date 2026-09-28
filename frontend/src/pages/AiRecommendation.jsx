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
      setError('Please enter what you want to learn.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setRecommendations('');
      const res = await api.post('/gpt/recommend', { prompt });
      setRecommendations(res.data.recommendations || 'No recommendations generated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations.');
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
            Enter your learning goals and get personalized course recommendations from our platform.
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
            {loading ? 'Searching courses...' : '✨ Get Recommendations'}
          </button>
        </form>

        {recommendations && (
          <div className="ai-results-box">
            <h3>Recommendations</h3>
            <pre className="recommendation-pre">{recommendations}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendation;
