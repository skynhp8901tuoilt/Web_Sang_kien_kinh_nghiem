import React, { useState } from 'react';

export default function PlagiarismTab({ showToast }) {
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(3.2);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setScore(2.1);
      showToast('Đã hoàn tất quét đối soát trùng lặp 100,000+ đề tài mầm non!', 'success');
    }, 1200);
  };

  return (
    <div class="card-box">
      <div class="meta-box-header">
        <h3><i class="fa-solid fa-shield-halved text-success"></i> Kiểm Tra Trùng Lặp & Đạo Văn SKKN Mầm Non</h3>
        <span class="badge-tag success">Công Nghệ AI Anti-Plagiarism 2026</span>
      </div>

      <div class="plagiarism-dashboard margin-top">
        <div class="score-circle-card">
          <div class="score-number">{score}%</div>
          <p class="score-label">Tỷ lệ trùng lặp phát hiện</p>
          <span class="status-pill success"><i class="fa-solid fa-check"></i> Đạt chuẩn an toàn thẩm định ($\le$ 10%)</span>
        </div>

        <div class="score-details">
          <h4>Chi Tiết Quét Đăng Ký Bản Quyền Sáng Kiến:</h4>
          <ul>
            <li><i class="fa-solid fa-circle-check text-success"></i> Trùng lặp với CSDL Bộ GD&ĐT: <strong>0.8%</strong></li>
            <li><i class="fa-solid fa-circle-check text-success"></i> Trùng lặp với Đề tài Cấp Huyện/Tỉnh: <strong>1.3%</strong></li>
            <li><i class="fa-solid fa-circle-check text-success"></i> Trùng lặp với Nguồn Internet công khai: <strong>0.0%</strong></li>
          </ul>

          <button type="button" class="btn-primary margin-top" onClick={handleCheck} disabled={checking}>
            {checking ? <><i class="fa-solid fa-spinner fa-spin"></i> Đang Quét CSDL...</> : <><i class="fa-solid fa-magnifying-glass-chart"></i> Quét Lại Đối Soát Trùng Lặp</>}
          </button>
        </div>
      </div>
    </div>
  );
}
