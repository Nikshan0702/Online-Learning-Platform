import React, { useState } from 'react';
import api from '../api/axios';

const AiRecommendation = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      setError('');
      setResult('');
      const res = await api.post('/gpt/recommend', { prompt });
      setResult(res.data.recommendations);
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
          <p>Tell us what you want to learn and we'll suggest the best courses.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-page form">
        <div className="field">
          <label>What do you want to learn?</label>
          <textarea
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Getting recommendations...' : 'Get Recommendations'}
        </button>
      </form>

      {result && (
        <div className="ai-result">
          <h3>Recommendations</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default AiRecommendation;
