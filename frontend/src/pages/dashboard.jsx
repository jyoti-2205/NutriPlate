import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { getHealthProfile } from '../utils/healthCheck';
import { calculateHealthScore, getHealthScoreLabel } from '../utils/healthScore';

const Dashboard = () => {
  const { user } = useAuth();
  const profile = getHealthProfile(user);
  const chol = profile.cholesterol;
  const sugar = profile.sugar;
  const healthScore = calculateHealthScore(profile);
  const scoreInfo = getHealthScoreLabel(healthScore);

  return (
    <div className="page">
      <PageHeader
        badge="Your Profile"
        icon="📋"
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name}! Here's your health overview.`}
      />

      <div className="stats-grid">
        <div className="card stat-card health-score-card">
          <div className={`stat-icon ${scoreInfo.className}`}>💯</div>
          <div>
            <span className="label">Health Score</span>
            <strong>{healthScore}/100</strong>
            <span className={`score-label ${scoreInfo.className}`}>{scoreInfo.label}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className={`stat-icon ${chol > 200 ? 'red' : chol > 180 ? 'amber' : 'green'}`}>❤️</div>
          <div>
            <span className="label">Cholesterol</span>
            <strong>{user?.cholesterol} mg/dL</strong>
          </div>
        </div>
        <div className="card stat-card">
          <div className={`stat-icon ${sugar > 140 ? 'red' : sugar > 120 ? 'amber' : 'green'}`}>🩸</div>
          <div>
            <span className="label">Blood Sugar</span>
            <strong>{user?.sugar} mg/dL</strong>
          </div>
        </div>
        <div className="card stat-card">
          <div className={`stat-icon ${profile.bmi >= 30 ? 'red' : profile.bmi >= 25 ? 'amber' : profile.bmi ? 'green' : 'blue'}`}>⚖️</div>
          <div>
            <span className="label">BMI</span>
            <strong>{profile.bmi ? profile.bmi : '—'}</strong>
            {profile.bmiCategory && profile.bmiCategory !== 'Not calculated' && (
              <span className="score-label">{profile.bmiCategory}</span>
            )}
          </div>
        </div>
      </div>

      {!profile.bmi && (
        <p className="hint dashboard-hint">
          Calculate your BMI to improve health score accuracy.{' '}
          <Link to="/bmi">Go to BMI Calculator →</Link>
        </p>
      )}

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Quick Actions</h2>
      <div className="quick-links">
        <Link to="/foods" className="card link-card">
          <span className="link-card-icon">🍽️</span>
          Order Food
        </Link>
        <Link to="/cart" className="card link-card">
          <span className="link-card-icon">🛒</span>
          My Cart
        </Link>
        <Link to="/recommendations" className="card link-card">
          <span className="link-card-icon">💡</span>
          Recommendations
        </Link>
        <Link to="/orders" className="card link-card">
          <span className="link-card-icon">📦</span>
          Order History
        </Link>
        <Link to="/profile/edit" className="card link-card">
          <span className="link-card-icon">✏️</span>
          Edit Profile
        </Link>
        <Link to="/bmi" className="card link-card">
          <span className="link-card-icon">⚖️</span>
          BMI Calculator
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
