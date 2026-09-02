import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-icon-danger">
          <AlertTriangle size={28} />
        </div>
        <h3 className="modal-title" id="modal-title">
          {title || 'Delete Note'}
        </h3>
        <p className="modal-text">
          {message || 'Are you sure you want to delete this note? This action cannot be undone.'}
        </p>
        <div className="modal-actions">
          <button
            type="button"
            id="modal-cancel-btn"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="modal-confirm-delete-btn"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
