import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import adminApi from '../api/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';
import FoodImage from '../components/FoodImage';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import NutritionTags from '../components/NutritionTags';
import { formatPrice } from '../utils/formatPrice';

const emptyForm = {
  name: '',
  price: '',
  cholesterol: '',
  category: 'Safe',
  meal_type: 'Veg',
  tags: ''
};

const Admin = () => {
  const { admin, logout } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/foods');
      setFoods(data);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load foods' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFoods(); }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.post('/foods', {
        ...form,
        price: Number(form.price),
        cholesterol: Number(form.cholesterol)
      });
      showToast({ type: 'success', title: 'Added', message: `${form.name} added to menu` });
      setForm(emptyForm);
      loadFoods();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed',
        message: err.response?.data?.message || 'Could not add food — admin login required'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from menu?`)) return;
    try {
      await adminApi.delete(`/foods/${id}`);
      showToast({ type: 'success', title: 'Deleted', message: `${name} removed` });
      loadFoods();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed',
        message: err.response?.data?.message || 'Could not delete food'
      });
    }
  };

  return (
    <div className="page">
      <div className="admin-topbar card">
        <div>
          <strong>Logged in as:</strong> {admin?.displayName || admin?.username}
        </div>
        <button type="button" className="btn btn-nav-logout" onClick={handleLogout}>
          Admin Logout
        </button>
      </div>

      <PageHeader
        badge="Admin"
        icon="⚙️"
        title="Manage Menu"
        subtitle="Add or remove food items from the NutriPlate menu."
      />

      <form className="card profile-edit-form admin-form" onSubmit={handleAdd}>
        <h3 style={{ marginBottom: '0.5rem' }}>Add New Food</h3>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Price (₹)<input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
        <label>Cholesterol (mg)<input type="number" min="0" value={form.cholesterol} onChange={(e) => setForm({ ...form, cholesterol: e.target.value })} required /></label>
        <label>Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Safe">Safe</option>
            <option value="Risky">Risky</option>
          </select>
        </label>
        <label>Meal Type
          <select value={form.meal_type} onChange={(e) => setForm({ ...form, meal_type: e.target.value })}>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </label>
        <label>Tags (comma separated)<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Low Sugar, High Protein" /></label>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Food'}</button>
      </form>

      <h2 style={{ margin: '2rem 0 1rem', fontWeight: 700 }}>Current Menu ({foods.length})</h2>
      {loading ? <LoadingSpinner /> : (
        <div className="food-grid">
          {foods.map((food) => (
            <article key={food.id} className="card food-card">
              <div className="food-image-wrap">
                <FoodImage src={food.image} alt={food.name} />
              </div>
              <div className="food-card-body">
                <h3>{food.name}</h3>
                <p className="food-meta">{formatPrice(food.price)} · {food.meal_type} · {food.category}</p>
                <NutritionTags tags={food.tags} />
                <button type="button" className="btn btn-danger order-btn" onClick={() => handleDelete(food.id, food.name)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
