import React, { useState } from 'react';

export default function ReferencesTab({ showToast }) {
  const [files, setFiles] = useState([
    { name: 'Quy_dinh_Tham_dinh_SKKN_Mam_non_2026.pdf', size: '2.4 MB', date: '08/08/2026' }
  ]);

  const handleFileUpload = (e) => {
    if (e.target.files.length) {
      const f = e.target.files[0];
      setFiles([
        ...files,
        { name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`, date: 'Vừa xong' }
      ]);
      showToast(`Đã tải lên tệp tham khảo RAG: "${f.name}"!`, 'success');
    }
  };

  return (
    <div class="card-box">
      <div class="meta-box-header">
        <h3><i class="fa-solid fa-folder-open text-primary"></i> Đưa Tài Liệu Tham Khảo Lên (Mô Hình RAG AI)</h3>
        <span class="badge-tag accent">Tự Động Đọc & Trích Xuất Dữ Liệu</span>
      </div>

      <div class="dropzone-area margin-top">
        <i class="fa-solid fa-cloud-arrow-up drop-icon"></i>
        <h4>Kéo thả tệp tài liệu tham khảo (.PDF, .DOCX) vào đây</h4>
        <p>AI sẽ đọc trích xuất nội dung thực tế và tích hợp trực tiếp vào bài Sáng kiến kinh nghiệm</p>
        <input type="file" id="ref-file-input" style={{ display: 'none' }} accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
        <button type="button" class="btn-outline margin-top-sm" onClick={() => document.getElementById('ref-file-input').click()}>
          <i class="fa-solid fa-paperclip"></i> Chọn Tệp Từ Máy Tính
        </button>
      </div>

      <div class="file-list-section margin-top">
        <h4>Danh Sách Tài Liệu Tham Khảo Đã Tải Lên:</h4>
        <ul class="file-list">
          {files.map((file, idx) => (
            <li key={idx} class="file-item">
              <i class="fa-solid fa-file-pdf text-danger"></i>
              <div class="file-info">
                <strong>{file.name}</strong>
                <small>{file.size} - Tải lên: {file.date}</small>
              </div>
              <span class="badge-tag success">Đã Trích Xuất AI</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
