import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div>
        <strong className="footer-brand">NutriPlate</strong>
        <span className="footer-tagline">Order smart, eat safe</span>
      </div>
      <div className="footer-links">
        <Link to="/foods">Order Food</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Order History</Link>
        <Link to="/recommendations">Recommendations</Link>
        <Link to="/bmi">BMI Calculator</Link>
      </div>
    </div>
    <p className="footer-copy">&copy; 2026 NutriPlate — Health-Aware Food Ordering</p>
  </footer>
);

export default Footer;
