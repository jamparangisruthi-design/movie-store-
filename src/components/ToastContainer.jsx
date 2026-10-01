import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div style={{ marginTop: '2px' }}>
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isWarning && <AlertTriangle size={18} color="#f59e0b" />}
              {!isSuccess && !isWarning && <Info size={18} color="#06b6d4" />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{toast.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
