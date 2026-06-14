import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', cholesterol: '', sugar: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: form.name,
        cholesterol: Number(form.cholesterol),
        sugar: Number(form.sugar),
        password: form.password
      });
      showToast({
        type: 'success',
        title: 'Registered!',
        message: 'Account created successfully. Please login.'
      });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      showToast({
        type: 'error',
        title: 'Registration failed',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <h2>Join SafeBite</h2>
        <p>Create your profile with health stats to get personalized food warnings while ordering.</p>
        <ul>
          <li>Track cholesterol &amp; sugar</li>
          <li>Personalized food alerts</li>
          <li>Safe ordering experience</li>
        </ul>
      </div>
      <div className="auth-page">
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          {error && <p className="error">{error}</p>}
          <label>
            Username
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Choose a username" required />
          </label>
          <label>
            Cholesterol (mg/dL)
            <input type="number" value={form.cholesterol} onChange={(e) => setForm({ ...form, cholesterol: e.target.value })} placeholder="e.g. 180" required />
          </label>
          <label>
            Blood Sugar (mg/dL)
            <input type="number" value={form.sugar} onChange={(e) => setForm({ ...form, sugar: e.target.value })} placeholder="e.g. 95" required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create password" required />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
          <p className="auth-footer-text">
            Already have account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
