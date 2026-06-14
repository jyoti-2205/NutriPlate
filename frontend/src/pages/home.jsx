import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero-section">
        <div className="hero-content">
          <h1>SafeBite</h1>
          <p>
            Order delicious meals with real-time health warnings based on your
            cholesterol, blood sugar, and BMI profile. Eat safe, order smart.
          </p>
          {user ? (
            <div className="hero-actions">
              <Link to="/foods" className="btn btn-primary">Order Food Now</Link>
              <Link to="/dashboard" className="btn btn-outline">My Dashboard</Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <Link to="/register" className="btn btn-outline">Create Account</Link>
            </div>
          )}
        </div>
      </section>

      <div className="page">
        <div className="info-cards">
          <div className="card feature-card">
            <span className="feature-icon">🛡️</span>
            <h3>Health-Safe Ordering</h3>
            <p>Instant warnings when a food item is risky for your health condition.</p>
          </div>
          <div className="card feature-card">
            <span className="feature-icon">🍽️</span>
            <h3>Smart Menu</h3>
            <p>Browse 15+ foods filtered as Safe or Risky specifically for you.</p>
          </div>
          <div className="card feature-card">
            <span className="feature-icon">📊</span>
            <h3>Health Tracking</h3>
            <p>Monitor cholesterol, sugar levels, and BMI all in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
