import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'nutriplate_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCart = (food, quantity = 1) => {
    const next = [...items];
    const idx = next.findIndex((i) => i.food.id === food.id);
    if (idx >= 0) {
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
    } else {
      next.push({ food, quantity });
    }
    persist(next);
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodId);
      return;
    }
    persist(items.map((i) => (i.food.id === foodId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (foodId) => {
    persist(items.filter((i) => i.food.id !== foodId));
  };

  const clearCart = () => persist([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, updateQuantity, removeFromCart, clearCart, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
