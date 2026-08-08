import React, { useState } from 'react';

export default function AdminDashboard({ user, showToast }) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('users');
  const isAdminUser = user?.email === 'skynhp8901@gmail.com' || user?.username === 'skynhp8901';

  if (!isAdminUser) {
    return (
      <div class="card-box text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <i class="fa-solid fa-user-lock text-danger" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></i>
        <h2 style={{ color: '#e03131', fontWeight: 800 }}>TỪ CHỐI TRUY CẬP (ACCESS DENIED)</h2>
        <p class="margin-top-sm" style={{ color: '#495057', fontSize: '1rem' }}>
          Khu vực này được thắt chặt bảo mật. Chỉ duy nhất tài khoản Quản trị viên cá nhân <strong>skynhp8901@gmail.com</strong> mới có quyền truy cập!
        </p>
      </div>
    );
  }

  // Simulated Users Data
  const [users, setUsers] = useState([
    { id: 'usr-1', username: 'skynhp8901', email: 'skynhp8901@gmail.com', fullname: 'Cô Nguyễn Thị Phương Thảo', school: 'Trường Mầm non Hoa Sen', role: 'ROLE_ADMIN', status: 'ACTIVE', lastLogin: '08/08/2026 22:15:30' },
    { id: 'usr-2', username: 'thao_nguyen', email: 'thao.nguyen@gmail.com', fullname: 'Cô Phạm Thị Thanh Thảo', school: 'Trường Mầm non Ánh Dương', role: 'ROLE_TEACHER', status: 'ACTIVE', lastLogin: '08/08/2026 19:40:12' },
    { id: 'usr-3', username: 'phuong_mai', email: 'phuongmai.nursery@edu.vn', fullname: 'Cô Trần Phương Mai', school: 'Trường Mầm non Sao Mai', role: 'ROLE_EXPERT_REVIEWER', status: 'ACTIVE', lastLogin: '07/08/2026 14:22:05' },
    { id: 'usr-4', username: 'le_thu_ha', email: 'leha.skkn@gmail.com', fullname: 'Cô Lê Thu Hà', school: 'Trường Mầm non Hoạ Mi', role: 'ROLE_TEACHER', status: 'LOCKED', lastLogin: '02/08/2026 09:10:44' }
  ]);

  // Simulated Initiatives Data
  const [initiatives, setInitiatives] = useState([
    { id: 101, title: 'Biện pháp rèn luyện kỹ năng tự phục vụ cho trẻ 5-6 tuổi', author: 'skynhp8901', ageGroup: 'Mẫu giáo Lớn (5-6t)', status: 'APPROVED', plagScore: '2.1%', createdAt: '08/08/2026' },
    { id: 102, title: 'Ứng dụng trò chơi âm nhạc phát triển ngôn ngữ cho trẻ 24-36 tháng', author: 'thao_nguyen', ageGroup: 'Nhà trẻ (24-36m)', status: 'PENDING', plagScore: '4.5%', createdAt: '08/08/2026' },
    { id: 103, title: 'Tạo môi trường lớp học mở kích thích tư duy toán mầm non 4-5 tuổi', author: 'phuong_mai', ageGroup: 'Mẫu giáo Nhỡ (4-5t)', status: 'APPROVED', plagScore: '1.8%', createdAt: '07/08/2026' }
  ]);

  // Simulated Audit Logs Data
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'skynhp8901', ip: '113.161.42.18', device: 'Windows 11 / Chrome 124.0', time: '08/08/2026 22:15:30', status: 'Thành công (Supabase Live)' },
    { id: 2, user: 'thao_nguyen', ip: '14.232.105.90', device: 'iPad iOS 17.4 / Safari', time: '08/08/2026 19:40:12', status: 'Thành công' },
    { id: 3, user: 'phuong_mai', ip: '118.69.182.44', device: 'MacOS / Chrome', time: '07/08/2026 14:22:05', status: 'Thành công' }
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Đã cập nhật phân quyền tài khoản thành [${newRole}]!`, 'success');
  };

  const handleToggleLock = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' } : u));
    showToast('Đã thay đổi trạng thái khóa/mở khóa tài khoản!', 'info');
  };

  const handleApproveInitiative = (initId) => {
    setInitiatives(initiatives.map(i => i.id === initId ? { ...i, status: 'APPROVED' } : i));
    showToast(`Đã phê duyệt đề tài SKKN #${initId} đạt chuẩn Thẩm định!`, 'success');
  };

  return (
    <div class="card-box admin-portal-box">
      {/* Admin Portal Header */}
      <div class="admin-portal-header">
        <div class="admin-title-area">
          <div class="admin-icon-badge"><i class="fa-solid fa-user-shield"></i></div>
          <div>
            <h2>Khu Vực Quản Trị Hệ Thống Admin (Control Panel)</h2>
            <p class="admin-sub">Quản lý Giáo viên, Thẩm định Bài SKKN, Nhật ký Đăng nhập & Cấu hình Supabase DB</p>
          </div>
        </div>

        {/* Admin Navigation Sub-Tabs */}
        <div class="admin-subtabs">
          <button 
            type="button" 
            class={`admin-tab-btn ${activeAdminSubTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveAdminSubTab('users')}
          >
            <i class="fa-solid fa-users-gear"></i> 1. Quản Lý Giáo Viên ({users.length})
          </button>
          <button 
            type="button" 
            class={`admin-tab-btn ${activeAdminSubTab === 'initiatives' ? 'active' : ''}`}
            onClick={() => setActiveAdminSubTab('initiatives')}
          >
            <i class="fa-solid fa-book-bookmark"></i> 2. Thẩm Định SKKN ({initiatives.length})
          </button>
          <button 
            type="button" 
            class={`admin-tab-btn ${activeAdminSubTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveAdminSubTab('audit')}
          >
            <i class="fa-solid fa-clock-rotate-left"></i> 3. Nhật Ký Đăng Nhập
          </button>
          <button 
            type="button" 
            class={`admin-tab-btn ${activeAdminSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminSubTab('settings')}
          >
            <i class="fa-solid fa-sliders"></i> 4. Cấu Hình Supabase DB
          </button>
        </div>
      </div>

      <div class="admin-portal-body margin-top">
        {/* MODULE 1: QUẢN LÝ GIÁO VIÊN */}
        {activeAdminSubTab === 'users' && (
          <div class="admin-module">
            <div class="module-bar">
              <h4><i class="fa-solid fa-users text-primary"></i> Danh Sách Tài Khoản Giáo Viên Mầm Non & Phân Quyền RBAC</h4>
              <button type="button" class="btn-primary" onClick={() => showToast('Mở form tạo tài khoản giáo viên mới!', 'info')}>
                <i class="fa-solid fa-user-plus"></i> Thêm Giáo Viên Mới
              </button>
            </div>

            <table class="table-custom margin-top-sm">
              <thead>
                <tr>
                  <th>Tên Đăng Nhập</th>
                  <th>Họ Và Tên Giáo Viên</th>
                  <th>Email</th>
                  <th>Trường Mầm Non</th>
                  <th>Quyền Hạn (Role)</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.school}</td>
                    <td>
                      <select 
                        class="form-control compact" 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="ROLE_TEACHER">Giáo viên (ROLE_TEACHER)</option>
                        <option value="ROLE_EXPERT_REVIEWER">Hội đồng Thẩm định (ROLE_EXPERT)</option>
                        <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                      </select>
                    </td>
                    <td>
                      <span class={`status-pill ${u.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                        {u.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td>
                      <button 
                        type="button" 
                        class="btn-outline compact" 
                        onClick={() => handleToggleLock(u.id)}
                      >
                        {u.status === 'ACTIVE' ? <><i class="fa-solid fa-lock"></i> Khóa</> : <><i class="fa-solid fa-lock-open"></i> Mở khóa</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 2: THẨM ĐỊNH SKKN */}
        {activeAdminSubTab === 'initiatives' && (
          <div class="admin-module">
            <div class="module-bar">
              <h4><i class="fa-solid fa-book-open-reader text-accent"></i> Quản Lý & Phê Duyệt Tất Cả Đề Tài Sáng Kiến Kinh Nghiệm</h4>
            </div>

            <table class="table-custom margin-top-sm">
              <thead>
                <tr>
                  <th>Mã SKKN</th>
                  <th>Tên Đề Tài Sáng Kiến Kinh Nghiệm</th>
                  <th>Tác Giả</th>
                  <th>Độ Tuổi</th>
                  <th>Tỷ Lệ Trùng Lặp</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác Duyệt</th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map(i => (
                  <tr key={i.id}>
                    <td><strong>#{i.id}</strong></td>
                    <td class="max-width-title"><strong>{i.title}</strong></td>
                    <td>{i.author}</td>
                    <td><span class="badge-tag accent">{i.ageGroup}</span></td>
                    <td><strong class="text-success">{i.plagScore}</strong></td>
                    <td>
                      <span class={`status-pill ${i.status === 'APPROVED' ? 'success' : 'warning'}`}>
                        {i.status === 'APPROVED' ? 'Đã Phê Duyệt' : 'Chờ Thẩm Định'}
                      </span>
                    </td>
                    <td>
                      {i.status === 'PENDING' ? (
                        <button type="button" class="btn-secondary compact" onClick={() => handleApproveInitiative(i.id)}>
                          <i class="fa-solid fa-check"></i> Duyệt Bài
                        </button>
                      ) : (
                        <span class="text-muted"><i class="fa-solid fa-circle-check text-success"></i> Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 3: NHẬT KÝ ĐĂNG NHẬP */}
        {activeAdminSubTab === 'audit' && (
          <div class="admin-module">
            <div class="module-bar">
              <h4><i class="fa-solid fa-shield-halved text-success"></i> Giám Sát Lịch Sử Đăng Nhập & Bảo Mật Thiết Bị Real-time</h4>
            </div>

            <table class="table-custom margin-top-sm">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tài Khoản Giáo Viên</th>
                  <th>Địa Chỉ IP</th>
                  <th>Trình Duyệt & Thiết Bị</th>
                  <th>Thời Gian Đăng Nhập</th>
                  <th>Kết Quả</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td><strong>{log.user}</strong></td>
                    <td><code>{log.ip}</code></td>
                    <td>{log.device}</td>
                    <td>{log.time}</td>
                    <td><span class="status-pill success">{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 4: CẤU HÌNH SUPABASE */}
        {activeAdminSubTab === 'settings' && (
          <div class="admin-module">
            <div class="module-bar">
              <h4><i class="fa-solid fa-server text-primary"></i> Trạng Thái Kết Nối Supabase Project & Storage Buckets</h4>
            </div>

            <div class="admin-config-grid margin-top-sm">
              <div class="config-card">
                <h5><i class="fa-solid fa-database text-primary"></i> Project PostgreSQL Database</h5>
                <p>Host: <code>smnbjhtttoshnbghilcs.supabase.co</code></p>
                <p>Status: <strong class="text-success">Connected 100% (Active)</strong></p>
              </div>

              <div class="config-card">
                <h5><i class="fa-solid fa-box-archive text-accent"></i> Storage Buckets</h5>
                <p>1. <code>skkn-references</code> (File PDF/DOCX)</p>
                <p>2. <code>skkn-artifacts</code> (Slide & Ảnh)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
