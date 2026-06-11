import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <div className="brand-logo" aria-hidden="true">
          <span className="brand-logo-inner">N</span>
        </div>
        <div className="brand-text">
          <span className="brand-title">NutriPlate</span>
          <span className="brand-subtitle">Smart Food Ordering</span>
        </div>
      </Link>

      <div className="nav-links">
        <button type="button" className="btn-theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/foods" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
              Cart{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
            <NavLink to="/recommendations" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
              Tips
            </NavLink>
            <span className="user-badge">{user.name}</span>
            <button type="button" className="btn btn-nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
