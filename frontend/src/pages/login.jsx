import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.name, form.password);
      showToast({
        type: 'success',
        title: 'Login successful',
        message: `Welcome, ${form.name}!`
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      showToast({
        type: 'error',
        title: 'Login failed',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <h2>Welcome Back!</h2>
        <p>Login to access personalized food recommendations and health-aware ordering.</p>
        <ul>
          <li>Health-based food warnings</li>
          <li>Smart order checkout</li>
          <li>BMI &amp; health dashboard</li>
        </ul>
      </div>
      <div className="auth-page">
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="hint">Demo: arun_sharma / password123</p>
          {error && <p className="error">{error}</p>}
          <label>
            Username
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. arun_sharma"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="auth-footer-text">
            No account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
