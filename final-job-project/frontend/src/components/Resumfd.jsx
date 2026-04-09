import React, { useState } from 'react';
import api from '../api/api';

const Resumfd = () => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text first');
      setResult('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult('');

      const { data } = await api.post('/resume-ai/analyze', {
        resumeText,
      });

      setResult(data?.result || 'No feedback found');
    } catch (err) {
      console.error('Resume analyze error:', err);
      setError(err?.response?.data?.message || 'Resume analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        Resume Analysis & Feedback
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Paste your resume text and get AI feedback
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <textarea
        rows={12}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume text here"
        className="mt-5 w-full rounded-2xl border p-4 text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="mt-6 whitespace-pre-line rounded-2xl border bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          {result}
        </div>
      )}
    </div>
  );
};

export default Resumfd;