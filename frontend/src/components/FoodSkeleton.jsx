import React from 'react';

const FoodSkeleton = ({ count = 6 }) => (
  <div className="food-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card food-card skeleton-card">
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-btn" />
      </div>
    ))}
  </div>
);

export default FoodSkeleton;
