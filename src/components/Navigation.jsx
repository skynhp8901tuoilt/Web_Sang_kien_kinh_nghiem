import React from 'react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'tab-writer', icon: 'fa-wand-magic-sparkles', label: 'AI Viết SKKN' },
    { id: 'tab-plagiarism', icon: 'fa-shield-halved', label: 'Kiểm Trùng Lặp' },
    { id: 'tab-references', icon: 'fa-folder-open', label: 'Đưa Tài Liệu Lên' },
    { id: 'tab-charts', icon: 'fa-chart-pie', label: 'Biểu Đồ & Ảnh' },
    { id: 'tab-slides', icon: 'fa-file-powerpoint', label: 'Slide Thuyết Trình' }
  ];

  return (
    <nav class="main-nav">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          class={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
          onClick={() => setActiveTab(t.id)}
        >
          <i class={`fa-solid ${t.icon}`}></i> {t.label}
        </button>
      ))}
    </nav>
  );
}
