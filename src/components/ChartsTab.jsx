import React from 'react';

export default function ChartsTab({ showToast }) {
  return (
    <div class="card-box">
      <div class="meta-box-header">
        <h3><i class="fa-solid fa-chart-pie text-accent"></i> Tự Động Tạo Biểu Đồ & Ảnh Minh Họa Sáng Kiến Mầm Non</h3>
        <span class="badge-tag accent">Khảo Sát Thực Tế Đối Chứng</span>
      </div>

      <div class="charts-grid margin-top">
        <div class="chart-card">
          <h4>Biểu đồ 1: Kết quả khảo sát Kỹ năng tự phục vụ của Trẻ (Đầu năm vs Cuối năm)</h4>
          <div class="chart-preview-box">
            <div class="bar-chart-sim">
              <div class="bar-group">
                <span class="bar-label">Tự đi giày dép</span>
                <div class="bar-track">
                  <div class="bar-fill before" style={{ width: '35%' }}>35% Đầu năm</div>
                  <div class="bar-fill after" style={{ width: '100%' }}>100% Cuối năm</div>
                </div>
              </div>
              <div class="bar-group margin-top-sm">
                <span class="bar-label">Gấp chăn gối ngăn nắp</span>
                <div class="bar-track">
                  <div class="bar-fill before" style={{ width: '20%' }}>20% Đầu năm</div>
                  <div class="bar-fill after" style={{ width: '95%' }}>95% Cuối năm</div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn-outline margin-top-sm full-width" onClick={() => showToast('Đã tải xuống biểu đồ minh họa!', 'info')}>
            <i class="fa-solid fa-download"></i> Tải Biểu Đồ Minh Họa (PNG)
          </button>
        </div>
      </div>
    </div>
  );
}
