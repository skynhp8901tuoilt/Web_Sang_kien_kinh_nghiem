import React from 'react';

export default function ToastContainer({ toasts }) {
  return (
    <div class="toast-container" id="toast-container">
      {toasts.map(t => (
        <div key={t.id} class={`toast toast-${t.type}`}>
          <div class="toast-content">
            <i class={`fa-solid ${t.type === 'success' ? 'fa-circle-check text-success' : 'fa-circle-info text-primary'}`}></i>
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
