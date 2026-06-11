import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

const AdminLogin = () => {
  const { admin, login } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.username.trim(), form.password);
      showToast({
        type: 'success',
        title: 'Admin login',
        message: `Welcome, ${data.admin.displayName}`
      });
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid admin credentials';
      setError(msg);
      showToast({ type: 'error', title: 'Access denied', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout admin-auth-layout">
      <div className="auth-banner admin-banner">
        <h2>Admin Portal</h2>
        <p>Authorized personnel only. Manage NutriPlate menu items from here.</p>
        <ul>
          <li>Add new food items</li>
          <li>Update menu &amp; prices</li>
          <li>Remove discontinued dishes</li>
        </ul>
        <p className="hint admin-hint">Regular users cannot access this area.</p>
      </div>
      <div className="auth-page">
        <form className="auth-form card admin-login-form" onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          {error && <p className="error">{error}</p>}
          <label>
            Admin Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="admin username"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Admin Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="admin password"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Enter Admin Panel'}
          </button>
          <p className="auth-footer-text">
            <Link to="/">← Back to NutriPlate home</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
