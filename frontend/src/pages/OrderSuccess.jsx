import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FoodImage from '../components/FoodImage';
import { formatPrice } from '../utils/formatPrice';

const OrderSuccess = () => {
  const location = useLocation();
  const { food, quantity, totalPrice } = location.state || {};

  return (
    <div className="page success-page">
      <div className="card success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        {food && (
          <div className="success-order-detail">
            <FoodImage src={food.image} alt={food.name} className="success-food-img" />
            <p>
              <strong>{quantity}x {food.name}</strong>
            </p>
            <p className="success-amount">Paid: {formatPrice(totalPrice || food.price * quantity)}</p>
          </div>
        )}
        <p className="hint">Your order is being prepared. Eat healthy!</p>
        <div className="checkout-actions" style={{ marginTop: '1.5rem' }}>
          <Link to="/foods" className="btn btn-primary">Order More</Link>
          <Link to="/dashboard" className="btn btn-outline-dark">Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
