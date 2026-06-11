import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './src/components/navbar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Home from './src/pages/home';
import Login from './src/pages/login';
import Register from './src/pages/register';
import Dashboard from './src/pages/dashboard';
import FoodList from './src/pages/foodlist';
import Recommendations from './src/pages/Recommendation';
import BMICalculator from './src/pages/BMICalculator';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/foods" element={<ProtectedRoute><FoodList /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/bmi" element={<ProtectedRoute><BMICalculator /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
