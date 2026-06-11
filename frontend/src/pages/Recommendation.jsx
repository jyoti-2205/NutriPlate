import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import FoodImage from '../components/FoodImage';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import NutritionTags from '../components/NutritionTags';
import { formatPrice } from '../utils/formatPrice';

const Recommendations = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const { data: result } = await api.get(`/recommend/${user.id}`);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const safeCount = data?.summary?.safeCount ?? data?.recommendations?.length ?? 0;
  const riskyCount = data?.summary?.riskyCount ?? 0;

  return (
    <div className="page">
      <PageHeader
        badge="AI Suggestions"
        title="Your Recommendations"
        subtitle="Only foods that are safe for your cholesterol and sugar profile. Order Food lists the full menu."
      />

      {loading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-icon red">❤</div>
              <div>
                <span className="label">Cholesterol</span>
                <strong>{data.userHealth.cholesterol} mg/dL</strong>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon amber">🩸</div>
              <div>
                <span className="label">Blood Sugar</span>
                <strong>{data.userHealth.sugar} mg/dL</strong>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon green">✓</div>
              <div>
                <span className="label">Safe Foods</span>
                <strong>{safeCount}</strong>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon red">!</div>
              <div>
                <span className="label">Not Recommended</span>
                <strong>{riskyCount}</strong>
              </div>
            </div>
          </div>

          {safeCount === 0 && !loading && (
            <p className="menu-count">No safe recommendations for your profile right now. Check Order Food for the full menu.</p>
          )}

          <div className="food-grid" style={{ marginTop: '1.5rem' }}>
            {data.recommendations.map((food) => (
              <article key={food.id} className={`card food-card ${food.status?.toLowerCase()}`}>
                <div className="food-image-wrap">
                  <FoodImage src={food.image} alt={food.name} />
                  <span className={`badge food-badge ${food.status?.toLowerCase()}`}>{food.status}</span>
                </div>
                <div className="food-card-body">
                  <div className="food-title-row">
                    <h3>{food.name}</h3>
                    <span className="food-price">{formatPrice(food.price)}</span>
                  </div>
                  <p className="food-meta">Cholesterol: {food.cholesterol} mg · {food.meal_type}</p>
                  <NutritionTags tags={food.tags} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;
