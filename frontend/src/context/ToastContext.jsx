import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((toast) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const next = {
      id,
      type: toast.type || 'info', // success | error | warning | info
      title: toast.title || '',
      message: toast.message || '',
      durationMs: typeof toast.durationMs === 'number' ? toast.durationMs : 3500
    };

    setToasts((prev) => [next, ...prev].slice(0, 3));

    const timer = setTimeout(() => removeToast(id), next.durationMs);
    timersRef.current.set(id, timer);

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts, showToast, removeToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

