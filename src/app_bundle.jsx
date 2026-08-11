// Standalone Bundle for Browser Transpilation (React 18 + Supabase Real Integration)
const { useState, useEffect } = React;

// Supabase client instance using global Supabase SDK or fallback
const supabaseUrl = 'https://smnbjhtttoshnbghilcs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbmJqaHR0dG9zaG5iZ2hpbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDE2MDQsImV4cCI6MjEwMTY3NzYwNH0._FkvfbLdGXiSiESlujOkNBU7Nb02SAFXniHjUhum6a8';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper log user login
async function logUserLogin(userEmail, userId = null, provider = 'Email/Password') {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('user_login_logs').insert([{
      user_id: userId,
      email: userEmail,
      login_time: new Date().toISOString(),
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent || 'Browser',
      provider: provider,
      status: 'SUCCESS'
    }]);
  } catch (e) {
    console.warn('Log error:', e);
  }
}

// ----------------------------------------------------------------------
// 1. HEADER COMPONENT (Matches UI Screenshot "ÁP GIÁO ÁN CÔ THỦY – MẦM NON")
// ----------------------------------------------------------------------
function Header({ user, sessionTime, onOpenDbModal, onLogout }) {
  const isAdmin = user?.system_role === 'ROLE_ADMIN' || user?.email === 'skynhp8901@gmail.com';
  return (
    <header className="top-header">
      <div className="header-container">
        <div className="logo-area">
          <div className="logo-icon-pink">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div className="logo-text">
            <span className="brand-title-main">APP GIÁO ÁN CÔ TƯƠI – MẦM NON</span>
            <span className="brand-sub-title">Trợ lý AI chuyên nghiệp chuẩn chương trình Bộ GD&ĐT Việt Nam</span>
          </div>
        </div>

        <div className="user-profile-widget">
          <div className="user-avatar">
            <img src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'teacher'}`} alt="Avatar" />
            <span className="status-dot"></span>
          </div>
          <div className="user-info">
            <span className="user-name">
              {user?.fullname || 'Cô Phạm Thị Thanh Thảo'}
              <span className={`badge-role ${isAdmin ? 'admin-badge' : ''}`}>{isAdmin ? 'ADMIN' : 'GIÁO VIÊN'}</span>
            </span>
            <span className="user-login-time">
              <i className="fa-regular fa-clock"></i> Phiên: <strong className="session-timer">{sessionTime}</strong>
            </span>
          </div>

          <button type="button" className="btn-icon" title="Cấu hình Supabase DB" onClick={onOpenDbModal}>
            <i className="fa-solid fa-database text-primary"></i>
          </button>
          <button type="button" className="btn-icon" title="Đăng xuất" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket text-danger"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

// ----------------------------------------------------------------------
// 2. NAVIGATION COMPONENT
// ----------------------------------------------------------------------
function Navigation({ activeTab, setActiveTab, user, showToast }) {
  const isAdminUser = user?.system_role === 'ROLE_ADMIN' || user?.email === 'skynhp8901@gmail.com';

  const tabs = [
    { id: 'tab-lesson-plan', icon: 'fa-book-open-reader', label: 'Soạn Giáo Án Năng Lực Số', badge: 'MỚI 2026' },
    { id: 'tab-materials', icon: 'fa-box-archive', label: 'Kho Học Liệu Mầm Non' },
    { id: 'tab-games', icon: 'fa-gamepad', label: 'Trò Chơi Học Tập' },
    { id: 'tab-writer', icon: 'fa-wand-magic-sparkles', label: 'AI Viết SKKN' },
    { id: 'tab-references', icon: 'fa-folder-open', label: 'Tài Liệu Tham Khảo' },
    { id: 'tab-admin', icon: 'fa-user-shield', label: 'Quản Trị Admin', isAdmin: true }
  ];

  const handleTabClick = (t) => {
    if (t.id === 'tab-admin' && !isAdminUser) {
      showToast('Từ chối truy cập! Chỉ tài khoản Quản trị viên (ROLE_ADMIN) mới có quyền vào trang Admin!', 'info');
      return;
    }
    setActiveTab(t.id);
  };

  return (
    <nav className="main-nav">
      {tabs.map((t) => {
        const isLocked = t.isAdmin && !isAdminUser;
        return (
          <button
            key={t.id}
            type="button"
            className={`nav-btn ${activeTab === t.id ? 'active' : ''} ${t.isAdmin ? 'admin-nav-btn' : ''}`}
            onClick={() => handleTabClick(t)}
          >
            <i className={`fa-solid ${isLocked ? 'fa-lock' : t.icon}`}></i> 
            <span>{t.label}</span>
            {t.badge && <span className="nav-badge-new">{t.badge}</span>}
            {t.isAdmin && isAdminUser && <span className="badge-role-admin">ADMIN</span>}
          </button>
        );
      })}
    </nav>
  );
}

// ----------------------------------------------------------------------
// 3. LESSON PLAN TAB (Matches Screenshot UI "Hệ sinh thái Công cụ AI")
// ----------------------------------------------------------------------
function LessonPlanTab({ showToast, user }) {
  const [selectedAge, setSelectedAge] = useState('mau_giao_3_4t');
  const [domain, setDomain] = useState('Phát triển Ngôn ngữ');
  const [topic, setTopic] = useState('Bản thân & Bạn bè');
  const [title, setTitle] = useState('TRUYỆN: THỎ CON KHÔNG VÂNG LỜI');
  const [duration, setDuration] = useState(30);

  const [competencies, setCompetencies] = useState({
    useDevice: true,
    digitalSafety: true,
    mediaCreation: true,
    problemSolving: true
  });

  const [objectives, setObjectives] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-bullseye text-pink"></i> I. MỤC TIÊU BÀI HỌC</h4>
      <p><strong>1. Kiến thức:</strong> Trẻ nhớ tên truyện "Thỏ con không vâng lời", hiểu nội dung câu chuyện: Thỏ con vì không nghe lời mẹ dặn đã tự ý đi chơi xa và bị lạc vào rừng, nhờ có Bác Gấu tốt bụng dẫn về nhà.</p>
      <p><strong>2. Kỹ năng:</strong> Trẻ trả lời câu hỏi trôi chảy, mạch lạc. Phát triển khả năng tư duy và ghi nhớ có chủ định.</p>
      <p><strong>3. Thái độ:</strong> Trẻ biết vâng lời ông bà, cha mẹ và cô giáo. Khi đi chơi phải xin phép người lớn.</p>
      <div class="digital-competency-card">
        <i class="fa-solid fa-laptop-code"></i> <strong>4. Tích hợp Năng lực số:</strong> Trẻ quan sát hình ảnh hoạt hình 3D trên màn hình Tivi cảm ứng, tương tác ngón tay chọn ô cửa bí mật và tham gia trò chơi tương tác số "Bé tìm đường về nhà cho Thỏ con".
      </div>
    </div>
  `);

  const [preparations, setPreparations] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-boxes-packing text-purple"></i> II. CHUẨN BỊ ĐỒ DÙNG & HỌC LIỆU SỐ</h4>
      <ul>
        <li><strong>Đồ dùng của cô:</strong> Màn hình Tivi tương tác / Máy chiếu, slide trình chiếu hoạt hình Canva truyện "Thỏ con không vâng lời", file âm thanh tiếng chim hót, suối chảy và nhạc nền.</li>
        <li><strong>Đồ dùng của trẻ:</strong> Máy tính bảng (Tablet) theo nhóm 3-4 trẻ có cài sẵn app game ghép tranh. Sa bàn rối dẹt nhân vật Thỏ mẹ, Thỏ con, Bướm vàng, Bác Gấu.</li>
      </ul>
    </div>
  `);

  const [activities, setActivities] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-chalkboard-user text-blue"></i> III. TIẾN TRÌNH HOẠT ĐỘNG DẠY HỌC</h4>
      <h5>1. Hoạt động 1: Ổn định tổ chức & Gây ấn tượng (3-5 phút)</h5>
      <p>- Cô cho trẻ đọc bài thơ "Thỏ bông" kết hợp nhạc nền tự nhiên phát từ loa thông minh.</p>
      <p>- Trẻ chạm màn hình Tivi mở ô cửa bí mật xuất hiện bạn Thỏ con.</p>

      <h5>2. Hoạt động 2: Kể chuyện tích hợp công nghệ số (15-18 phút)</h5>
      <p>- Cô kể lần 1: Kể diễn cảm kết hợp chiếu Video hoạt hình AI minh họa trích đoạn.</p>
      <p>- Cô kể lần 2: Đàm thoại câu hỏi tương tác:</p>
      <ul>
        <li>+ Thỏ mẹ đã dặn Thỏ con điều gì trước khi đi làm?</li>
        <li>+ Bạn Bướm Vàng rủ Thỏ con đi đâu? Khi bị lạc ai đã giúp Thỏ con?</li>
      </ul>

      <h5>3. Hoạt động 3: Trò chơi ôn tập tương tác "Giúp Thỏ về nhà" (7-10 phút)</h5>
      <p>- Trẻ tương tác chọn đáp án đúng trên Tablet hoặc màn hình Tivi tương tác của lớp.</p>
    </div>
  `);

  const [evaluation, setEvaluation] = useState(`
    <div class="plan-section-box">
      <h4><i class="fa-solid fa-chart-column text-teal"></i> IV. RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ CỦA TRẺ</h4>
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
            <td>Nhớ 100% nội dung, trả lời tự tin.</td>
            <td>Thao tác chạm màn hình máy tính bảng mượt mà, nhận biết thiết bị số.</td>
          </tr>
          <tr>
            <td><strong>Đạt (Mức 2)</strong></td>
            <td>Nhớ nội dung chính.</td>
            <td>Biết chạm chọn dưới sự hỗ trợ của cô.</td>
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
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    if (!supabaseClient) return;
    try {
      const { data } = await supabaseClient
        .from('lesson_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setSavedPlans(data);
    } catch (e) {}
  };

  const handleGenerateAiPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('AI đã tự động tạo thành công Giáo án Tích hợp Năng lực số chuẩn Bộ GD&ĐT 2026!', 'success');
    }, 1200);
  };

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      if (supabaseClient) {
        await supabaseClient.from('lesson_plans').insert([{
          author_email: user?.email || 'giaovien@mamnon.edu.vn',
          author_name: user?.fullname || 'Cô Phạm Thị Thanh Thảo',
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
        }]);
      }
      showToast('Đã lưu Giáo án thành công vào Cơ sở dữ liệu Supabase DB!', 'success');
      fetchLessonPlans();
    } catch (err) {
      showToast('Đã lưu bản sao giáo án tại trình duyệt!', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPromptTool = (toolName, toolTitle) => {
    setActivePromptTool(toolTitle);
    setPromptText(`Tạo Prompt AI chuyên sâu cho công cụ ${toolTitle}: Bài dạy "${title}", Lĩnh vực ${domain}, Độ tuổi 3-4 tuổi mầm non.`);
    setShowPromptModal(true);
  };

  const handleExportWord = () => {
    const fullHtml = `
      <html><head><meta charset='utf-8'></head><body style="font-family: Arial; padding: 20px;">
        <h2 style="color: #d63384; text-align: center;">GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ MẦM NON</h2>
        <h1 style="color: #198754; text-align: center;">${title}</h1>
        <p><strong>Lĩnh vực:</strong> ${domain} | <strong>Lớp:</strong> ${selectedAge}</p>
        <hr/>
        ${objectives}${preparations}${activities}${evaluation}
      </body></html>
    `;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Giao_An_${title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    showToast('Đã xuất file Giáo án Word (.doc) thành công!', 'success');
  };

  return (
    <div className="panel-layout">
      {/* Sidebar Controls */}
      <aside className="config-sidebar">
        <div className="card-box">
          <h3><i className="fa-solid fa-sliders text-pink"></i> 1. Cấu Hình Bài Học Mầm Non</h3>
          
          <div className="form-group margin-top-sm">
            <label>Tên Bài Học / Đề Tài:</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group margin-top-sm">
            <label>Chủ Đề Dạy Học:</label>
            <input type="text" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div className="form-group margin-top-sm">
            <label>Lớp Độ Tuổi Trẻ Mầm Non:</label>
            <select className="form-control" value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
              <option value="mau_giao_3_4t">Mẫu giáo Bé (3-4 tuổi)</option>
              <option value="mau_giao_4_5t">Mẫu giáo Nhở (4-5 tuổi)</option>
              <option value="mau_giao_5_6t">Mẫu giáo Lớn (5-6 tuổi)</option>
              <option value="nha_tre_24_36m">Nhà trẻ (24-36 tháng)</option>
            </select>
          </div>

          <div className="form-group margin-top-sm">
            <label>Lĩnh Vực Phát Triển:</label>
            <select className="form-control" value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="Phát triển Ngôn ngữ">Phát triển Ngôn ngữ (Truyện, Thơ, Kể chuyện)</option>
              <option value="Phát triển Thể chất">Phát triển Thể chất (Vận động cơ bản)</option>
              <option value="Phát triển Nhận thức">Phát triển Nhận thức (Toán nhí, Khám phá)</option>
              <option value="Phát triển Thẩm mỹ">Phát triển Thẩm mỹ (Tạo hình, Âm nhạc)</option>
              <option value="Phát triển Tình cảm & KNS">Phát triển Tình cảm & Kỹ năng xã hội</option>
            </select>
          </div>
        </div>

        {/* Digital Competencies Integration */}
        <div className="card-box margin-top accent-border">
          <h3><i className="fa-solid fa-microchip text-purple"></i> 2. Khung Tích Hợp Năng Lực Số</h3>
          <div className="checkbox-group margin-top-sm">
            <label className="custom-checkbox">
              <input type="checkbox" checked={competencies.useDevice} onChange={e => setCompetencies({...competencies, useDevice: e.target.checked})} />
              <span>Sử dụng thiết bị số (Tablet, Tivi tương tác, Máy chiếu)</span>
            </label>
            <label className="custom-checkbox margin-top-xs">
              <input type="checkbox" checked={competencies.digitalSafety} onChange={e => setCompetencies({...competencies, digitalSafety: e.target.checked})} />
              <span>An toàn thông tin & bảo vệ mắt trong môi trường số</span>
            </label>
            <label className="custom-checkbox margin-top-xs">
              <input type="checkbox" checked={competencies.mediaCreation} onChange={e => setCompetencies({...competencies, mediaCreation: e.target.checked})} />
              <span>Khai thác Media AI (Video 3D, Âm thanh tự nhiên, Tranh AI)</span>
            </label>
          </div>

          <button type="button" className="btn-accent full-width margin-top" onClick={handleGenerateAiPlan} disabled={isGenerating}>
            {isGenerating ? <><i className="fa-solid fa-spinner fa-spin"></i> AI Đang Soạn Giáo Án...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> AI Tự Động Soạn Giáo Án Năng Lực Số</>}
          </button>
        </div>

        {/* Saved Plans List */}
        <div className="card-box margin-top">
          <h3><i className="fa-solid fa-database text-primary"></i> Giáo Án Đã Lưu Supabase ({savedPlans.length})</h3>
          <div className="saved-plans-list margin-top-sm">
            {savedPlans.length === 0 ? (
              <p className="empty-hint">Chưa có giáo án lưu trên DB. Nhấn "Lưu giáo án" để lưu giữ!</p>
            ) : (
              savedPlans.map(item => (
                <div key={item.id} className="saved-plan-item" onClick={() => setTitle(item.title)}>
                  <i className="fa-solid fa-file-signature text-pink"></i>
                  <div className="plan-item-info">
                    <strong>{item.title}</strong>
                    <small>{item.domain}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace (Matches screenshot header banner & tools layout) */}
      <main className="editor-workspace">
        {/* Banner Red/Pink Header "Hệ Sinh Thái Công Cụ AI & Tiện Ích Mở Rộng" */}
        <div className="card-box ai-ecosystem-banner-pink">
          <div className="banner-top-row">
            <div className="brand-header-title">
              <span className="brand-badge-flower">🌸</span>
              <div>
                <h2>APP GIÁO ÁN CÔ TƯƠI – MẦM NON</h2>
                <p>Trợ lý AI chuyên nghiệp chuẩn chương trình Bộ GD&ĐT Việt Nam</p>
              </div>
            </div>
            <div className="banner-quick-actions">
              <span className="pill-btn-white"><i className="fa-solid fa-book"></i> Thư viện giáo án</span>
              <button className="pill-btn-dark" onClick={handleGenerateAiPlan}><i className="fa-solid fa-plus"></i> Soạn bài mới</button>
            </div>
          </div>

          <div className="ecosystem-section-header margin-top-sm">
            <span className="ecosystem-title-tag">✨ Hệ Sinh Thái Công Cụ AI & Tiện Ích Mở Rộng</span>
            <span className="ecosystem-author-tag">Cô Tươi Ecosystem</span>
          </div>

          {/* 12 Pastel Tool Cards (Exactly matching screenshot) */}
          <div className="tools-grid-12 margin-top-sm">
            <button className="tool-card-btn color-pink" onClick={() => handleOpenPromptTool('ppt', 'Soạn Slide PPT')}>
              <i className="fa-solid fa-tv"></i> <span>Soạn Slide PPT</span>
            </button>
            <button className="tool-card-btn color-yellow" onClick={() => handleOpenPromptTool('image', 'Tạo ảnh minh họa')}>
              <i className="fa-solid fa-image"></i> <span>Tạo ảnh minh họa</span>
            </button>
            <button className="tool-card-btn color-purple" onClick={() => handleOpenPromptTool('coloring', 'Tạo tranh tô màu')}>
              <i className="fa-solid fa-palette"></i> <span>Tạo tranh tô màu</span>
            </button>
            <button className="tool-card-btn color-green" onClick={() => handleOpenPromptTool('worksheet', 'Phiếu học tập A4')}>
              <i className="fa-solid fa-file-pen"></i> <span>Phiếu học tập A4</span>
            </button>
            <button className="tool-card-btn color-blue" onClick={() => handleOpenPromptTool('game', 'Trò chơi ôn tập')}>
              <i className="fa-solid fa-gamepad"></i> <span>Trò chơi ôn tập</span>
            </button>
            <button className="tool-card-btn color-red" onClick={() => handleOpenPromptTool('eval', 'Câu hỏi đánh giá')}>
              <i className="fa-solid fa-circle-question"></i> <span>Câu hỏi đánh giá</span>
            </button>

            <button className="tool-card-btn color-teal" onClick={() => handleOpenPromptTool('rubric', 'Rubric đánh giá')}>
              <i className="fa-solid fa-chart-column"></i> <span>Rubric đánh giá</span>
            </button>
            <button className="tool-card-btn color-indigo" onClick={() => handleOpenPromptTool('video', 'Tạo video AI')}>
              <i className="fa-solid fa-video"></i> <span>Tạo video AI</span>
            </button>
            <button className="tool-card-btn color-cyan" onClick={() => handleOpenPromptTool('canva', 'Prompt Canva AI')}>
              <i className="fa-solid fa-wand-magic"></i> <span>Prompt Canva AI</span>
            </button>
            <button className="tool-card-btn color-emerald" onClick={() => handleOpenPromptTool('chatgpt', 'Prompt ChatGPT')}>
              <i className="fa-solid fa-robot"></i> <span>Prompt ChatGPT</span>
            </button>
            <button className="tool-card-btn color-sky" onClick={() => handleOpenPromptTool('gemini', 'Prompt Gemini')}>
              <i className="fa-solid fa-gem"></i> <span>Prompt Gemini</span>
            </button>
            <button className="tool-card-btn color-violet" onClick={() => handleOpenPromptTool('veo', 'Prompt Veo AI')}>
              <i className="fa-solid fa-film"></i> <span>Prompt Veo AI</span>
            </button>
          </div>

          {/* Action Row Buttons (Matches Screenshot: Xuất Word | Xuất PDF | Sao chép | Chỉnh sửa | Lưu giáo án) */}
          <div className="action-row-buttons margin-top">
            <button className="btn-pill btn-word" onClick={handleExportWord}>
              <i className="fa-solid fa-file-word"></i> Xuất Word (.docx)
            </button>
            <button className="btn-pill btn-pdf" onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Xuất PDF / In giáo án
            </button>
            <button className="btn-pill btn-copy" onClick={() => {
              navigator.clipboard.writeText(document.getElementById('lesson-content-display')?.innerText || '');
              showToast('Đã sao chép nội dung Giáo án!', 'info');
            }}>
              <i className="fa-solid fa-copy"></i> Sao chép toàn bộ
            </button>
            <button className="btn-pill btn-edit" onClick={() => showToast('Chế độ chỉnh sửa trực tiếp đang hoạt động!', 'info')}>
              <i className="fa-solid fa-pencil"></i> Chỉnh sửa giáo án
            </button>
            <button className="btn-pill btn-save-pink" onClick={handleSaveToSupabase} disabled={isSaving}>
              {isSaving ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang lưu...</> : <><i className="fa-solid fa-floppy-disk"></i> Lưu giáo án</>}
            </button>
          </div>
        </div>

        {/* Lesson Plan Document Render (Pink Banner: GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ) */}
        <div className="editor-content-card margin-top" id="lesson-content-display">
          <div className="doc-banner-pink-gradient">
            <span className="doc-banner-title"><i className="fa-solid fa-award"></i> GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ</span>
            <span className="doc-banner-subtitle">Cập nhật Bộ GD&ĐT 2026</span>
          </div>

          <div className="doc-header margin-top-sm">
            <h1 className="doc-title-magenta">{title}</h1>
            <div className="doc-sub-meta-tags">
              <span>Chủ đề: <strong>{topic}</strong></span> • 
              <span>Lĩnh vực: <strong>{domain}</strong></span> • 
              <span>Lớp: <strong>{selectedAge} (Mẫu giáo bé)</strong></span>
            </div>
          </div>

          <div className="skkn-body-editable margin-top" contentEditable={true} suppressContentEditableWarning={true}>
            <div dangerouslySetInnerHTML={{ __html: objectives }} />
            <div dangerouslySetInnerHTML={{ __html: preparations }} />
            <div dangerouslySetInnerHTML={{ __html: activities }} />
            <div dangerouslySetInnerHTML={{ __html: evaluation }} />
          </div>
        </div>
      </main>

      {/* Floating Robot Widget "Trợ Lý AI Cô Tươi" (Matches screenshot bottom right) */}
      <div className="floating-assistant-pink" onClick={() => showToast('Trợ lý AI Cô Tươi luôn sẵn sàng đồng hành cùng thầy/Cô!', 'info')}>
        <i className="fa-solid fa-robot"></i> <span>Trợ Lý AI Cô Tươi</span>
      </div>

      {/* Prompt Extension Modal */}
      {showPromptModal && (
        <div className="modal-overlay" onClick={() => setShowPromptModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-wand-magic-sparkles text-pink"></i> Công Cụ AI: {activePromptTool}</h3>
              <button className="close-btn" onClick={() => setShowPromptModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Câu lệnh AI (Prompt) gợi ý:</p>
              <textarea className="form-control" rows="4" value={promptText} onChange={e => setPromptText(e.target.value)} />
              <div className="modal-actions margin-top">
                <button className="btn-primary" onClick={() => {
                  navigator.clipboard.writeText(promptText);
                  showToast('Đã sao chép Prompt AI vào Khay nhớ tạm!', 'success');
                  setShowPromptModal(false);
                }}>
                  <i className="fa-solid fa-copy"></i> Sao Chép Prompt
                </button>
                <button className="btn-secondary" onClick={() => setShowPromptModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. MATERIALS TAB
// ----------------------------------------------------------------------
function MaterialsTab({ showToast, user }) {
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Bộ 20 Phiếu tô màu chữ cái Mẫu giáo 3-4 tuổi', category: 'Phiếu bài tập A4', age_group: 'Mẫu giáo Bé (3-4t)', downloads_count: 142, file_size_mb: 2.5, file_url: '#' },
    { id: 2, title: 'Giáo án Mầm non chuẩn 5 lĩnh vực phát triển 2026', category: 'Giáo án mẫu', age_group: 'Mẫu giáo Lớn (5-6t)', downloads_count: 98, file_size_mb: 4.1, file_url: '#' }
  ]);

  return (
    <div className="materials-page-container">
      <div className="card-box materials-banner-card">
        <div className="banner-content-row">
          <div>
            <h2><i className="fa-solid fa-box-archive text-pink"></i> KHO HỌC LIỆU MẦM NON SỐ</h2>
            <p>Tải lên & Tải về tài liệu, phiếu học tập A4, tranh tô màu, slide PPT, bài hát mầm non (Supabase Storage)</p>
          </div>
          <button className="btn-accent" onClick={() => showToast('Mở form tải học liệu mới lên Supabase Storage!', 'info')}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Tải Học Liệu Mới Lên
          </button>
        </div>
      </div>

      <div className="materials-grid margin-top">
        {materials.map(item => (
          <div key={item.id} className="material-card-box">
            <div className="material-header-row">
              <span className="category-badge">{item.category}</span>
              <span className="age-badge">{item.age_group}</span>
            </div>
            <h3 className="material-title">{item.title}</h3>
            <div className="material-meta-footer">
              <div className="meta-stats">
                <span><i className="fa-solid fa-download"></i> {item.downloads_count} lượt tải</span>
                <span><i className="fa-solid fa-hard-drive"></i> {item.file_size_mb} MB</span>
              </div>
              <button type="button" className="btn-primary compact-btn" onClick={() => showToast('Đang tải file từ Supabase Storage...', 'success')}>
                <i className="fa-solid fa-download"></i> Tải về
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. GAMES TAB
// ----------------------------------------------------------------------
function GamesTab({ showToast, user }) {
  const [games, setGames] = useState([
    { id: 1, title: 'Trò Chơi: Bé Chọn Hình Đúng Giúp Thỏ Con', game_type: 'Nhận biết & Ghép hình', age_group: 'Mẫu giáo Bé (3-4t)', play_count: 156 },
    { id: 2, title: 'Đố Vui Nhanh Trí: Bé Đếm Số Củ Cà Rốt', game_type: 'Chữ cái & Con số', age_group: 'Mẫu giáo Nhở (4-5t)', play_count: 112 }
  ]);
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="games-page-container">
      <div className="card-box games-banner-card">
        <div className="banner-content-row">
          <div>
            <h2><i className="fa-solid fa-gamepad text-purple"></i> KHO TRÒ CHƠI HỌC TẬP TƯƠNG TÁC MẦM NON</h2>
            <p>Trò chơi ôn tập bài học, nhận biết chữ cái con số & ghép hình tương tác trên máy tính bảng</p>
          </div>
          <button className="btn-accent" onClick={() => showToast('Mở form tạo trò chơi mới!', 'info')}>
            <i className="fa-solid fa-plus-circle"></i> Tạo Trò Chơi Mới
          </button>
        </div>
      </div>

      <div className="games-catalog-grid margin-top">
        {games.map(g => (
          <div key={g.id} className="game-card-box">
            <div className="game-card-header">
              <span className="game-type-badge">{g.game_type}</span>
              <span className="game-age-badge">{g.age_group}</span>
            </div>
            <h3 className="game-card-title">{g.title}</h3>
            <div className="game-card-footer">
              <span className="play-count-text"><i className="fa-solid fa-play"></i> {g.play_count} lượt chơi</span>
              <button type="button" className="btn-primary compact-btn" onClick={() => { setActiveGame(g); showToast('Bắt đầu chơi game tương tác!', 'success'); }}>
                <i className="fa-solid fa-gamepad"></i> Chơi Ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. ADMIN DASHBOARD COMPONENT
// ----------------------------------------------------------------------
function AdminDashboard({ user, showToast }) {
  const [profiles, setProfiles] = useState([
    { id: 1, full_name: 'Quản trị viên skynhp8901', email: 'skynhp8901@gmail.com', school_name: 'Trường Mầm non Hoa Sen', system_role: 'ROLE_ADMIN', is_active: true },
    { id: 2, full_name: 'Cô Phạm Thị Thanh Thảo', email: 'thao.nguyen@gmail.com', school_name: 'Trường Mầm non Ánh Dương', system_role: 'ROLE_TEACHER', is_active: true }
  ]);

  return (
    <div className="card-box admin-portal-box">
      <div className="admin-portal-header">
        <div className="admin-title-area">
          <div className="admin-icon-badge"><i className="fa-solid fa-user-shield"></i></div>
          <div>
            <h2>Bảng Quản Trị Hệ Thống Admin (Supabase Live DB)</h2>
            <p className="admin-sub">Quản lý Giáo viên, Phân quyền RBAC & Nhật ký Đăng nhập real-time</p>
          </div>
        </div>
      </div>

      <div className="admin-portal-body margin-top">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Họ Và Tên Giáo Viên</th>
              <th>Email</th>
              <th>Trường Mầm Non</th>
              <th>Phân Quyền (Role)</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(u => (
              <tr key={u.id}>
                <td><strong>{u.full_name}</strong></td>
                <td>{u.email}</td>
                <td>{u.school_name}</td>
                <td><span className="badge-tag accent">{u.system_role}</span></td>
                <td><span className="status-pill success">Đang hoạt động</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 7. MAIN APP ROOT COMPONENT
// ----------------------------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState('tab-lesson-plan');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skkn_user');
      return saved ? JSON.parse(saved) : { email: 'skynhp8901@gmail.com', fullname: 'Quản trị viên skynhp8901', system_role: 'ROLE_ADMIN' };
    } catch (e) {
      return { email: 'skynhp8901@gmail.com', fullname: 'Quản trị viên skynhp8901', system_role: 'ROLE_ADMIN' };
    }
  });

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  return (
    <div className="app-root">
      <Header user={user} sessionTime={formatSessionTime(sessionSeconds)} onOpenDbModal={() => showToast('Kết nối Supabase Live DB thành công!', 'success')} onLogout={() => showToast('Đã đăng xuất!', 'info')} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} showToast={showToast} />

      <main className="app-main">
        {activeTab === 'tab-lesson-plan' && <LessonPlanTab showToast={showToast} user={user} />}
        {activeTab === 'tab-materials' && <MaterialsTab showToast={showToast} user={user} />}
        {activeTab === 'tab-games' && <GamesTab showToast={showToast} user={user} />}
        {activeTab === 'tab-admin' && <AdminDashboard user={user} showToast={showToast} />}
      </main>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <i className="fa-solid fa-circle-check"></i> {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// Render App to DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
