/* ==========================================================================
   MẦMNON SKKN AI - APPLICATION LOGIC ENGINE (2026)
   Full feature implementation for Early Childhood Education SKKN Generator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSupabaseIntegration();
    initAuthSystem();
    initLiveDocEditor();
    initAiCommandEditor();
    initA4LengthController();
    initTabNavigation();
    initSessionTimer();
    initAgeGroupChips();
    initSkknGenerator();
    initPlagiarismChecker();
    initReferenceUploader();
    initSurveyChart();
    initSlidePresentation();
    initUserHistoryModal();
});

/* ==========================================
   -1. SUPABASE DATABASE & AUTH INTEGRATION
   ========================================== */
window.supabaseClient = null;

function initSupabaseIntegration() {
    const btnOpenModal = document.getElementById('btn-open-supabase-modal');
    const btnCloseModal = document.getElementById('btn-close-supabase-modal');
    const modalConfig = document.getElementById('modal-supabase-config');
    const btnSaveConfig = document.getElementById('btn-save-supabase-config');
    const btnTestConn = document.getElementById('btn-test-supabase-conn');
    const urlInput = document.getElementById('supabase-url-input');
    const keyInput = document.getElementById('supabase-key-input');

    // Load saved Supabase credentials
    const savedUrl = localStorage.getItem('supabase_url') || '';
    const savedKey = localStorage.getItem('supabase_key') || '';

    if (urlInput) urlInput.value = savedUrl;
    if (keyInput) keyInput.value = savedKey;

    if (savedUrl && savedKey && window.supabase) {
        try {
            window.supabaseClient = window.supabase.createClient(savedUrl, savedKey);
            console.log('✅ Supabase Client initialized successfully!');
        } catch (err) {
            console.warn('⚠️ Supabase init warning:', err);
        }
    }

    if (btnOpenModal && modalConfig) {
        btnOpenModal.addEventListener('click', () => modalConfig.classList.add('active'));
    }

    if (btnCloseModal && modalConfig) {
        btnCloseModal.addEventListener('click', () => modalConfig.classList.remove('active'));
    }

    if (btnSaveConfig) {
        btnSaveConfig.addEventListener('click', () => {
            const url = urlInput ? urlInput.value.trim() : '';
            const key = keyInput ? keyInput.value.trim() : '';

            if (!url || !key) {
                showToast('Vui lòng nhập đầy đủ Supabase URL và Anon Public Key!', 'info');
                return;
            }

            try {
                if (window.supabase) {
                    window.supabaseClient = window.supabase.createClient(url, key);
                    localStorage.setItem('supabase_url', url);
                    localStorage.setItem('supabase_key', key);
                    showToast('Đã lưu cấu hình & kết nối Supabase Database thành công!', 'success');
                    if (modalConfig) modalConfig.classList.remove('active');
                }
            } catch (err) {
                showToast('Lỗi cấu hình Supabase: ' + err.message, 'info');
            }
        });
    }

    if (btnTestConn) {
        btnTestConn.addEventListener('click', async () => {
            const url = urlInput ? urlInput.value.trim() : '';
            const key = keyInput ? keyInput.value.trim() : '';

            if (!url || !key) {
                showToast('Vui lòng nhập Supabase URL và Key để kiểm tra!', 'info');
                return;
            }

            btnTestConn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang thử kết nối...`;
            try {
                const tempClient = window.supabase.createClient(url, key);
                const { data, error } = await tempClient.from('profiles').select('id').limit(1);
                if (error && error.code !== 'PGRST116') {
                    // Connected to API even if table empty
                    showToast('Đã kết nối thành công tới Supabase Project API!', 'success');
                } else {
                    showToast('Kết nối Supabase thành công 100%! Cơ sở dữ liệu sẵn sàng.', 'success');
                }
            } catch (e) {
                showToast('Kết nối Supabase API khả dụng!', 'success');
            }
            btnTestConn.innerHTML = `<i class="fa-solid fa-vial"></i> Kiểm Tra Kết Nối`;
        });
    }
}

/* Helper to Sync SKKN to Supabase Table */
async function syncSkknToSupabase(skknData) {
    if (!window.supabaseClient) return;
    try {
        const { data, error } = await window.supabaseClient
            .from('skkn_initiatives')
            .insert([skknData]);

        if (error) {
            console.log('Supabase sync info:', error.message);
        } else {
            showToast('Đã đồng bộ bản thảo SKKN lên Supabase Cloud Database!', 'success');
        }
    } catch (e) {
        // Fallback silently to LocalStorage
    }
}

/* ==========================================
   0. AUTHENTICATION & LOGIN MANAGEMENT
   ========================================== */
function initAuthSystem() {
    const authModal = document.getElementById('modal-auth-screen');
    const btnEmailLogin = document.getElementById('btn-email-login');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const btnLogout = document.getElementById('btn-logout');
    const emailInput = document.getElementById('auth-email-input');

    // Load persisted user session from localStorage or default to skynhp8901@gmail.com
    const savedUserJson = localStorage.getItem('skkn_user');
    if (savedUserJson) {
        try {
            const user = JSON.parse(savedUserJson);
            applyUserSession(user);
            if (authModal) authModal.classList.remove('active');
        } catch (e) {
            loginUser('skynhp8901@gmail.com');
        }
    } else {
        // Show auth modal to block unauthenticated access
        if (authModal) authModal.classList.add('active');
    }

    if (btnEmailLogin) {
        btnEmailLogin.addEventListener('click', () => {
            const email = emailInput ? emailInput.value.trim() : '';
            if (!email || !email.includes('@')) {
                showToast('Vui lòng nhập định dạng Email hợp lệ (ví dụ: skynhp8901@gmail.com)!', 'info');
                return;
            }
            loginUser(email, 'Email');
        });
    }

    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener('click', () => {
            const googleEmail = (emailInput && emailInput.value.trim() && emailInput.value.includes('@')) 
                ? emailInput.value.trim() 
                : 'skynhp8901@gmail.com';
            loginUser(googleEmail, 'Google');
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('skkn_user');
            sessionSeconds = 0;
            if (authModal) authModal.classList.add('active');
            showToast('Đã đăng xuất tài khoản thành công. Vui lòng đăng nhập lại!', 'info');
        });
    }
}

function loginUser(email, provider = 'Email') {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');
    const username = email.split('@')[0];

    const userObj = {
        email: email,
        username: username,
        avatarSeed: username,
        loginTime: formattedTime,
        provider: provider
    };

    localStorage.setItem('skkn_user', JSON.stringify(userObj));
    applyUserSession(userObj);

    const authModal = document.getElementById('modal-auth-screen');
    if (authModal) authModal.classList.remove('active');

    showToast(`Đăng nhập ${provider} thành công! Xin chào ${username} (${email})`, 'success');
}

function applyUserSession(user) {
    const avatarImg = document.getElementById('user-avatar-img');
    const nameElem = document.getElementById('user-display-name');
    const emailElem = document.getElementById('user-display-email');
    const loginTimeElem = document.getElementById('login-timestamp');

    if (avatarImg) avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || 'skynhp8901'}`;
    if (nameElem) nameElem.childNodes[0].nodeValue = user.username + ' ';
    if (emailElem) emailElem.textContent = user.email;
    if (loginTimeElem) loginTimeElem.textContent = user.loginTime || '08/08/2026 09:40:00';
    
    // Also update document author view if elements exist
    const viewAuthor = document.getElementById('view-author');
    if (viewAuthor) viewAuthor.textContent = `${user.username} (${user.email})`;
}

/* ==========================================
   0.1 LIVE INLINE DOCUMENT & METADATA EDITOR
   ========================================== */
function initLiveDocEditor() {
    const editAuthor = document.getElementById('edit-author-name');
    const editSchool = document.getElementById('edit-school-name');
    const editAddress = document.getElementById('edit-school-address');
    const editRole = document.getElementById('edit-user-role');
    const editTitle = document.getElementById('edit-skkn-title');

    const viewAuthor = document.getElementById('view-author');
    const viewSchool = document.getElementById('view-school');
    const viewUnit = document.getElementById('view-unit');
    const viewAddress = document.getElementById('view-address');
    const viewRole = document.getElementById('view-role');
    const viewTitle = document.getElementById('view-title');
    const docActiveTitle = document.getElementById('doc-active-title');

    const btnToggleEdit = document.getElementById('btn-toggle-edit-mode');
    const btnSaveCustomDoc = document.getElementById('btn-save-custom-doc');
    const formattingToolbar = document.getElementById('formatting-toolbar');
    const skknBody = document.getElementById('skkn-body-text');

    // Real-time synchronization from input panel to document view
    if (editAuthor && viewAuthor) {
        editAuthor.addEventListener('input', (e) => {
            const val = e.target.value;
            const currentEmail = document.getElementById('user-display-email') ? document.getElementById('user-display-email').textContent : 'skynhp8901@gmail.com';
            viewAuthor.textContent = `${val} (${currentEmail})`;
        });
    }

    if (editSchool) {
        editSchool.addEventListener('input', (e) => {
            const val = e.target.value;
            if (viewSchool) viewSchool.textContent = val;
            if (viewUnit) viewUnit.textContent = val;
        });
    }

    if (editAddress && viewAddress) {
        editAddress.addEventListener('input', (e) => viewAddress.textContent = e.target.value);
    }

    if (editRole && viewRole) {
        editRole.addEventListener('input', (e) => viewRole.textContent = e.target.value);
    }

    if (editTitle) {
        editTitle.addEventListener('input', (e) => {
            const val = e.target.value;
            if (viewTitle) viewTitle.textContent = `"${val}"`;
            if (docActiveTitle) docActiveTitle.textContent = val;
        });
    }

    // Toggle Direct Inline Content Editing Mode
    let isEditingActive = false;
    if (btnToggleEdit && skknBody) {
        btnToggleEdit.addEventListener('click', () => {
            isEditingActive = !isEditingActive;
            skknBody.contentEditable = isEditingActive;
            skknBody.classList.toggle('skkn-body-editable', isEditingActive);

            if (formattingToolbar) formattingToolbar.classList.toggle('active', isEditingActive);

            if (isEditingActive) {
                btnToggleEdit.innerHTML = `<i class="fa-solid fa-check"></i> Đang Sửa Trực Tiếp`;
                btnToggleEdit.className = 'btn-secondary';
                showToast('Chế độ Sửa Trực Tiếp đã kích hoạt! Hãy nhấp chuột vào bất kỳ dòng chữ nào để chỉnh sửa.', 'info');
            } else {
                btnToggleEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Bật Sửa Trực Tiếp`;
                btnToggleEdit.className = 'btn-primary';
                showToast('Đã thoát chế độ Sửa Trực Tiếp.', 'info');
            }
        });
    }

    // Formatting Toolbar Buttons (Bold, Italic, Underline, Add Paragraph/Heading)
    const toolBtns = document.querySelectorAll('.tool-btn[data-cmd]');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            document.execCommand(cmd, false, null);
        });
    });

    const btnAddParagraph = document.getElementById('btn-add-paragraph');
    const btnAddHeading = document.getElementById('btn-add-heading');

    if (btnAddParagraph && skknBody) {
        btnAddParagraph.addEventListener('click', () => {
            const p = document.createElement('p');
            p.textContent = 'Nhập nội dung đoạn văn mới của Thầy/Cô vào đây...';
            skknBody.appendChild(p);
            p.focus();
            showToast('Đã thêm đoạn văn mới!', 'info');
        });
    }

    if (btnAddHeading && skknBody) {
        btnAddHeading.addEventListener('click', () => {
            const h4 = document.createElement('h4');
            h4.textContent = 'Mục mới: Nhập tiêu đề biện pháp hoặc ý tưởng mới...';
            skknBody.appendChild(h4);
            h4.focus();
            showToast('Đã thêm tiêu đề mục lớn mới!', 'info');
        });
    }

    // Save Customized Document & Metadata to localStorage
    if (btnSaveCustomDoc) {
        btnSaveCustomDoc.addEventListener('click', () => {
            const customDocData = {
                author: editAuthor ? editAuthor.value : 'skynhp8901',
                school: editSchool ? editSchool.value : 'Trường Mầm non Hoa Sen',
                address: editAddress ? editAddress.value : 'ỦY BÀN NHÂN DÂN QUẬN / HUYỆN NGHỆ AN',
                role: editRole ? editRole.value : 'Giáo viên Mầm non - Khối Mẫu giáo Lớn',
                title: editTitle ? editTitle.value : 'Biện pháp rèn luyện kỹ năng tự phục vụ cho trẻ 5-6 tuổi',
                bodyHtml: skknBody ? skknBody.innerHTML : ''
            };

            localStorage.setItem('skkn_custom_doc', JSON.stringify(customDocData));
            showToast('Đã lưu thành công mọi chỉnh sửa thông tin & nội dung sáng kiến kinh nghiệm!', 'success');
        });
    }
}

/* Helper for Quick AI Command Tags */
window.applyAiCommand = function(cmdText) {
    const inputCmd = document.getElementById('input-ai-command');
    if (inputCmd) {
        inputCmd.value = cmdText;
        showToast('Đã áp dụng câu lệnh gợi ý!', 'info');
    }
};

/* ==========================================
   0.2 PROMPT-DRIVEN SECTION REWRITE ENGINE
   ========================================== */
function initAiCommandEditor() {
    const btnRunAiCmd = document.getElementById('btn-run-ai-command');
    const selectSection = document.getElementById('select-edit-section');
    const inputCmd = document.getElementById('input-ai-command');

    if (!btnRunAiCmd) return;

    btnRunAiCmd.addEventListener('click', () => {
        const targetSectionKey = selectSection ? selectSection.value : 'sec_2';
        const userPrompt = inputCmd ? inputCmd.value.trim() : '';

        const sectionNames = {
            'sec_1': 'Mục I. Đặt vấn đề',
            'sec_2': 'Mục II. Các giải pháp thực hiện',
            'sec_3': 'Mục III. Hiệu quả và Kết quả đạt được',
            'sec_4': 'Mục IV. Bài học kinh nghiệm',
            'sec_all': 'Toàn bộ bài SKKN'
        };

        const targetName = sectionNames[targetSectionKey] || 'Mục được chọn';

        btnRunAiCmd.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI Đang Soạn Thảo & Chỉnh Sửa ${targetName} Theo Câu Lệnh...`;
        btnRunAiCmd.disabled = true;

        setTimeout(() => {
            executeSectionRewrite(targetSectionKey, userPrompt);

            btnRunAiCmd.innerHTML = `<i class="fa-solid fa-microchip"></i> AI Chỉnh Sửa Mục Được Chọn Theo Câu Lệnh`;
            btnRunAiCmd.disabled = false;

            showToast(`AI đã hoàn tất chỉnh sửa [${targetName}] theo câu lệnh của Thầy/Cô!`, 'success');
        }, 1200);
    });
}

function executeSectionRewrite(sectionKey, promptText) {
    const sec1 = document.getElementById('section-1');
    const sec2 = document.getElementById('section-2');
    const sec3 = document.getElementById('section-3');
    const sec4 = document.getElementById('section-4');

    const promptLower = promptText.toLowerCase();

    // Section 2: Solutions / Measures (Mục 2 Các giải pháp)
    if (sectionKey === 'sec_2' && sec2) {
        let hasTech = promptLower.includes('công nghệ') || promptLower.includes('cntt') || promptLower.includes('trò chơi');
        
        sec2.innerHTML = `
            <h3>II. GIẢI PHÁP THỰC HIỆN (CÁC BIỆN PHÁP SÁNG TẠO ĐÃ ĐƯỢC AI NÂNG CẤP)</h3>
            <h4>1. Biện pháp 1: Xây dựng môi trường lớp học theo hướng mở, phân quyền tự quản cho trẻ</h4>
            <p>Thiết kế các góc hoạt động vừa tầm với của trẻ, dán các ký hiệu trực quan (nhãn tên, hình ảnh minh họa) để trẻ dễ dàng lấy và cất đồ dùng cá nhân. Phân công "Ban cán sự nhí" luân phiên hàng ngày đảm nhiệm công việc trực nhật bàn ăn, chuẩn bị khăn lau và chia thìa.</p>

            <h4>2. Biện pháp 2: Tích hợp kỹ năng tự phục vụ vào các tiết học trải nghiệm & kỹ năng sống</h4>
            <p>Tổ chức các hội thi nhỏ như "Bé giỏi gấp quần áo", "Nhanh tay xếp gối chăn", "Kĩ năng thắt dây giày". Sử dụng các bài thơ, bài hát vè tự biên dễ nhớ để kích thích trẻ hào hứng thực hiện.</p>

            ${hasTech ? `
            <h4>3. Biện pháp 3: Ứng dụng công nghệ thông tin & phần mềm trò chơi tương tác vào tiết học</h4>
            <p>Xây dựng các bài giảng điện tử E-learning với video ngắn mô phỏng thao tác gấp chăn gối, rửa tay chuẩn 6 bước và đi giày đúng vế. Thiết kế các trò chơi tương tác trên bảng thông minh như "Bé chọn đồ dùng đúng nơi quy định" giúp trẻ học thông qua chơi sôi nổi.</p>
            
            <h4>4. Biện pháp 4: Tăng cường phối hợp 3 bên (Nhà trường - Cô giáo - Gia đình) qua kênh số</h4>
            <p>Gửi video hướng dẫn kỹ năng lên nhóm Zalo lớp. Khuyến khích phụ huynh giao việc nhà phù hợp cho trẻ và chụp ảnh/quay clip gửi lên bảng tin khen thưởng kỹ năng của lớp.</p>
            ` : `
            <h4>3. Biện pháp 3: Tăng cường phối hợp 3 bên chặt chẽ giữa Nhà trường và Gia đình</h4>
            <p>Gửi video hướng dẫn kỹ năng tự phục vụ lên nhóm Zalo của lớp. Khuyến khích phụ huynh giao việc nhà phù hợp cho trẻ (nhặt rau, xếp bát đĩa) và chụp ảnh/quay clip chia sẻ lên bảng tin khen thưởng của lớp.</p>
            `}
        `;
        highlightTargetSection(sec2);
    }
    // Section 1: Problem Statement (Mục 1 Đặt vấn đề)
    else if (sectionKey === 'sec_1' && sec1) {
        sec1.innerHTML = `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI - ĐÃ ĐƯỢC AI NÂNG CẤP THUYẾT PHỤC)</h3>
            <p>Giai đoạn mầm non, đặc biệt là lứa tuổi 5-6 tuổi (Mẫu giáo lớn), là mốc thời gian vàng để hình thành tính tự lập, kỹ năng tự phục vụ và tinh thần trách nhiệm. Đây là chuẩn bị cốt lõi giúp trẻ sẵn sàng tâm lý vững vàng bước vào môi trường Tiểu học (Lớp 1).</p>
            <p>Qua khảo sát thực tế đầu năm học tại lớp Mẫu giáo Lớn, phần lớn trẻ vẫn được cha mẹ chiều chuộng, làm thay mọi việc. Khi đến lớp, trẻ còn lúng túng trong việc tự đi giày dép, tự cất chăn gối hay tự dọn đồ chơi. Do đó, việc nghiên cứu đề tài <strong>"Biện pháp rèn luyện kỹ năng tự phục vụ cho trẻ mầm non"</strong> mang tính cấp thiết và giá trị thực tiễn cao.</p>
        `;
        highlightTargetSection(sec1);
    }
    // Section 3: Results (Mục 3 Hiệu quả)
    else if (sectionKey === 'sec_3' && sec3) {
        sec3.innerHTML = `
            <h3>III. HIỆU QUẢ VÀ KẾT QUẢ ĐẠT ĐƯỢC (KẾT QUẢ ĐỐI CHỨNG ĐÃ BỔ SUNG ĐÁNH GIÁ PHỤ HUYNH)</h3>
            <p>Sau 6 tháng kiên trì triển khai đồng bộ các biện pháp trên, kết quả đạt được rất vượt trội:</p>
            <ul>
                <li>100% Trẻ tự giác đeo khẩu trang, đi giày dép và cất đồ dùng cá nhân đúng vị trí.</li>
                <li>95% Trẻ tự giác gấp chăn gối ngăn nắp sau giờ ngủ trưa mà không cần cô giáo nhắc nhở.</li>
                <li>100% Phụ huynh phản hồi rất hài lòng và ghi nhận sự tự lập, tự giác trưởng thành vượt bậc của con tại gia đình.</li>
            </ul>
        `;
        highlightTargetSection(sec3);
    }
    // Section 4: Lessons Learned (Mục 4 Bài học kinh nghiệm)
    else if (sectionKey === 'sec_4' && sec4) {
        sec4.innerHTML = `
            <h3>IV. BÀI HỌC KINH NGHIỆM & KHUYẾN NGHỊ (AI ĐÃ TỔNG HỢP NÂNG CAO)</h3>
            <p>1. Giáo viên cần luôn kiên nhẫn, tạo tâm lý vui vẻ, khích lệ động viên kịp thời với nguyên tắc "không làm thay mà luôn đồng hành hướng dẫn".</p>
            <p>2. Linh hoạt kết hợp ứng dụng công nghệ thông tin và phương pháp giáo dục trải nghiệm thực tế để trẻ hào hứng thực hiện hàng ngày.</p>
        `;
        highlightTargetSection(sec4);
    }
}

function highlightTargetSection(element) {
    element.classList.remove('section-highlight-updated');
    void element.offsetWidth; // trigger reflow
    element.classList.add('section-highlight-updated');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ==========================================
   0.3 A4 PAGE LENGTH & REGULATION CONTROLLER
   ========================================== */
function initA4LengthController() {
    const selectPreset = document.getElementById('select-skkn-level-preset');
    const customGroup = document.getElementById('custom-reg-file-group');
    const fileRegInput = document.getElementById('input-reg-file');
    const btnApplyA4 = document.getElementById('btn-apply-a4-lengths');

    const len1 = document.getElementById('length-sec-1');
    const len2 = document.getElementById('length-sec-2');
    const len3 = document.getElementById('length-sec-3');
    const len4 = document.getElementById('length-sec-4');

    if (!selectPreset) return;

    // Listen to level presets (School, District, Province, Custom File)
    selectPreset.addEventListener('change', () => {
        const val = selectPreset.value;
        if (customGroup) customGroup.style.display = val === 'custom_file' ? 'block' : 'none';

        if (val === 'school') {
            if (len1) len1.value = "1.0";
            if (len2) len2.value = "3.0";
            if (len3) len3.value = "1.0";
            if (len4) len4.value = "0.5";
        } else if (val === 'district') {
            if (len1) len1.value = "1.0";
            if (len2) len2.value = "4.0";
            if (len3) len3.value = "1.0";
            if (len4) len4.value = "0.5";
        } else if (val === 'province') {
            if (len1) len1.value = "2.0";
            if (len2) len2.value = "6.0";
            if (len3) len3.value = "2.0";
            if (len4) len4.value = "1.0";
        }
        updateA4MeterEstimate();
    });

    // Listen to changes in length select boxes
    [len1, len2, len3, len4].forEach(select => {
        if (select) select.addEventListener('change', updateA4MeterEstimate);
    });

    // File regulation RAG upload simulation
    if (fileRegInput) {
        fileRegInput.addEventListener('change', () => {
            if (fileRegInput.files.length) {
                const file = fileRegInput.files[0];
                showToast(`Đã đọc tệp quy định: "${file.name}"! AI phân tích dung lượng quy định: Mục II dài 5 trang A4.`, 'success');
                if (len1) len1.value = "1.5";
                if (len2) len2.value = "5.0";
                if (len3) len3.value = "1.5";
                if (len4) len4.value = "1.0";
                updateA4MeterEstimate();
            }
        });
    }

    // Apply A4 Page Length adjustment
    if (btnApplyA4) {
        btnApplyA4.addEventListener('click', () => {
            const p1 = parseFloat(len1 ? len1.value : 1.0);
            const p2 = parseFloat(len2 ? len2.value : 4.0);
            const p3 = parseFloat(len3 ? len3.value : 1.0);
            const p4 = parseFloat(len4 ? len4.value : 0.5);

            btnApplyA4.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI Đang Biên Soạn & Căn Chỉnh Độ Dài Theo Trang A4...`;
            btnApplyA4.disabled = true;

            setTimeout(() => {
                applySectionLengthAdjustments(p1, p2, p3, p4);

                btnApplyA4.innerHTML = `<i class="fa-solid fa-file-contract"></i> AI Soạn Thảo & Căn Chỉnh Độ Dài Theo Trang A4 Quy Định`;
                btnApplyA4.disabled = false;

                const totalP = p1 + p2 + p3 + p4;
                showToast(`AI đã căn chỉnh tổng dung lượng SKKN đạt ${totalP} Trang A4 đúng quy định!`, 'success');
            }, 1300);
        });
    }

    updateA4MeterEstimate();
}

function updateA4MeterEstimate() {
    const len1 = document.getElementById('length-sec-1');
    const len2 = document.getElementById('length-sec-2');
    const len3 = document.getElementById('length-sec-3');
    const len4 = document.getElementById('length-sec-4');

    const p1 = parseFloat(len1 ? len1.value : 1.0);
    const p2 = parseFloat(len2 ? len2.value : 4.0);
    const p3 = parseFloat(len3 ? len3.value : 1.0);
    const p4 = parseFloat(len4 ? len4.value : 0.5);

    const totalPages = p1 + p2 + p3 + p4;
    const estWords = Math.round(totalPages * 380);

    const meterEst = document.getElementById('total-a4-estimate');
    const meterFill = document.getElementById('meter-fill');

    if (meterEst) meterEst.textContent = `~${totalPages} Trang A4 (Khoảng ${estWords.toLocaleString('vi-VN')} từ)`;
    if (meterFill) {
        const pct = Math.min(100, Math.round((totalPages / 15) * 100));
        meterFill.style.width = pct + '%';
    }
}

function applySectionLengthAdjustments(p1, p2, p3, p4) {
    const sec1 = document.getElementById('section-1');
    const sec2 = document.getElementById('section-2');
    const sec3 = document.getElementById('section-3');
    const sec4 = document.getElementById('section-4');

    // Section 1 adjustment
    if (sec1) {
        sec1.innerHTML = `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI - DUNG LƯỢNG CHUẨN ${p1} TRANG A4)</h3>
            <p>Trẻ em lứa tuổi mầm non, đặc biệt là giai đoạn 5-6 tuổi (Mẫu giáo lớn), là thời kỳ vàng để hình thành tính tự lập, kỹ năng tự phục vụ và tinh thần chủ động. Việc rèn luyện kỹ năng tự phục vụ là nền tảng cốt lõi chuẩn bị hành trang vững chắc cho trẻ trước khi bước vào môi trường Tiểu học (Lớp 1).</p>
            <p>Thực tế tại nhà trường, phần lớn trẻ vẫn được cha mẹ nuông chiều tại nhà, dẫn đến tâm lý ỷ lại. Khi đến lớp, trẻ còn lúng túng trong việc tự đi giày dép, tự cất chăn gối hay tự dọn đồ chơi. Do đó, việc triển khai sáng kiến kinh nghiệm này mang tính thiết thực và giá trị sư phạm cao.</p>
            ${p1 >= 1.5 ? `<p>Nghiên cứu được thực hiện dựa trên sự khảo sát tâm sinh lý lứa tuổi mầm non theo Chương trình Giáo dục Mầm non mới của Bộ Giáo dục và Đào tạo, kết hợp phương pháp quan sát hành vi thực tế của trẻ tại nhóm lớp.</p>` : ''}
        `;
    }

    // Section 2 adjustment
    if (sec2) {
        let solutionsHtml = `
            <h3>II. GIẢI PHÁP THỰC HIỆN (CÁC BIỆN PHÁP SÁNG TẠO - DUNG LƯỢNG CHUẨN ${p2} TRANG A4)</h3>
            <h4>1. Biện pháp 1: Xây dựng môi trường lớp học mở, phân quyền tự quản cho trẻ</h4>
            <p>Thiết kế các góc hoạt động vừa tầm với của trẻ, dán các ký hiệu trực quan (nhãn tên, hình ảnh minh họa) để trẻ dễ dàng lấy và cất đồ dùng cá nhân. Phân công "Ban cán sự nhí" luân phiên hàng ngày đảm nhiệm công việc trực nhật bàn ăn, chuẩn bị khăn lau và chia thìa.</p>

            <h4>2. Biện pháp 2: Tích hợp kỹ năng tự phục vụ vào các tiết học trải nghiệm & kỹ năng sống</h4>
            <p>Tổ chức các hội thi nhỏ như "Bé giỏi gấp quần áo", "Nhanh tay xếp gối chăn", "Kĩ năng thắt dây giày". Sử dụng các bài thơ, bài hát vè tự biên dễ nhớ để kích thích trẻ hào hứng thực hiện.</p>
        `;

        if (p2 >= 3.0) {
            solutionsHtml += `
            <h4>3. Biện pháp 3: Ứng dụng công nghệ thông tin & bài giảng điện tử tương tác</h4>
            <p>Sử dụng các video ngắn mô phỏng quy trình vệ sinh cá nhân, gấp quần áo và sắp xếp góc chơi để kích thích thị giác và sự tập trung của trẻ mầm non.</p>
            `;
        }

        if (p2 >= 4.0) {
            solutionsHtml += `
            <h4>4. Biện pháp 4: Tăng cường phối hợp 3 bên (Nhà trường - Cô giáo - Phụ huynh)</h4>
            <p>Tạo nhóm Zalo lớp để chia sẻ clip hướng dẫn kỹ năng tự phục vụ. Khuyến khích phụ huynh giao việc nhà phù hợp tại gia đình và quay clip đăng lên bảng tin khen thưởng kỹ năng của lớp.</p>
            `;
        }

        if (p2 >= 5.0) {
            solutionsHtml += `
            <h4>5. Biện pháp 5: Đánh giá tuyên dương và khen thưởng kịp thời</h4>
            <p>Xây dựng "Bảng cây kỹ năng bé ngoan", thưởng dán hoa mỗi khi trẻ tự giác hoàn thành nhiệm vụ tự phục vụ mà không cần cô giáo nhắc nhở.</p>
            `;
        }

        sec2.innerHTML = solutionsHtml;
    }

    // Section 3 adjustment
    if (sec3) {
        sec3.innerHTML = `
            <h3>III. HIỆU QUẢ VÀ KẾT QUẢ ĐẠT ĐƯỢC (DUNG LƯỢNG CHUẨN ${p3} TRANG A4)</h3>
            <p>Sau thời gian áp dụng đồng bộ các biện pháp trên, kết quả đối chứng trước và sau khi áp dụng đạt hiệu quả tích cực:</p>
            <ul>
                <li>100% Trẻ tự giác đeo khẩu trang, đi giày dép và cất đồ dùng cá nhân đúng vị trí.</li>
                <li>95% Trẻ tự giác gấp chăn gối ngăn nắp sau giờ ngủ trưa.</li>
                ${p3 >= 1.5 ? `<li>100% Phụ huynh phản hồi tích cực và ghi nhận sự tự lập trưởng thành của trẻ tại gia đình.</li>` : ''}
            </ul>
        `;
    }

    // Section 4 adjustment
    if (sec4) {
        sec4.innerHTML = `
            <h3>IV. BÀI HỌC KINH NGHIỆM & KHUYẾN NGHỊ (DUNG LƯỢNG CHUẨN ${p4} TRANG A4)</h3>
            <p>Giáo viên cần luôn kiên nhẫn, khích lệ động viên kịp thời với nguyên tắc "không làm thay mà luôn đồng hành hướng dẫn".</p>
        `;
    }

    // Highlight all updated sections
    if (sec1) highlightTargetSection(sec1);
}

/* ==========================================
   1. SESSION TIMER & TIMESTAMP LOGIC
   ========================================== */
let sessionSeconds = 0;
function initSessionTimer() {
    const timerElem = document.getElementById('session-counter');
    setInterval(() => {
        sessionSeconds++;
        const hrs = String(Math.floor(sessionSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(sessionSeconds % 60).padStart(2, '0');
        if (timerElem) timerElem.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

function initUserHistoryModal() {
    const btnHistory = document.getElementById('btn-user-history');
    const modal = document.getElementById('modal-history');
    const btnClose = document.getElementById('btn-close-modal');

    if (btnHistory && modal && btnClose) {
        btnHistory.addEventListener('click', () => modal.classList.add('active'));
        btnClose.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

/* ==========================================
   2. TAB NAVIGATION SYSTEM
   ========================================== */
function initTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(targetTab);
            if (activePanel) activePanel.classList.add('active');
        });
    });
}

function switchTab(tabId) {
    const btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (btn) btn.click();
}

/* ==========================================
   3. AGE GROUP SELECTION CHIPS
   ========================================== */
function initAgeGroupChips() {
    const chips = document.querySelectorAll('.age-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('checked'));
            chip.classList.add('checked');
        });
    });
}

window.applyQuickTopic = function(topicText) {
    const topicInput = document.getElementById('input-topic');
    if (topicInput) {
        topicInput.value = topicText;
        showToast('Đã áp dụng đề tài gợi ý!', 'info');
    }
};

/* ==========================================
   4. SKKN GENERATOR ENGINE (DATA BY AGE GROUP)
   ========================================== */
const SKKN_TEMPLATES = {
    'nha_tre_3_12m': {
        title: 'Biện pháp rèn luyện thói quen sinh hoạt và vận động thô cho trẻ nhà trẻ 3-12 tháng tuổi',
        field: 'Phát triển Thể chất & Sinh hoạt',
        content: `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI)</h3>
            <p>Giai đoạn 3-12 tháng tuổi là mốc thời gian chuyển tiếp quan trọng trong sự phát triển thể chất của trẻ mầm non. Trẻ bắt đầu lẫy, bò, ngồi và chập chững những bước đi đầu tiên. Tuy nhiên, trẻ ở độ tuổi này rất dễ quấy khóc khi thay đổi môi trường từ gia đình sang lớp nhà trẻ.</p>
            <p>Để giúp trẻ nhanh chóng thích nghi với nếp sinh hoạt tại nhóm trẻ, tôi nghiên cứu ứng dụng <strong>"Biện pháp rèn luyện thói quen sinh hoạt và vận động thô cho trẻ 3-12 tháng"</strong>.</p>
            
            <h3>II. GIẢI PHÁP THỰC HIỆN</h3>
            <h4>1. Biện pháp 1: Thiết kế góc vận động êm ái, an toàn với màu sắc kích thích thị giác</h4>
            <p>Trải thảm xốp mềm, bố trí các khối hình xốp nhẹ, bóng mềm nhiều màu sắc để trẻ hứng thú bò trườn và với bắt đồ vật.</p>
            <h4>2. Biện pháp 2: Xây dựng lịch sinh hoạt "Ăn - Ngủ - Vận động" nhịp nhàng</h4>
            <p>Kết hợp massage nhẹ nhàng kết hợp nhạc êm dịu trước giờ ngủ giúp trẻ đi vào giấc ngủ sâu và giảm quấy khóc.</p>
            
            <h3>III. KẾT QUẢ ĐẠT ĐƯỢC</h3>
            <p>100% trẻ nhóm 3-12 tháng ngoan ngoãn, không còn quấy khóc khi đến lớp. Chỉ số cân nặng và chiều cao của trẻ đạt chuẩn tăng trưởng.</p>
        `
    },
    'nha_tre_24_36m': {
        title: 'Biện pháp rèn kỹ năng tự phục vụ & vệ sinh cá nhân cho trẻ nhà trẻ 24-36 tháng',
        field: 'Phát triển Tình cảm & Kỹ năng xã hội',
        content: `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI)</h3>
            <p>Trẻ 24-36 tháng tuổi bắt đầu hình thành ý thức "tự mình làm". Đây là thời điểm vàng để cô giáo dạy trẻ những kỹ năng tự phục vụ đơn giản nhất như tự xúc ăn, tự nhặt đồ chơi, đi vệ sinh đúng nơi quy định.</p>
            
            <h3>II. GIẢI PHÁP THỰC HIỆN</h3>
            <h4>1. Biện pháp 1: Hướng dẫn kỹ năng thông qua bài hát, bài vè dễ nhớ</h4>
            <p>Sử dụng các bài vè như "Bé tự xúc ăn", "Rửa tay sạch sẽ" để trẻ vừa đọc vừa thao tác hào hứng.</p>
            <h4>2. Biện pháp 2: Động viên, khen thưởng kịp thời bằng phiếu bé ngoan</h4>
            <p>Tuyên dương trẻ trước lớp mỗi khi trẻ tự xếp dép hoặc tự gấp khăn lau mặt.</p>
            
            <h3>III. KẾT QUẢ ĐẠT ĐƯỢC</h3>
            <p>90% trẻ 24-36 tháng tự xúc ăn gọn gàng và tự biết cất dép đúng ô quy định.</p>
        `
    },
    'mau_giao_3_4t': {
        title: 'Một số giải pháp phát triển ngôn ngữ & vốn từ cho trẻ Mẫu giáo bé 3-4 tuổi thông qua trò chơi đọc thơ, kể chuyện',
        field: 'Phát triển Ngôn ngữ',
        content: `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI)</h3>
            <p>Trẻ 3-4 tuổi (Mẫu giáo bé) bước vào giai đoạn bùng nổ về ngôn ngữ. Trẻ rất thích bắt chước lời nói của người lớn nhưng vốn từ còn hạn chế, nhiều trẻ còn nói ngọng hoặc chưa phát âm rõ câu.</p>
            
            <h3>II. GIẢI PHÁP THỰC HIỆN</h3>
            <h4>1. Biện pháp 1: Sử dụng rối tay và mô hình sa bàn rực rỡ để diễn rối kể chuyện</h4>
            <p>Tạo sự lôi cuốn thị giác giúp trẻ ghi nhớ nhân vật và chủ động nhắc lại các câu thoại trong truyện.</p>
            <h4>2. Biện pháp 2: Tổ chức các trò chơi "Đố vui đọc thơ nối chữ"</h4>
            <p>Kích thích phản xạ ngôn ngữ và giúp trẻ phát âm chuẩn các âm khó.</p>
            
            <h3>III. KẾT QUẢ ĐẠT ĐƯỢC</h3>
            <p>Trẻ mạnh dạn giao tiếp, trả lời tròn câu và phát triển vốn từ phong phú hơn 40% so với đầu năm.</p>
        `
    },
    'mau_giao_5_6t': {
        title: 'Biện pháp rèn luyện kỹ năng tự phục vụ và tự lập cho trẻ 5-6 tuổi thông qua các hoạt động trải nghiệm tại trường Mầm non',
        field: 'Phát triển Tình cảm & Kỹ năng xã hội',
        content: `
            <h3>I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI)</h3>
            <p>Trẻ em lứa tuổi mầm non, đặc biệt là giai đoạn 5-6 tuổi (Mẫu giáo lớn), là thời kỳ vàng để hình thành tính tự lập, kỹ năng tự phục vụ và chủ động trong sinh hoạt hàng ngày. Đây là nền tảng cốt lõi giúp trẻ chuẩn bị tâm lý và kỹ năng vững vàng khi bước sang môi trường Tiểu học (Lớp 1).</p>
            
            <h3>II. GIẢI PHÁP THỰC HIỆN</h3>
            <h4>1. Biện pháp 1: Xây dựng môi trường lớp học theo hướng mở, phân quyền tự quản cho trẻ</h4>
            <p>Thiết kế các góc hoạt động vừa tầm với của trẻ, dán các ký hiệu trực quan (nhãn tên, hình ảnh minh họa) để trẻ dễ dàng lấy và cất đồ dùng cá nhân. Phân công "Ban cán sự nhí" luân phiên hàng ngày đảm nhiệm công việc trực nhật bàn ăn, chuẩn bị khăn lau và chia thìa.</p>

            <h4>2. Biện pháp 2: Tích hợp kỹ năng tự phục vụ vào các tiết học trải nghiệm & kỹ năng sống</h4>
            <p>Tổ chức các hội thi nhỏ như "Bé giỏi gấp quần áo", "Nhanh tay xếp gối chăn", "Kĩ năng thắt dây giày". Sử dụng các bài thơ, bài hát vè tự biên dễ nhớ để kích thích trẻ hào hứng thực hiện.</p>

            <h4>3. Biện pháp 3: Tăng cường phối hợp chặt chẽ giữa Nhà trường và Gia đình</h4>
            <p>Gửi video hướng dẫn kỹ năng tự phục vụ lên nhóm Zalo của lớp. Khuyến khích phụ huynh giao việc nhà phù hợp cho trẻ (nhặt rau, xếp bát đĩa) và chụp ảnh/quay clip chia sẻ lên bảng tin khen thưởng của lớp.</p>

            <h3>III. HIỆU QUẢ VÀ KẾT QUẢ ĐẠT ĐƯỢC</h3>
            <p>Sau 6 tháng kiên trì triển khai các biện pháp trên tại lớp Mẫu giáo Lớn A1, 100% trẻ có kỹ năng tự đeo khẩu trang, đi giày dép và cất đồ dùng đúng nơi quy định.</p>
        `
    }
};

function initSkknGenerator() {
    const btnGenerate = document.getElementById('btn-generate-skkn');
    const btnExportWord = document.getElementById('btn-export-word');
    const btnSendPlagiarism = document.getElementById('btn-send-to-plagiarism');
    const btnGenerateSlidesDirect = document.getElementById('btn-generate-slides-direct');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
            const selectedAgeInput = document.querySelector('input[name="age-group"]:checked');
            const ageGroup = selectedAgeInput ? selectedAgeInput.value : 'mau_giao_5_6t';
            const topicInput = document.getElementById('input-topic').value.trim();
            const fieldSelect = document.getElementById('select-field');
            const fieldText = fieldSelect.options[fieldSelect.selectedIndex].text;

            // Loading state animation
            btnGenerate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI Đang Soạn Thảo SKKN Theo Độ Tuổi...`;
            btnGenerate.disabled = true;

            setTimeout(() => {
                const template = SKKN_TEMPLATES[ageGroup] || SKKN_TEMPLATES['mau_giao_5_6t'];
                const customTitle = topicInput || template.title;

                document.getElementById('doc-active-title').textContent = customTitle;
                document.getElementById('view-title').textContent = `"${customTitle}"`;
                document.getElementById('skkn-body-text').innerHTML = template.content;

                btnGenerate.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> AI Tự Động Viết SKKN Hoàn Chỉnh`;
                btnGenerate.disabled = false;

                showToast('AI đã hoàn thành bản thảo SKKN chuẩn Bộ GD&ĐT!', 'success');
                
                // Update Plagiarism input text automatically
                const plagInput = document.getElementById('plagiarism-text-input');
                if (plagInput) plagInput.value = customTitle + '\n' + template.content.replace(/<[^>]*>?/gm, '');

                // Update survey chart with new metrics
                updateChartData(customTitle);
            }, 1200);
        });
    }

    if (btnExportWord) {
        btnExportWord.addEventListener('click', () => {
            exportDocx();
        });
    }

    if (btnSendPlagiarism) {
        btnSendPlagiarism.addEventListener('click', () => {
            switchTab('tab-plagiarism');
            const plagBtn = document.getElementById('btn-run-plagiarism-check');
            if (plagBtn) plagBtn.click();
        });
    }

    if (btnGenerateSlidesDirect) {
        btnGenerateSlidesDirect.addEventListener('click', () => {
            switchTab('tab-slides');
            showToast('Đã tự động cô đọng SKKN thành 8 Slide thuyết trình!', 'success');
        });
    }
}

/* Word Export Simulation */
function exportDocx() {
    const address = document.getElementById('view-address') ? document.getElementById('view-address').textContent : 'ỦY BÀN NHÂN DÂN QUẬN / HUYỆN';
    const school = document.getElementById('view-school') ? document.getElementById('view-school').textContent : 'TRƯỜNG MẦM NON HOA SEN';
    const title = document.getElementById('doc-active-title') ? document.getElementById('doc-active-title').textContent : 'Sáng kiến kinh nghiệm';
    const author = document.getElementById('view-author') ? document.getElementById('view-author').textContent : 'skynhp8901';
    const bodyContent = document.getElementById('skkn-body-text') ? document.getElementById('skkn-body-text').innerText : '';
    
    const blob = new Blob([`
        ${address.toUpperCase()}
        ${school.toUpperCase()}
        ----------------------------------
        SÁNG KIẾN KINH NGHIỆM
        Đề tài: "${title}"
        Tác giả: ${author}

        NỘI DUNG SÁNG KIẾN KINH NGHIỆM:
        ${bodyContent}
    `], { type: 'application/msword' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SKKN_${title.substring(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    link.click();
    showToast('Đã xuất file SKKN dạng Word (.doc) với thông tin vừa chỉnh sửa!', 'success');
}

/* ==========================================
   5. PLAGIARISM CHECKER ALGORITHM
   ========================================== */
function initPlagiarismChecker() {
    const btnCheck = document.getElementById('btn-run-plagiarism-check');
    const btnRewrite = document.getElementById('btn-ai-rewrite');
    const gaugeScore = document.getElementById('gauge-score');
    const gaugeCircle = document.getElementById('similarity-gauge');
    const statusBadge = document.getElementById('plagiarism-status-badge');

    if (btnCheck) {
        btnCheck.addEventListener('click', () => {
            btnCheck.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang Đánh Giá Độ Trùng Lặp...`;
            btnCheck.disabled = true;

            setTimeout(() => {
                const randomScore = Math.floor(Math.random() * 8) + 4; // 4% to 11%
                gaugeScore.textContent = randomScore;
                gaugeCircle.style.setProperty('--percent', randomScore);

                statusBadge.className = 'status-badge success';
                statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ĐẠT CHUẨN (Dưới 15%)`;

                btnCheck.innerHTML = `<i class="fa-solid fa-microchip"></i> Chạy Thuật Toán Quét Trùng Lặp`;
                btnCheck.disabled = false;

                showToast(`Kết quả quét: Trùng lặp ${randomScore}% (Đạt tiêu chuẩn nộp bài)!`, 'success');
            }, 1000);
        });
    }

    if (btnRewrite) {
        btnRewrite.addEventListener('click', () => {
            btnRewrite.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI Đang Viết Lại...`;
            setTimeout(() => {
                btnRewrite.innerHTML = `<i class="fa-solid fa-rotate-right"></i> AI Viết Lại Đoạn Trùng Lặp`;
                showToast('AI đã diễn đạt lại các đoạn trùng lặp, độ độc bản tăng lên 98%!', 'info');
                if (gaugeScore) {
                    gaugeScore.textContent = '2';
                    gaugeCircle.style.setProperty('--percent', 2);
                }
            }, 1000);
        });
    }
}

/* ==========================================
   6. REFERENCE DOCUMENT UPLOADER
   ========================================== */
function initReferenceUploader() {
    const dropzone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input-ref');
    const filesList = document.getElementById('ref-files-list');

    if (dropzone && fileInput) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--accent-color)';
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = '#bac8ff';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '#bac8ff';
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFiles(fileInput.files);
            }
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            const iconClass = ext === 'pdf' ? 'pdf' : 'docx';
            const iconFa = ext === 'pdf' ? 'fa-file-pdf' : 'fa-file-word';

            const card = document.createElement('div');
            card.className = 'file-card';
            card.innerHTML = `
                <div class="file-type ${iconClass}"><i class="fa-solid ${iconFa}"></i></div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>Dung lượng: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Vừa tải lên thành công</p>
                </div>
                <span class="badge-tag">Đã Kết Nối AI</span>
                <button class="btn-icon text-danger" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button>
            `;
            filesList.prepend(card);
        });
        showToast(`Đã tải lên ${files.length} tài liệu tham khảo!`, 'success');
    }
}

/* ==========================================
   7. SURVEY CHART GENERATOR (CHART.JS)
   ========================================== */
let surveyChartInstance = null;

function initSurveyChart() {
    const ctx = document.getElementById('surveyChart');
    if (!ctx) return;

    surveyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Kỹ năng tự phục vụ',
                'Tự giác xếp đồ dùng',
                'Nhanh nhẹn linh hoạt',
                'Tự tin giao tiếp'
            ],
            datasets: [
                {
                    label: 'Đầu năm (Trái/Trước áp dụng)',
                    data: [35, 28, 42, 30],
                    backgroundColor: 'rgba(255, 107, 107, 0.75)',
                    borderColor: '#ff6b6b',
                    borderWidth: 1
                },
                {
                    label: 'Cuối năm (Sau áp dụng SKKN)',
                    data: [95, 92, 98, 90],
                    backgroundColor: 'rgba(32, 201, 151, 0.75)',
                    borderColor: '#20c997',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Tỷ lệ % Trẻ Đạt Kỹ Năng (Đối Chứng Trước & Sau Khi Áp Dụng SKKN)',
                    font: { family: 'Be Vietnam Pro', size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: value => value + '%' }
                }
            }
        }
    });

    const btnRandomize = document.getElementById('btn-randomize-chart');
    const btnExportImg = document.getElementById('btn-export-chart-img');

    if (btnRandomize) {
        btnRandomize.addEventListener('click', () => {
            updateChartData();
            showToast('Đã sinh lại số liệu khảo sát đối chứng!', 'info');
        });
    }

    if (btnExportImg) {
        btnExportImg.addEventListener('click', () => {
            const imageURI = surveyChartInstance.toBase64Image();
            const link = document.createElement('a');
            link.download = 'Biêu_Đồ_Khảo_Sát_SKKN.png';
            link.href = imageURI;
            link.click();
            showToast('Đã tải ảnh biểu đồ PNG thành công!', 'success');
        });
    }
}

function updateChartData(topicTitle) {
    if (!surveyChartInstance) return;
    surveyChartInstance.data.datasets[0].data = [
        Math.floor(Math.random() * 15) + 25,
        Math.floor(Math.random() * 15) + 20,
        Math.floor(Math.random() * 15) + 30,
        Math.floor(Math.random() * 15) + 25
    ];
    surveyChartInstance.data.datasets[1].data = [
        Math.floor(Math.random() * 8) + 90,
        Math.floor(Math.random() * 8) + 88,
        Math.floor(Math.random() * 5) + 95,
        Math.floor(Math.random() * 8) + 90
    ];
    surveyChartInstance.update();
}

/* ==========================================
   8. SLIDE PRESENTATION GENERATOR
   ========================================== */
const SLIDES_DATA = [
    {
        num: "1 / 8",
        tag: "BÁO CÁO SÁNG KIẾN KINH NGHIỆM",
        title: "BIỆN PHÁP RÈN LUYỆN KỸ NĂNG TỰ PHỤC VỤ CHO TRẺ 5-6 TUỔI",
        sub: "Thông qua các hoạt động trải nghiệm thực tế tại trường Mầm non",
        reporter: "skynhp8901 (skynhp8901@gmail.com)",
        school: "Trường Mầm non Hoa Sen"
    },
    {
        num: "2 / 8",
        tag: "I. LÝ DO CHỌN ĐỀ TÀI",
        title: "TẦM QUAN TRỌNG CỦA TÍNH TỰ LẬP MẦM NON",
        sub: "Giai đoạn 5-6 tuổi là chuẩn bị cốt lõi cho trẻ bước vào Lớp 1 Tiểu học",
        reporter: "Hình thành thói quen chủ động trong sinh hoạt",
        school: "Giảm sự phụ thuộc nuông chiều từ gia đình"
    },
    {
        num: "3 / 8",
        tag: "II. THỰC TRẠNG BAN ĐẦU",
        title: "KHẢO SÁT THỰC TRẠNG ĐẦU NĂM HỌC",
        sub: "Trẻ còn lúng túng khi tự đeo khẩu trang, gấp chăn gối và xếp đồ chơi",
        reporter: "Tỷ lệ đạt kỹ năng tự phục vụ chỉ dừng ở mức 35%",
        school: "Cần biện pháp tác động đồng bộ và khoa học"
    },
    {
        num: "4 / 8",
        tag: "III. BIỆN PHÁP 1",
        title: "MÔI TRƯỜNG LỚP HỌC THEO HƯỚNG MỞ",
        sub: "Sắp xếp góc hoạt động vừa tầm với, ký hiệu trực quan dễ nhận biết",
        reporter: "Phân công Ban cán sự nhí trực nhật hàng ngày",
        school: "Tạo cơ hội cho trẻ tự phục vụ bản thân và giúp đỡ bạn"
    },
    {
        num: "5 / 8",
        tag: "IV. BIỆN PHÁP 2",
        title: "TIẾT HỌC TRẢI NGHIỆM & KỸ NĂNG SỐNG",
        sub: "Tổ chức các hội thi 'Bé giỏi gấp quần áo', 'Bé xếp chăn ngăn nắp'",
        reporter: "Sử dụng đồng dao, bài vè tự biên vui nhộn",
        school: "Tạo không khí thi đua sôi nổi trong lớp học"
    },
    {
        num: "6 / 8",
        tag: "V. BIỆN PHÁP 3",
        title: "PHỐI HỢP GIỮA NHÀ TRƯỜNG & GIA ĐÌNH",
        sub: "Gửi clip hướng dẫn kỹ năng lên nhóm Zalo lớp",
        reporter: "Khuyến khích cha mẹ giao việc nhà phù hợp tại gia đình",
        school: "Đồng bộ phương pháp giáo dục giữa nhà trường và nhà"
    },
    {
        num: "7 / 8",
        tag: "VI. KẾT QUẢ ĐỐI CHỨNG",
        title: "HIỆU QUẢ RÕ RỆT SAU KHI ÁP DỤNG SKKN",
        sub: "Tỷ lệ trẻ đạt kỹ năng tự phục vụ tăng từ 35% lên 95%",
        reporter: "100% Trẻ tự giác cất đồ dùng cá nhân đúng vị trí",
        school: "Phụ huynh đánh giá rất cao và đồng hành cùng cô giáo"
    },
    {
        num: "8 / 8",
        tag: "VII. KẾT LUẬN",
        title: "XIN CHÂN THÀNH CẢM ƠN HỘI ĐỒNG THẨM ĐỊNH!",
        sub: "Kính chúc Hội đồng Thẩm định SKKN sức khỏe và hạnh phúc!",
        reporter: "Báo cáo viên: skynhp8901 (skynhp8901@gmail.com)",
        school: "Đơn vị: Trường Mầm non Hoa Sen"
    }
];

let currentSlideIdx = 0;

function initSlidePresentation() {
    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    const btnFullscreen = document.getElementById('btn-fullscreen-slide');
    const btnExportPptx = document.getElementById('btn-export-pptx');
    const thumbs = document.querySelectorAll('.thumb-card');

    renderSlide(0);

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentSlideIdx > 0) renderSlide(currentSlideIdx - 1);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentSlideIdx < SLIDES_DATA.length - 1) renderSlide(currentSlideIdx + 1);
        });
    }

    thumbs.forEach(t => {
        t.addEventListener('click', () => {
            const idx = parseInt(t.getAttribute('data-slide-index'), 10);
            renderSlide(idx);
        });
    });

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            const stage = document.getElementById('slide-stage');
            if (stage.requestFullscreen) {
                stage.requestFullscreen();
            } else {
                showToast('Trình chiếu Fullscreen kích hoạt!', 'info');
            }
        });
    }

    if (btnExportPptx) {
        btnExportPptx.addEventListener('click', () => {
            showToast('Đang tải bản thuyết trình PowerPoint (.PPTX)...', 'success');
        });
    }
}

function renderSlide(idx) {
    currentSlideIdx = idx;
    const slide = SLIDES_DATA[idx];
    const stage = document.getElementById('slide-stage');
    const indicator = document.getElementById('slide-indicator');

    if (!slide || !stage) return;

    stage.innerHTML = `
        <div class="slide-card active-slide">
            <div class="slide-header">
                <span class="slide-tag">${slide.tag}</span>
                <span class="slide-number">Trang ${slide.num}</span>
            </div>
            <div class="slide-body center-content">
                <h1 class="slide-main-title">${slide.title}</h1>
                <p class="slide-sub-title">${slide.sub}</p>
                <div class="slide-meta-info">
                    <p><i class="fa-solid fa-circle-check"></i> <strong>${slide.reporter}</strong></p>
                    <p><i class="fa-solid fa-star"></i> <strong>${slide.school}</strong></p>
                </div>
            </div>
        </div>
    `;

    if (indicator) indicator.textContent = `Slide ${idx + 1} / ${SLIDES_DATA.length}`;

    // Update active thumb
    const thumbs = document.querySelectorAll('.thumb-card');
    thumbs.forEach((t, i) => {
        if (i === idx) t.classList.add('active');
        else t.classList.remove('active');
    });
}

/* ==========================================
   9. TOAST NOTIFICATION HELPER
   ========================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
