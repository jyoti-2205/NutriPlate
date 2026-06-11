import React from 'react';

const HealthWarningModal = ({
  open,
  title,
  message,
  reasons = [],
  onCancel,
  onConfirm,
  confirmText = 'Proceed Anyway',
  cancelText = 'Cancel',
  variant = 'warning'
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className={`modal-card ${variant}`}>
        <div className="modal-icon">{variant === 'danger' ? '🚨' : '⚠️'}</div>
        <h2>{title}</h2>
        <p>{message}</p>
        {reasons.length > 0 && (
          <ul className="warning-list">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button type="button" className="btn btn-outline-dark" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthWarningModal;
