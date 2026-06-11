import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import FoodImage from '../components/FoodImage';
import PageHeader from '../components/PageHeader';
import { assessFoodRisk } from '../utils/healthCheck';
import { calcTotal, formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + calcTotal(i.food.price, i.quantity), 0);
  const deliveryFee = subtotal >= 500 ? 0 : items.length ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!items.length) return;
    setPlacing(true);
    try {
      for (const item of items) {
        const risk = assessFoodRisk(user, item.food);
        await api.post('/orders', {
          userId: user.id,
          foodId: item.food.id,
          quantity: item.quantity,
          acknowledgedRisk: risk.isRisky
        });
      }
      clearCart();
      showToast({ type: 'success', title: 'Order placed', message: 'All cart items ordered successfully!' });
      navigate('/orders');
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Checkout failed',
        message: err.response?.data?.message || 'Could not place order'
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        badge="Your Cart"
        icon="🛒"
        title="Shopping Cart"
        subtitle={`${items.length} item(s) in cart`}
      />

      {items.length === 0 ? (
        <div className="card order-history-empty">
          <p>Your cart is empty.</p>
          <Link to="/foods" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map(({ food, quantity }) => (
              <article key={food.id} className="card cart-item">
                <div className="order-history-thumb">
                  <FoodImage src={food.image} alt={food.name} />
                </div>
                <div className="cart-item-body">
                  <h3>{food.name}</h3>
                  <p className="food-meta">{formatPrice(food.price)} each</p>
                  <div className="qty-controls">
                    <button type="button" onClick={() => updateQuantity(food.id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(food.id, quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <strong>{formatPrice(calcTotal(food.price, quantity))}</strong>
                  <button type="button" className="btn-text-danger" onClick={() => removeFromCart(food.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="card bill-summary-card">
            <div className="bill-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="bill-row"><span>Delivery</span><span>{deliveryFee ? formatPrice(deliveryFee) : 'FREE'}</span></div>
            <div className="bill-row bill-total"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button type="button" className="btn btn-primary order-btn" onClick={handleCheckout} disabled={placing}>
              {placing ? 'Placing orders...' : `Checkout · ${formatPrice(total)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
