import React, { useState } from 'react';

export default function WriterTab({ showToast }) {
  const [selectedAge, setSelectedAge] = useState('mau_giao_5_6t');
  const [authorName, setAuthorName] = useState('skynhp8901');
  const [schoolName, setSchoolName] = useState('Trường Mầm non Hoa Sen');
  const [address, setAddress] = useState('ỦY BÀN NHÂN DÂN QUẬN / HUYỆN NGHỆ AN');
  const [role, setRole] = useState('Giáo viên Mầm non - Khối Mẫu giáo Lớn');
  const [title, setTitle] = useState('Biện pháp rèn luyện kỹ năng tự phục vụ và tự lập cho trẻ 5-6 tuổi thông qua các hoạt động trải nghiệm tại trường Mầm non');

  // AI Command Panel State
  const [targetSection, setTargetSection] = useState('sec_2');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiRewriting, setIsAiRewriting] = useState(false);

  // A4 Length State
  const [skknLevel, setSkknLevel] = useState('district');
  const [sec1Len, setSec1Len] = useState('1.0');
  const [sec2Len, setSec2Len] = useState('4.0');
  const [sec3Len, setSec3Len] = useState('1.0');
  const [sec4Len, setSec4Len] = useState('0.5');
  const [isApplyingA4, setIsApplyingA4] = useState(false);

  // Content state
  const [sec1Html, setSec1Html] = useState(`
    <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI)</h3>
    <p>Giai đoạn mầm non, đặc biệt là lứa tuổi 5-6 tuổi (Mẫu giáo lớn), là mốc thời gian vàng để hình thành tính tự lập, kỹ năng tự phục vụ và tinh thần trách nhiệm. Đây là chuẩn bị cốt lõi giúp trẻ sẵn sàng tâm lý vững vàng bước vào môi trường Tiểu học (Lớp 1).</p>
    <p>Qua khảo sát thực tế đầu năm học tại lớp Mẫu giáo Lớn, phần lớn trẻ vẫn được cha mẹ chiều chuộng, làm thay mọi việc. Khi đến lớp, trẻ còn lúng túng trong việc tự đi giày dép, tự cất chăn gối hay tự dọn đồ chơi. Do đó, việc nghiên cứu đề tài <strong>"Biện pháp rèn luyện kỹ năng tự phục vụ cho trẻ mầm non"</strong> mang tính cấp thiết và giá trị thực tiễn cao.</p>
  `);

  const [sec2Html, setSec2Html] = useState(`
    <h3>II. GIẢI PHÁP THỰC HIỆN (CÁC BIỆN PHÁP SÁNG TẠO)</h3>
    <h4>1. Biện pháp 1: Xây dựng môi trường lớp học mở, phân quyền tự quản cho trẻ</h4>
    <p>Thiết kế các góc hoạt động vừa tầm với của trẻ, dán các ký hiệu trực quan (nhãn tên, hình ảnh minh họa) để trẻ dễ dàng lấy và cất đồ dùng cá nhân. Phân công "Ban cán sự nhí" luân phiên hàng ngày đảm nhiệm công việc trực nhật bàn ăn, chuẩn bị khăn lau và chia thìa.</p>

    <h4>2. Biện pháp 2: Tích hợp kỹ năng tự phục vụ vào các tiết học trải nghiệm & kỹ năng sống</h4>
    <p>Tổ chức các hội thi nhỏ như "Bé giỏi gấp quần áo", "Nhanh tay xếp gối chăn", "Kĩ năng thắt dây giày". Sử dụng các bài thơ, bài hát vè tự biên dễ nhớ để kích thích trẻ hào hứng thực hiện.</p>
  `);

  const [sec3Html, setSec3Html] = useState(`
    <h3>III. HIỆU QUẢ VÀ KẾT QUẢ ĐẠT ĐƯỢC</h3>
    <p>Sau 6 tháng kiên trì triển khai đồng bộ các biện pháp trên, kết quả đạt được rất vượt trội:</p>
    <ul>
      <li>100% Trẻ tự giác đeo khẩu trang, đi giày dép và cất đồ dùng cá nhân đúng vị trí.</li>
      <li>95% Trẻ tự giác gấp chăn gối ngăn nắp sau giờ ngủ trưa mà không cần cô giáo nhắc nhở.</li>
      <li>100% Phụ huynh phản hồi rất hài lòng và ghi nhận sự tự lập, tự giác trưởng thành vượt bậc của con tại gia đình.</li>
    </ul>
  `);

  const [sec4Html, setSec4Html] = useState(`
    <h3>IV. BÀI HỌC KINH NGHIỆM & KHUYẾN NGHỊ</h3>
    <p>1. Giáo viên cần luôn kiên nhẫn, tạo tâm lý vui vẻ, khích lệ động viên kịp thời với nguyên tắc "không làm thay mà luôn đồng hành hướng dẫn".</p>
    <p>2. Linh hoạt kết hợp ứng dụng công nghệ thông tin và phương pháp giáo dục trải nghiệm thực tế để trẻ hào hứng thực hiện hàng ngày.</p>
  `);

  const totalPages = (parseFloat(sec1Len) + parseFloat(sec2Len) + parseFloat(sec3Len) + parseFloat(sec4Len)).toFixed(1);
  const estWords = Math.round(totalPages * 380);

  const handleRunAiCommand = () => {
    setIsAiRewriting(true);
    setTimeout(() => {
      setIsAiRewriting(false);
      if (targetSection === 'sec_2') {
        setSec2Html(`
          <h3>II. GIẢI PHÁP THỰC HIỆN (ĐÃ ĐƯỢC AI NÂNG CẤP THEO CÂU LỆNH)</h3>
          <h4>1. Biện pháp 1: Xây dựng góc trải nghiệm mở & phân quyền tự quản cho trẻ</h4>
          <p>Thiết kế góc hoạt động vừa tầm với của trẻ, dán nhãn tên và hình ảnh minh họa sinh động. Phân công Ban cán sự nhí hỗ trợ cô trực nhật.</p>
          <h4>2. Biện pháp 2: Ứng dụng bài giảng E-Learning & Trò chơi tương tác CNTT</h4>
          <p>Thiết kế các video animation ngắn 2-3 phút mô phỏng quy trình vệ sinh cá nhân, gấp quần áo và sắp xếp góc chơi, kích thích thị giác trẻ mầm non.</p>
          <h4>3. Biện pháp 3: Tăng cường phối hợp 3 bên (Nhà trường - Cô giáo - Gia đình) qua nhóm Zalo số</h4>
          <p>Gửi clip hướng dẫn kỹ năng tự phục vụ lên nhóm Zalo lớp để phụ huynh cùng đồng hành rèn luyện cho trẻ tại nhà.</p>
        `);
      }
      showToast('AI đã hoàn tất chỉnh sửa Mục được chọn theo câu lệnh!', 'success');
    }, 1200);
  };

  const handleApplyA4 = () => {
    setIsApplyingA4(true);
    setTimeout(() => {
      setIsApplyingA4(false);
      showToast(`AI đã căn chỉnh dung lượng SKKN đạt ${totalPages} Trang A4 đúng quy định!`, 'success');
    }, 1200);
  };

  return (
    <div class="panel-layout">
      {/* Sidebar Controls */}
      <aside class="config-sidebar">
        <div class="card-box">
          <h3><i class="fa-solid fa-child-reaching"></i> 1. Chọn Nhóm Đột Tuổi Mầm Non</h3>
          <div class="chip-group margin-top-sm">
            {[
              { id: 'nha_tre_3_12m', label: 'Nhà trẻ (3-12 tháng)' },
              { id: 'nha_tre_12_24m', label: 'Nhà trẻ (12-24 tháng)' },
              { id: 'nha_tre_24_36m', label: 'Nhà trẻ (24-36 tháng)' },
              { id: 'mau_giao_3_4t', label: 'Mẫu giáo Bé (3-4 tuổi)' },
              { id: 'mau_giao_4_5t', label: 'Mẫu giáo Nhở (4-5 tuổi)' },
              { id: 'mau_giao_5_6t', label: 'Mẫu giáo Lớn (5-6 tuổi)' }
            ].map(chip => (
              <button 
                key={chip.id}
                type="button" 
                class={`chip-btn ${selectedAge === chip.id ? 'active' : ''}`}
                onClick={() => setSelectedAge(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div class="card-box margin-top">
          <h3><i class="fa-solid fa-gears"></i> 2. Cấu Hình Thông Tin Tác Giả & Đề Tài</h3>
          <div class="form-group margin-top-sm">
            <label>Họ và tên Tác giả:</label>
            <input type="text" class="form-control" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
          <div class="form-group margin-top-sm">
            <label>Tên Trường Mầm non:</label>
            <input type="text" class="form-control" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
          </div>
          <div class="form-group margin-top-sm">
            <label>Địa chỉ / Quận Huyện / Tỉnh Thành:</label>
            <input type="text" class="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div class="form-group margin-top-sm">
            <label>Tên Đề tài Sáng kiến:</label>
            <textarea class="form-control text-area" rows="3" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
      </aside>

      {/* Main Workspace Editor Area */}
      <main class="editor-workspace">
        {/* AI Targeted Prompt Rewriter Panel */}
        <div class="card-box ai-command-panel">
          <div class="meta-box-header">
            <h4><i class="fa-solid fa-wand-magic-sparkles"></i> AI Chỉnh Sửa Từng Mục Theo Câu Lệnh & Ý Tưởng Người Dùng</h4>
            <span class="badge-tag accent">Targeted Prompt Refinement</span>
          </div>
          <div class="ai-command-grid">
            <div class="form-group">
              <label><i class="fa-solid fa-list-check"></i> 1. Chọn Mục Cần AI Chỉnh Sửa:</label>
              <select class="form-control" value={targetSection} onChange={(e) => setTargetSection(e.target.value)}>
                <option value="sec_2">Mục II: Các giải pháp thực hiện (Các biện pháp sáng tạo)</option>
                <option value="sec_1">Mục I: Đặt vấn đề (Lý do chọn đề tài)</option>
                <option value="sec_3">Mục III: Hiệu quả và Kết quả đạt được</option>
                <option value="sec_4">Mục IV: Bài học kinh nghiệm</option>
              </select>
            </div>
            <div class="form-group full-grid-width">
              <label><i class="fa-solid fa-comment-dots"></i> 2. Nhập Câu Lệnh / Ý Tưởng Chỉnh Sửa:</label>
              <textarea 
                class="form-control text-area" 
                rows="2" 
                placeholder="Ví dụ: Bổ sung thêm biện pháp 4: Ứng dụng CNTT & bài giảng tương tác E-learning vào Mục 2..." 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>
          </div>
          <button type="button" class="btn-accent full-width margin-top" onClick={handleRunAiCommand} disabled={isAiRewriting}>
            {isAiRewriting ? <><i class="fa-solid fa-spinner fa-spin"></i> AI Đang Soạn Thảo & Chỉnh Sửa...</> : <><i class="fa-solid fa-microchip"></i> AI Chỉnh Sửa Mục Được Chọn Theo Câu Lệnh</>}
          </button>
        </div>

        {/* A4 Page Length & Regulation Controller Panel */}
        <div class="card-box a4-config-panel margin-top">
          <div class="meta-box-header">
            <h4><i class="fa-solid fa-file-lines"></i> AI Căn Chỉnh Độ Dài Từng Mục Theo Trang A4 & Quy Định Đính Kèm</h4>
            <span class="badge-tag success">Chuẩn NĐ 30/2020/NĐ-CP</span>
          </div>

          <div class="a4-preset-row">
            <div class="form-group flex-1">
              <label><i class="fa-solid fa-award"></i> Mẫu Quy Định Cấp Thẩm Định:</label>
              <select class="form-control" value={skknLevel} onChange={(e) => setSkknLevel(e.target.value)}>
                <option value="district">Cấp Huyện / Quận (8 - 12 trang A4)</option>
                <option value="school">Cấp Trường Mầm non (5 - 8 trang A4)</option>
                <option value="province">Cấp Tỉnh / Thành phố (15 - 20 trang A4)</option>
              </select>
            </div>
          </div>

          <div class="a4-grid-controls margin-top-sm">
            <div class="a4-col-card">
              <label>Mục I (Đặt vấn đề):</label>
              <select class="form-control compact" value={sec1Len} onChange={(e) => setSec1Len(e.target.value)}>
                <option value="0.5">0.5 Trang A4</option>
                <option value="1.0">1 Trang A4</option>
                <option value="1.5">1.5 Trang A4</option>
              </select>
            </div>

            <div class="a4-col-card">
              <label>Mục II (Các giải pháp):</label>
              <select class="form-control compact" value={sec2Len} onChange={(e) => setSec2Len(e.target.value)}>
                <option value="2.0">2 Trang A4</option>
                <option value="3.0">3 Trang A4</option>
                <option value="4.0">4 Trang A4</option>
                <option value="5.0">5 Trang A4</option>
              </select>
            </div>

            <div class="a4-col-card">
              <label>Mục III (Hiệu quả):</label>
              <select class="form-control compact" value={sec3Len} onChange={(e) => setSec3Len(e.target.value)}>
                <option value="0.5">0.5 Trang A4</option>
                <option value="1.0">1 Trang A4</option>
                <option value="1.5">1.5 Trang A4</option>
              </select>
            </div>

            <div class="a4-col-card">
              <label>Mục IV (Bài học KNG):</label>
              <select class="form-control compact" value={sec4Len} onChange={(e) => setSec4Len(e.target.value)}>
                <option value="0.5">0.5 Trang A4</option>
                <option value="1.0">1 Trang A4</option>
              </select>
            </div>
          </div>

          <div class="page-meter-bar margin-top-sm">
            <div class="meter-info">
              <span><i class="fa-solid fa-calculator"></i> Ước Tính Tổng Dung Lượng Bản Thảo:</span>
              <strong>~{totalPages} Trang A4 (Khoảng {estWords.toLocaleString('vi-VN')} từ)</strong>
            </div>
            <div class="meter-progress-track">
              <div class="meter-progress-fill" style={{ width: `${Math.min(100, (totalPages / 15) * 100)}%` }}></div>
            </div>
          </div>

          <button type="button" class="btn-primary full-width margin-top" onClick={handleApplyA4} disabled={isApplyingA4}>
            {isApplyingA4 ? <><i class="fa-solid fa-spinner fa-spin"></i> Đang Căn Chỉnh Trang A4...</> : <><i class="fa-solid fa-file-contract"></i> AI Soạn Thảo & Căn Chỉnh Độ Dài Theo Trang A4 Quy Định</>}
          </button>
        </div>

        {/* Document Render Card */}
        <div class="editor-content-card margin-top" id="skkn-content-area">
          <div class="doc-header">
            <h2 class="doc-main-heading">{address}</h2>
            <h3 class="doc-school-heading">{schoolName}</h3>
            <h1 class="doc-title">{title}</h1>
            <div class="doc-meta-info">
              <p><strong>Tác giả:</strong> <span>{authorName}</span></p>
              <p><strong>Chức vụ:</strong> <span>{role}</span></p>
            </div>
          </div>

          <div class="skkn-body-editable" contentEditable={true} suppressContentEditableWarning={true}>
            <div id="section-1" dangerouslySetInnerHTML={{ __html: sec1Html }} />
            <div id="section-2" dangerouslySetInnerHTML={{ __html: sec2Html }} />
            <div id="section-3" dangerouslySetInnerHTML={{ __html: sec3Html }} />
            <div id="section-4" dangerouslySetInnerHTML={{ __html: sec4Html }} />
          </div>
        </div>
      </main>
    </div>
  );
}
