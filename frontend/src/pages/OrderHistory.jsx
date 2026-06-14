import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import FoodImage from '../components/FoodImage';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { formatPrice } from '../utils/formatPrice';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/orders/${user.id}`);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  return (
    <div className="page">
      <PageHeader
        badge="Your Orders"
        icon="📦"
        title="Order History"
        subtitle="All meals you have ordered through SafeBite."
      />

      {loading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="card stat-card">
              <div className="stat-icon green">📋</div>
              <div>
                <span className="label">Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon blue">💰</div>
              <div>
                <span className="label">Total Spent</span>
                <strong>{formatPrice(totalSpent)}</strong>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="card order-history-empty">
              <p>No orders yet.</p>
              <Link to="/foods" className="btn btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <div className="order-history-list">
              {orders.map((order) => (
                <article key={order.id} className="card order-history-card">
                  <div className="order-history-thumb">
                    <FoodImage src={order.image} alt={order.food_name} />
                  </div>
                  <div className="order-history-body">
                    <div className="order-history-top">
                      <h3>{order.food_name}</h3>
                      <span className="food-price">{formatPrice(order.total_price)}</span>
                    </div>
                    <p className="food-meta">
                      Qty: {order.quantity} · {order.category} · Cholesterol: {order.cholesterol} mg
                    </p>
                    <p className="order-history-meta">
                      Order #{order.id} · {formatDate(order.created_at)} · {order.status}
                      {order.acknowledged_risk ? ' · Risk acknowledged' : ''}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;
