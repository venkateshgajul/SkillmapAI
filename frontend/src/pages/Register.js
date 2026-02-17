import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-acid rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-ink-950 text-sm">SM</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-slate-500 text-sm font-body mt-2">Start mapping your skill gaps for free</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="section-label">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Alex Johnson"
                className="input-field"
              />
            </div>
            <div>
              <label className="section-label">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="section-label">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 6 characters"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="acid-btn w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-slate-600 text-xs text-center mt-4 font-body">
            By signing up you agree to our terms of service
          </p>
        </div>

        <p className="text-center text-slate-500 text-sm font-body mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-acid hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
