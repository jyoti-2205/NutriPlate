import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cholesterol: user?.cholesterol ?? '',
    sugar: user?.sugar ?? ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.put(`/auth/profile/${user.id}`, {
        cholesterol: Number(form.cholesterol),
        sugar: Number(form.sugar)
      });
      updateUser(data.user);
      showToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your health stats have been saved. Recommendations will refresh.'
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      showToast({ type: 'error', title: 'Update failed', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        badge="Account"
        icon="✏️"
        title="Edit Health Profile"
        subtitle="Update cholesterol and blood sugar to get accurate food warnings and recommendations."
      />

      <form className="card profile-edit-form" onSubmit={handleSubmit}>
        <p className="hint">Username: <strong>{user?.name}</strong> (cannot be changed)</p>
        {error && <p className="error">{error}</p>}

        <label>
          Cholesterol (mg/dL)
          <input
            type="number"
            min="0"
            step="1"
            value={form.cholesterol}
            onChange={(e) => setForm({ ...form, cholesterol: e.target.value })}
            required
          />
        </label>

        <label>
          Blood Sugar (mg/dL)
          <input
            type="number"
            min="0"
            step="1"
            value={form.sugar}
            onChange={(e) => setForm({ ...form, sugar: e.target.value })}
            required
          />
        </label>

        <div className="profile-edit-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/dashboard" className="btn btn-outline-dark">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
