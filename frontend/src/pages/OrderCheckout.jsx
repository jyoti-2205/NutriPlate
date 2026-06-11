import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import FoodImage from '../components/FoodImage';
import HealthWarningModal from '../components/HealthWarningModal';
import PageHeader from '../components/PageHeader';
import { getHealthProfile, getHealthSummary } from '../utils/healthCheck';
import { calcTotal, formatPrice } from '../utils/formatPrice';

const OrderCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const food = location.state?.food;
  const riskInfo = location.state?.riskInfo;

  const [quantity, setQuantity] = useState(1);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const health = getHealthProfile(user);
  const healthAlerts = getHealthSummary(health);
  const subtotal = calcTotal(food?.price, quantity);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!food) navigate('/foods', { replace: true });
  }, [food, navigate]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        userId: user.id,
        foodId: food.id,
        quantity,
        acknowledgedRisk: Boolean(riskInfo?.isRisky)
      });
      navigate('/order/success', {
        state: { food, quantity, totalPrice: data.totalPrice || total }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!food) return null;

  return (
    <div className="page">
      <PageHeader
        badge="Checkout"
        title="Confirm Your Order"
        subtitle="Review item, price breakdown, and your health profile."
      />

      <div className="step-progress">
        <span className="step-dot done" />
        <span className="step-dot active" />
      </div>
      <span className="step-label">Step 2 of 2 — Payment Summary</span>

      <div className="checkout-grid">
        <div className="card order-summary">
          <FoodImage src={food.image} alt={food.name} className="checkout-food-img" />
          <h2>{food.name}</h2>
          <p className="food-meta">Cholesterol: {food.cholesterol} mg · {food.category}</p>

          <div className="qty-row">
            <span className="label">Quantity</span>
            <div className="qty-controls">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
            </div>
          </div>

          <div className="bill-summary">
            <div className="bill-row">
              <span>Item price</span>
              <span>{formatPrice(food.price)}</span>
            </div>
            <div className="bill-row">
              <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="bill-row">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="bill-row bill-total">
              <span>Total Amount</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="card health-panel">
          <h3>Your Health Profile</h3>
          <div className="health-values">
            <div className="health-value-item">
              <span className="label">Cholesterol</span>
              <strong>{health.cholesterol} mg/dL</strong>
            </div>
            <div className="health-value-item">
              <span className="label">Blood Sugar</span>
              <strong>{health.sugar} mg/dL</strong>
            </div>
            <div className="health-value-item">
              <span className="label">BMI</span>
              <strong>{health.bmi ?? '—'}{health.bmi ? ` (${health.bmiCategory})` : ''}</strong>
            </div>
          </div>
          {healthAlerts.length > 0 && (
            <div className="health-alert-box">
              <strong>Health Alerts</strong>
              <ul>
                {healthAlerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {riskInfo?.isRisky && (
        <div className="card final-warning-banner">
          <h3>Final Health Warning</h3>
          <p>
            Ordering <strong>{food.name}</strong> for <strong>{formatPrice(total)}</strong> despite health risks.
            Cholesterol: {health.cholesterol}, Sugar: {health.sugar}
            {health.bmi ? `, BMI: ${health.bmi}` : ''}.
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="checkout-actions">
        <button type="button" className="btn btn-outline-dark" onClick={() => navigate('/foods')}>
          Back to Menu
        </button>
        <button
          type="button"
          className={`btn ${riskInfo?.isRisky ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => (riskInfo?.isRisky ? setShowFinalWarning(true) : handlePlaceOrder())}
          disabled={placing}
        >
          {placing ? 'Placing Order...' : `Pay ${formatPrice(total)}`}
        </button>
      </div>

      <HealthWarningModal
        open={showFinalWarning}
        variant="danger"
        title="Final Warning — Confirm Risky Order"
        message={`You are about to pay ${formatPrice(total)} for a risky meal. Your health values:`}
        reasons={[
          `Cholesterol: ${health.cholesterol} mg/dL`,
          `Blood Sugar: ${health.sugar} mg/dL`,
          health.bmi ? `BMI: ${health.bmi} (${health.bmiCategory})` : 'BMI: Not calculated',
          ...(riskInfo?.reasons || [])
        ]}
        cancelText="Cancel Order"
        confirmText="Yes, Pay Anyway"
        onCancel={() => setShowFinalWarning(false)}
        onConfirm={() => { setShowFinalWarning(false); handlePlaceOrder(); }}
      />
    </div>
  );
};

export default OrderCheckout;
