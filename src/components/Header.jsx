import React from 'react';

export default function Header({ user, sessionTime, onOpenDbModal, onLogout }) {
  const username = user?.username || 'skynhp8901';
  const email = user?.email || 'skynhp8901@gmail.com';
  const loginTime = user?.loginTime || '08/08/2026 09:31:53';

  return (
    <header class="top-header">
      <div class="header-container">
        <div class="logo-area">
          <div class="logo-icon"><i class="fa-solid fa-shapes"></i></div>
          <div class="logo-text">
            <span class="brand-name">MầmNon<span class="highlight">SKKN AI</span></span>
            <span class="brand-sub">Trợ Lý Sáng Kiến Kinh Nghiệm Mầm Non 4.0</span>
          </div>
        </div>

        <div class="user-profile-widget" id="user-widget">
          <div class="user-avatar">
            <img 
              id="user-avatar-img" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
              alt="Tài khoản cá nhân" 
            />
            <span class="status-dot"></span>
          </div>
          <div class="user-info">
            <div class="user-name" id="user-display-name">
              {username} <span class="badge-role" id="user-display-email">{email}</span>
            </div>
            <div class="user-login-time">
              <i class="fa-regular fa-clock"></i> Đăng nhập: <strong id="login-timestamp">{loginTime}</strong> 
              <span class="session-timer"> (Online: <span id="session-counter">{sessionTime}</span>)</span>
            </div>
          </div>
          <button 
            type="button"
            class="btn-icon text-primary" 
            onClick={onOpenDbModal} 
            title="Cấu hình kết nối Supabase DB"
          >
            <i class="fa-solid fa-database"></i>
          </button>
          <button 
            type="button"
            class="btn-icon text-danger" 
            onClick={onLogout} 
            title="Đăng xuất tài khoản cá nhân"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
