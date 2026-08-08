import React from 'react';

export default function Navigation({ activeTab, setActiveTab, user, showToast }) {
  const isAdminUser = user?.email === 'skynhp8901@gmail.com' || user?.username === 'skynhp8901';

  const tabs = [
    { id: 'tab-writer', icon: 'fa-wand-magic-sparkles', label: 'AI Viết SKKN' },
    { id: 'tab-plagiarism', icon: 'fa-shield-halved', label: 'Kiểm Trùng Lặp' },
    { id: 'tab-references', icon: 'fa-folder-open', label: 'Đưa Tài Liệu Lên' },
    { id: 'tab-charts', icon: 'fa-chart-pie', label: 'Biểu Đồ & Ảnh' },
    { id: 'tab-slides', icon: 'fa-file-powerpoint', label: 'Slide Thuyết Trình' },
    { id: 'tab-admin', icon: 'fa-user-shield', label: 'Quản Trị Admin', isAdmin: true }
  ];

  const handleTabClick = (t) => {
    if (t.id === 'tab-admin' && !isAdminUser) {
      showToast('Từ chối truy cập! Chỉ duy nhất tài khoản Quản trị viên cá nhân (skynhp8901@gmail.com) mới có quyền vào trang Admin!', 'info');
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
            title={isLocked ? 'Chỉ dành riêng cho skynhp8901@gmail.com' : t.label}
          >
            <i class={`fa-solid ${isLocked ? 'fa-lock' : t.icon}`}></i> {t.label}
            {t.isAdmin && isAdminUser && <span class="badge-role-admin">MASTER</span>}
          </button>
        );
      })}
    </nav>
  );
}
