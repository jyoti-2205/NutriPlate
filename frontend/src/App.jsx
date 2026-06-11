import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ToastViewport from './components/ToastViewport';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import FoodList from './pages/foodlist';
import Recommendations from './pages/Recommendation';
import BMICalculator from './pages/BMICalculator';
import OrderCheckout from './pages/OrderCheckout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import ProfileEdit from './pages/ProfileEdit';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const App = () => (
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="app-shell">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/foods" element={<ProtectedRoute><FoodList /></ProtectedRoute>} />
                    <Route path="/order/checkout" element={<ProtectedRoute><OrderCheckout /></ProtectedRoute>} />
                    <Route path="/order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                    <Route path="/bmi" element={<ProtectedRoute><BMICalculator /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
                <ToastViewport />
              </div>
            </BrowserRouter>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);

export default App;
