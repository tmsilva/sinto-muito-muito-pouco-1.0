import React, { useEffect } from 'react';
import { AlertCircleIcon } from '../../icons';
import './Toast.css';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="status">
      <AlertCircleIcon size={16} />
      <span className="toast-message">{message}</span>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={() => onClose(id)}
        aria-label="Fechar notificação"
      >
        &times;
      </button>
    </div>
  );
};
export default Toast;
