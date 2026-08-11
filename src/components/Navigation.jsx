import React from 'react';

export default function Navigation({ activeTab, setActiveTab, user, showToast }) {
  const isAdminUser = user?.system_role === 'ROLE_ADMIN' || user?.email === 'skynhp8901@gmail.com' || user?.username === 'skynhp8901';

  const tabs = [
    { id: 'tab-lesson-plan', icon: 'fa-book-open-reader', label: 'Soạn Giáo Án Năng Lực Số', badge: 'MỚI 2026' },
    { id: 'tab-materials', icon: 'fa-box-archive', label: 'Kho Học Liệu Mầm Non' },
    { id: 'tab-games', icon: 'fa-gamepad', label: 'Trò Chơi Học Tập' },
    { id: 'tab-writer', icon: 'fa-wand-magic-sparkles', label: 'AI Viết SKKN' },
    { id: 'tab-references', icon: 'fa-folder-open', label: 'Tài Liệu Tham Khảo' },
    { id: 'tab-charts', icon: 'fa-chart-pie', label: 'Thống Kê & Báo Cáo' },
    { id: 'tab-admin', icon: 'fa-user-shield', label: 'Quản Trị Admin', isAdmin: true }
  ];

  const handleTabClick = (t) => {
    if (t.id === 'tab-admin' && !isAdminUser) {
      showToast('Từ chối truy cập! Chỉ tài khoản Quản trị viên (ROLE_ADMIN) mới có quyền vào trang Quản trị Admin!', 'info');
      return;
    }
    setActiveTab(t.id);
  };

  return (
    <nav class="main-nav">
      {tabs.map((t) => {
        const isLocked = t.isAdmin && !isAdminUser;
        return (
          <button
            key={t.id}
            type="button"
            class={`nav-btn ${activeTab === t.id ? 'active' : ''} ${t.isAdmin ? 'admin-nav-btn' : ''} ${isLocked ? 'locked-btn' : ''}`}
            onClick={() => handleTabClick(t)}
            title={isLocked ? 'Chỉ dành riêng cho Quản trị viên Admin' : t.label}
          >
            <i class={`fa-solid ${isLocked ? 'fa-lock' : t.icon}`}></i> 
            <span>{t.label}</span>
            {t.badge && <span class="nav-badge-new">{t.badge}</span>}
            {t.isAdmin && isAdminUser && <span class="badge-role-admin">ADMIN</span>}
          </button>
        );
      })}
    </nav>
  );
}
