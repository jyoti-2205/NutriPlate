import React from 'react';
import { useToast } from '../context/ToastContext';

const iconFor = (type) => {
  if (type === 'success') return '✅';
  if (type === 'error') return '⛔';
  if (type === 'warning') return '⚠️';
  return 'ℹ️';
};

const ToastViewport = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="status">
          <div className="toast-icon" aria-hidden="true">{iconFor(t.type)}</div>
          <div className="toast-content">
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.message && <div className="toast-message">{t.message}</div>}
          </div>
          <button type="button" className="toast-close" onClick={() => removeToast(t.id)} aria-label="Close">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;

