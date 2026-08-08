import React from 'react';

export default function SlidesTab({ showToast }) {
  return (
    <div class="card-box">
      <div class="meta-box-header">
        <h3><i class="fa-solid fa-file-powerpoint text-danger"></i> Tự Động Tạo Slide Thuyết Trình Sáng Kiến Kinh Nghiệm</h3>
        <span class="badge-tag success">Định Dạng PPTX Mầm Non Tươi Sáng</span>
      </div>

      <div class="slides-preview-section margin-top">
        <div class="slide-card-grid">
          {[
            { num: 1, title: 'Trang Bìa Thuyết Trình SKKN', desc: 'Tên đề tài, Họ tên Tác giả, Trường Mầm non' },
            { num: 2, title: 'Slide 2: Lý do chọn đề tài', desc: 'Đặt vấn đề & Thực trạng khảo sát đầu năm' },
            { num: 3, title: 'Slide 3: Các Giải pháp Sáng tạo', desc: '4 Biện pháp nâng cao kỹ năng cho trẻ mầm non' },
            { num: 4, title: 'Slide 4: Hiệu quả & Kết luận', desc: 'Số liệu đối chứng & Lời cảm ơn Hội đồng' }
          ].map(s => (
            <div key={s.num} class="slide-thumb">
              <div class="slide-header-badge">Slide {s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <button type="button" class="btn-primary margin-top full-width" onClick={() => showToast('Đã tạo thành công bộ Slide PowerPoint (.pptx)!', 'success')}>
          <i class="fa-solid fa-file-powerpoint"></i> Tải Bộ Slide Thuyết Trình PowerPoint (.PPTX)
        </button>
      </div>
    </div>
  );
}
