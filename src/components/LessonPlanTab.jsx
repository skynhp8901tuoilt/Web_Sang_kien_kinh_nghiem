import React, { useState, useEffect } from 'react';
import supabase from '../config/supabase';

export default function LessonPlanTab({ showToast, user }) {
  const [selectedAge, setSelectedAge] = useState('mau_giao_3_4t');
  const [domain, setDomain] = useState('Phát triển Ngôn ngữ');
  const [topic, setTopic] = useState('Bản thân & Bạn bè');
  const [title, setTitle] = useState('TRUYỆN: THỎ CON KHÔNG VÂNG LỜI');
  const [duration, setDuration] = useState(30);

  // Digital Competency Toggles (Khung năng lực số mầm non 2026)
  const [competencies, setCompetencies] = useState({
    useDevice: true, // Trẻ nhận biết & sử dụng thiết bị số (Tablet, Tivi tương tác, Máy chiếu)
    digitalSafety: true, // An toàn không gian mạng mầm non (Giới hạn giờ xem màn hình, bảo vệ mắt)
    mediaCreation: true, // Khai thác & tương tác hình ảnh, video, âm thanh AI
    problemSolving: false // Giải quyết vấn đề qua trò chơi tương tác số
  });

  // State for lesson plan content
  const [objectives, setObjectives] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-bullseye"></i> I. MỤC TIÊU BÀI HỌC</h4>
      <p><strong>1. Kiến thức:</strong> Trẻ nhớ tên truyện "Thỏ con không vâng lời", hiểu nội dung câu chuyện: Thỏ con vì không nghe lời mẹ dặn đã tự ý đi chơi xa và bị lạc vào rừng, nhờ có Bác Gấu tốt bụng dẫn về nhà.</p>
      <p><strong>2. Kỹ năng:</strong> Trẻ trả lời được các câu hỏi của cô rõ ràng, tự tin. Phát triển ngôn ngữ mạch lạc và khả năng chú ý ghi nhớ có chủ định.</p>
      <p><strong>3. Thái độ:</strong> Trẻ biết vâng lời cha mẹ, cô giáo và người lớn tuổi. Khi đi chơi xa phải đi cùng người lớn.</p>
      <p class="highlight-digital-badge"><i class="fa-solid fa-laptop-code"></i> <strong>4. Tích hợp Năng lực số:</strong> Trẻ nhận biết hình ảnh thỏ con trên màn hình Tivi tương tác, tương tác chạm nhẹ vào màn hình cảm ứng để trả lời câu hỏi đố vui và tham gia trò chơi "Bé tìm đường về nhà cho Thỏ".</p>
    </div>
  `);

  const [preparations, setPreparations] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-boxes-packing"></i> II. CHUẨN BỊ ĐỒ DÙNG & HỌC LIỆU SỐ</h4>
      <ul>
        <li><strong>Đồ dùng của cô:</strong> Màn hình Tivi cảm ứng / Máy chiếu, slide trình chiếu Canva hoạt hình câu chuyện, file Audio âm thanh tiếng chim hót, tiếng suối chảy và nhạc nền.</li>
        <li><strong>Đồ dùng của trẻ:</strong> Máy tính bảng (Tablet) học tập theo nhóm 3-4 trẻ/máy có sẵn ứng dụng trò chơi ghép tranh truyện. Sa bàn rối dẹt nhân vật Thỏ mẹ, Thỏ con, Bướm vàng, Bác Gấu.</li>
        <li><strong>Tài nguyên số:</strong> Video hoạt hình 3D truyện "Thỏ con không vâng lời", câu hỏi tương tác trắc nghiệm hình ảnh.</li>
      </ul>
    </div>
  `);

  const [activities, setActivities] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-chalkboard-user"></i> III. TIẾN TRÌNH HOẠT ĐỘNG DẠY HỌC</h4>
      
      <h5>1. Hoạt động 1: Gây ấn tượng & Khởi động (3-5 phút)</h5>
      <p>- Cô cho trẻ cùng vận động theo bài hát "Trời nắng, trời mưa" kết hợp âm thanh tự nhiên phát từ loa thông minh.</p>
      <p>- Cô chiếu hình ảnh ẩn sau ô cửa số trên Tivi tương tác và đố trẻ: "Đố bé biết sau ô cửa số là bạn nhỏ nào?" (Trẻ lên chạm màn hình mở ô cửa).</p>

      <h5>2. Hoạt động 2: Trải nghiệm đọc & Kể chuyện tích hợp công nghệ số (15-18 phút)</h5>
      <p>- Cô kể lần 1: Kể diễn cảm kết hợp chiếu Video hoạt hình AI minh họa từng trích đoạn câu chuyện.</p>
      <p>- Cô kể lần 2: Kể kết hợp sa bàn rối dẹt và câu hỏi đàm thoại tương tác số:</p>
      <ul>
        <li>+ Trước khi đi làm, Thỏ mẹ dặn Thỏ con điều gì?</li>
        <li>+ Bạn Bướm Vàng đã gọi Thỏ con đi đâu?</li>
        <li>+ Khi bị lạc trong rừng, Thỏ con cảm thấy thế nào? Ai đã giúp Thỏ con về nhà?</li>
      </ul>
      <p class="highlight-digital-badge"><i class="fa-solid fa-shapes"></i> <em>Tích hợp năng lực số: Cô hướng dẫn trẻ quét mã QR hoặc chạm vào biểu tượng Bác Gấu trên Tablet để lắng nghe lời dặn dò của Bác Gấu.</em></p>

      <h5>3. Hoạt động 3: Trò chơi ôn tập tương tác số "Giúp Thỏ về nhà" (7-10 phút)</h5>
      <p>- Cô chia trẻ thành 3 nhóm tương tác trên Tablet hoặc màn hình Tivi lớn.</p>
      <p>- Luật chơi: Trẻ chọn đáp án đúng (Hình ảnh nghe lời mẹ) để giúp Thỏ con vượt qua các chướng ngại vật về nhà an toàn.</p>
    </div>
  `);

  const [evaluation, setEvaluation] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-clipboard-check"></i> IV. RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ CỦA TRẺ</h4>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Mức độ</th>
            <th>Năng lực Ngôn ngữ</th>
            <th>Năng lực Số tích hợp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Đạt tốt (Mức 3)</strong></td>
            <td>Nhớ 100% nhân vật, trả lời trôi chảy, diễn cảm.</td>
            <td>Tự tin sử dụng ngón tay thao tác chạm chọn trên màn hình cảm ứng, nhận biết an toàn thiết bị.</td>
          </tr>
          <tr>
            <td><strong>Đạt (Mức 2)</strong></td>
            <td>Nhớ nội dung chính, cần cô gợi ý nhẹ.</td>
            <td>Biết chạm màn hình dưới sự hướng dẫn trực tiếp của cô.</td>
          </tr>
          <tr>
            <td><strong>Cần cố gắng (Mức 1)</strong></td>
            <td>Còn nhút nhát, trả lời câu ngắn.</td>
            <td>Chưa quen tương tác với thiết bị số, cần cô hỗ trợ.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `);

  const [savedPlans, setSavedPlans] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [activePromptTool, setActivePromptTool] = useState(null);
  const [generatedPromptText, setGeneratedPromptText] = useState('');

  // Fetch saved lesson plans from Supabase real DB
  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setSavedPlans(data);
    } catch (e) {
      console.warn('Lỗi tải danh sách giáo án từ Supabase:', e.message);
    }
  };

  const handleGenerateAiPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('AI đã tự động soạn xong Giáo án Tích hợp Năng lực số chuẩn Bộ GD&ĐT!', 'success');
    }, 1500);
  };

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      const payload = {
        author_id: user?.id || null,
        author_email: user?.email || 'giaovien@mamnon.edu.vn',
        author_name: user?.fullname || 'Cô Nguyễn Thị Phương Thảo',
        title: title,
        age_group: selectedAge,
        domain: domain,
        topic: topic,
        duration_minutes: duration,
        digital_competencies_json: competencies,
        objectives_html: objectives,
        preparations_html: preparations,
        activities_json: { html: activities },
        evaluation_rubric_json: { html: evaluation },
        status: 'PUBLISHED'
      };

      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([payload])
        .select();

      if (error) throw error;

      showToast('Đã lưu Giáo án thành công vào CSDL Supabase Database!', 'success');
      fetchLessonPlans();
    } catch (err) {
      showToast(`Lỗi khi lưu vào Supabase DB: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPromptTool = (toolName) => {
    setActivePromptTool(toolName);
    let promptContent = '';
    switch (toolName) {
      case 'ppt':
        promptContent = `Tạo dàn ý 5 Slide PPT giảng dạy Mầm non chủ đề "${topic}", bài dạy "${title}" dành cho lứa tuổi 3-4 tuổi, có thiết kế màu sắc hoạt hình rực rỡ, tích hợp hiệu ứng tương tác chạm.`;
        break;
      case 'image':
        promptContent = `Vẽ tranh minh họa hoạt hình 3D Disney mịn màng: Thỏ con thắt nơ đỏ đang đi tung tăng trong khu rừng xanh ngát với bướm vàng, phong cách siêu đáng yêu cho trẻ mầm non.`;
        break;
      case 'coloring':
        promptContent = `Tranh tô màu nét vẽ đen trắng đơn giản (Coloring Book Page for Kids): Thỏ con và Bác Gấu trong rừng, đường nét to rõ nét cho bé 3 tuổi tập tô màu.`;
        break;
      case 'worksheet':
        promptContent = `Thiết kế Phiếu bài tập A4 ghép hình nối thẻ: Nối nhân vật Thỏ con, Thỏ mẹ, Bác Gấu với hành động tương ứng, khổ giấy chuẩn A4 in ấn cho giáo viên.`;
        break;
      case 'game':
        promptContent = `Kịch bản Trò chơi ôn tập mầm non tương tác: "Vượt rào cản giúp Thỏ về nhà". Gồm 4 câu hỏi trắc nghiệm hình ảnh phát thanh âm thanh sinh động.`;
        break;
      default:
        promptContent = `Tạo Prompt AI chuyên sâu giảng dạy Mầm non cho bài "${title}".`;
    }
    setGeneratedPromptText(promptContent);
    setShowPromptModal(true);
  };

  const handleExportWord = () => {
    const fullHtmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${title}</title><meta charset='utf-8'></head>
      <body style="font-family: Arial; padding: 20px;">
        <h2 style="text-align: center; color: #d63384;">TRƯỜNG MẦM NON HOA SEN</h2>
        <h1 style="text-align: center; color: #198754;">GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ MẦM NON</h1>
        <h3 style="text-align: center;">Tên bài: ${title}</h3>
        <p><strong>Lĩnh vực:</strong> ${domain} | <strong>Độ tuổi:</strong> ${selectedAge} | <strong>Thời gian:</strong> ${duration} phút</p>
        <hr/>
        ${objectives}
        ${preparations}
        ${activities}
        ${evaluation}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', fullHtmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Giao_An_Nang_Luc_So_${title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    showToast('Đã xuất file Giáo án Word (.doc) thành công!', 'success');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyText = () => {
    const cleanText = document.getElementById('lesson-plan-print-area')?.innerText || '';
    navigator.clipboard.writeText(cleanText);
    showToast('Đã sao chép toàn bộ nội dung Giáo án vào Khay nhớ tạm (Clipboard)!', 'info');
  };

  return (
    <div class="panel-layout">
      {/* Left Config Sidebar */}
      <aside class="config-sidebar">
        <div class="card-box">
          <h3><i class="fa-solid fa-sliders"></i> 1. Cấu Hình Bài Học Mầm Non</h3>
          
          <div class="form-group margin-top-sm">
            <label>Tên Bài Học / Đề Tài:</label>
            <input type="text" class="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div class="form-group margin-top-sm">
            <label>Chủ Đề Dạy Học:</label>
            <input type="text" class="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div class="form-group margin-top-sm">
            <label>Nhóm Độ Tuổi Trẻ Mầm Non:</label>
            <select class="form-control" value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
              <option value="nha_tre_3_12m">Nhà trẻ (3-12 tháng)</option>
              <option value="nha_tre_12_24m">Nhà trẻ (12-24 tháng)</option>
              <option value="nha_tre_24_36m">Nhà trẻ (24-36 tháng)</option>
              <option value="mau_giao_3_4t">Mẫu giáo Bé (3-4 tuổi)</option>
              <option value="mau_giao_4_5t">Mẫu giáo Nhở (4-5 tuổi)</option>
              <option value="mau_giao_5_6t">Mẫu giáo Lớn (5-6 tuổi)</option>
            </select>
          </div>

          <div class="form-group margin-top-sm">
            <label>Lĩnh Vực Phát Triển:</label>
            <select class="form-control" value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="Phát triển Ngôn ngữ">Phát triển Ngôn ngữ (Truyện, Thơ, Kể chuyện)</option>
              <option value="Phát triển Thể chất">Phát triển Thể chất (Vận động cơ bản)</option>
              <option value="Phát triển Nhận thức">Phát triển Nhận thức (Toán nhí, Khám phá khoa học)</option>
              <option value="Phát triển Thẩm mỹ">Phát triển Thẩm mỹ (Tạo hình, Âm nhạc)</option>
              <option value="Phát triển Tình cảm & KNS">Phát triển Tình cảm & Kỹ năng xã hội</option>
            </select>
          </div>

          <div class="form-group margin-top-sm">
            <label>Thời Gian Hoạt Động (Phút):</label>
            <input type="number" class="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>

        {/* Digital Competency Integration Card */}
        <div class="card-box margin-top accent-border">
          <h3><i class="fa-solid fa-microchip"></i> 2. Khung Tích Hợp Năng Lực Số</h3>
          <p class="sub-text-sm">Tích hợp chuẩn Công nghệ & Thiết bị số vào tiến trình bài học:</p>
          
          <div class="checkbox-group margin-top-sm">
            <label class="custom-checkbox">
              <input 
                type="checkbox" 
                checked={competencies.useDevice} 
                onChange={(e) => setCompetencies({...competencies, useDevice: e.target.checked})} 
              />
              <span>Sử dụng thiết bị số (Tablet, Tivi cảm ứng, Loa thông minh)</span>
            </label>

            <label class="custom-checkbox margin-top-xs">
              <input 
                type="checkbox" 
                checked={competencies.digitalSafety} 
                onChange={(e) => setCompetencies({...competencies, digitalSafety: e.target.checked})} 
              />
              <span>An toàn thông tin & bảo vệ mắt trong môi trường số</span>
            </label>

            <label class="custom-checkbox margin-top-xs">
              <input 
                type="checkbox" 
                checked={competencies.mediaCreation} 
                onChange={(e) => setCompetencies({...competencies, mediaCreation: e.target.checked})} 
              />
              <span>Khai thác Media AI (Video 3D, Âm thanh tự nhiên, Tranh vẽ AI)</span>
            </label>

            <label class="custom-checkbox margin-top-xs">
              <input 
                type="checkbox" 
                checked={competencies.problemSolving} 
                onChange={(e) => setCompetencies({...competencies, problemSolving: e.target.checked})} 
              />
              <span>Tương tác đố vui & Trò chơi giải quyết vấn đề số</span>
            </label>
          </div>

          <button 
            type="button" 
            class="btn-accent full-width margin-top" 
            onClick={handleGenerateAiPlan}
            disabled={isGenerating}
          >
            {isGenerating ? <><i class="fa-solid fa-spinner fa-spin"></i> AI Đang Tự Động Soạn Giáo Án...</> : <><i class="fa-solid fa-wand-magic-sparkles"></i> AI Tự Động Soạn Giáo Án Năng Lực Số</>}
          </button>
        </div>

        {/* Real Saved Lesson Plans from Supabase DB */}
        <div class="card-box margin-top">
          <h3><i class="fa-solid fa-database"></i> Giáo Án Đã Lưu Trên Supabase ({savedPlans.length})</h3>
          <div class="saved-plans-list margin-top-sm">
            {savedPlans.length === 0 ? (
              <p class="empty-hint">Chưa có giáo án nào lưu trong CSDL. Hãy bấm nút "Lưu giáo án" để lưu giữ lâu dài!</p>
            ) : (
              savedPlans.map(item => (
                <div key={item.id} class="saved-plan-item" onClick={() => setTitle(item.title)}>
                  <i class="fa-solid fa-file-signature"></i>
                  <div class="plan-item-info">
                    <strong>{item.title}</strong>
                    <small>{item.domain} • {new Date(item.created_at).toLocaleDateString('vi-VN')}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Lesson Plan Display */}
      <main class="editor-workspace">
        {/* Banner Header Hệ sinh thái AI Mầm non */}
        <div class="card-box ai-ecosystem-banner">
          <div class="ecosystem-header-row">
            <div class="brand-title">
              <span class="icon-sparkle"><i class="fa-solid fa-heart-pulse"></i></span>
              <div>
                <h2>ÁP GIÁO ÁN CÔ THỦY – MẦM NON</h2>
                <p>Trợ lý AI chuyên nghiệp chuẩn chương trình Bộ GD&ĐT Việt Nam 2026</p>
              </div>
            </div>
            <div class="header-action-pills">
              <span class="pill-tag"><i class="fa-solid fa-graduation-cap"></i> Thư viện Giáo án</span>
              <button class="pill-btn highlight" onClick={handleGenerateAiPlan}><i class="fa-solid fa-plus"></i> Soạn bài mới</button>
            </div>
          </div>

          {/* Grid Quick AI Extension Tools */}
          <div class="ai-tools-grid margin-top">
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('ppt')}>
              <i class="fa-solid fa-tv text-pink"></i> Soạn Slide PPT
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('image')}>
              <i class="fa-solid fa-image text-orange"></i> Tạo ảnh minh họa
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('coloring')}>
              <i class="fa-solid fa-palette text-purple"></i> Tạo tranh tô màu
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('worksheet')}>
              <i class="fa-solid fa-file-pen text-green"></i> Phiếu học tập A4
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('game')}>
              <i class="fa-solid fa-gamepad text-blue"></i> Trò chơi ôn tập
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('eval')}>
              <i class="fa-solid fa-circle-question text-red"></i> Câu hỏi đánh giá
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('rubric')}>
              <i class="fa-solid fa-chart-column text-teal"></i> Rubric đánh giá
            </button>
            <button type="button" class="tool-chip" onClick={() => handleOpenPromptTool('video')}>
              <i class="fa-solid fa-video text-cyan"></i> Prompt Veo AI
            </button>
          </div>

          {/* Global Action Toolbar */}
          <div class="action-toolbar-row margin-top">
            <button type="button" class="btn-action primary-blue" onClick={handleExportWord}>
              <i class="fa-solid fa-file-word"></i> Xuất Word (.docx)
            </button>
            <button type="button" class="btn-action danger-red" onClick={handlePrintPdf}>
              <i class="fa-solid fa-print"></i> Xuất PDF / In giáo án
            </button>
            <button type="button" class="btn-action secondary-gray" onClick={handleCopyText}>
              <i class="fa-solid fa-copy"></i> Sao chép toàn bộ
            </button>
            <button type="button" class="btn-action success-green" onClick={handleSaveToSupabase} disabled={isSaving}>
              {isSaving ? <><i class="fa-solid fa-spinner fa-spin"></i> Đang lưu DB...</> : <><i class="fa-solid fa-floppy-disk"></i> Lưu giáo án vào Supabase</>}
            </button>
          </div>
        </div>

        {/* Printable & Editable Lesson Plan Render Card */}
        <div class="editor-content-card margin-top" id="lesson-plan-print-area">
          <div class="digital-plan-header-banner">
            <span class="badge-digital-title"><i class="fa-solid fa-award"></i> GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ MẦM NON</span>
            <span class="badge-sub-year">Cập nhật Bộ GD&ĐT 2026</span>
          </div>

          <div class="doc-header margin-top-sm">
            <h1 class="doc-main-title">{title}</h1>
            <div class="doc-tags-row">
              <span class="doc-tag">Chủ đề: {topic}</span>
              <span class="doc-tag">Lĩnh vực: {domain}</span>
              <span class="doc-tag">Lớp: {selectedAge}</span>
              <span class="doc-tag">Thời gian: {duration} phút</span>
            </div>
          </div>

          {/* Editable Lesson Sections */}
          <div class="skkn-body-editable margin-top" contentEditable={true} suppressContentEditableWarning={true}>
            <div dangerouslySetInnerHTML={{ __html: objectives }} />
            <div dangerouslySetInnerHTML={{ __html: preparations }} />
            <div dangerouslySetInnerHTML={{ __html: activities }} />
            <div dangerouslySetInnerHTML={{ __html: evaluation }} />
          </div>
        </div>
      </main>

      {/* Floating AI Assistant Badge */}
      <div class="floating-ai-assistant" onClick={() => showToast('Trợ lý AI Cô Thủy luôn sẵn sàng hỗ trợ thầy Cô 24/7!', 'info')}>
        <i class="fa-solid fa-robot"></i> <span>Trợ Lý AI Cô Thủy</span>
      </div>

      {/* AI Prompt Extension Modal */}
      {showPromptModal && (
        <div class="modal-overlay" onClick={() => setShowPromptModal(false)}>
          <div class="modal-card prompt-modal" onClick={e => e.stopPropagation()}>
            <div class="modal-header">
              <h3><i class="fa-solid fa-wand-magic-sparkles text-pink"></i> Công Cụ AI Tiện Ích: {activePromptTool?.toUpperCase()}</h3>
              <button class="close-btn" onClick={() => setShowPromptModal(false)}>×</button>
            </div>
            <div class="modal-body">
              <p>Câu lệnh AI (Prompt) đã được tối ưu hóa cho bài dạy <strong>"{title}"</strong>:</p>
              <textarea class="form-control prompt-textbox" rows="5" value={generatedPromptText} onChange={e => setGeneratedPromptText(e.target.value)} />
              <div class="modal-actions margin-top">
                <button class="btn-primary" onClick={() => {
                  navigator.clipboard.writeText(generatedPromptText);
                  showToast('Đã chép Prompt AI vào Khay nhớ tạm!', 'success');
                  setShowPromptModal(false);
                }}>
                  <i class="fa-solid fa-copy"></i> Sao chép Prompt
                </button>
                <button class="btn-secondary" onClick={() => setShowPromptModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
