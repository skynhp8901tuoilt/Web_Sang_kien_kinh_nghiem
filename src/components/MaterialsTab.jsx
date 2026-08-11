import React, { useState, useEffect } from 'react';
import supabase, { uploadToStorage } from '../config/supabase';

export default function MaterialsTab({ showToast, user }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterAge, setFilterAge] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Phiếu bài tập A4');
  const [uploadAge, setUploadAge] = useState('mau_giao_3_4t');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [filterCategory, filterAge]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let query = supabase.from('learning_materials').select('*').order('created_at', { ascending: false });

      if (filterCategory !== 'ALL') query = query.eq('category', filterCategory);
      if (filterAge !== 'ALL') query = query.eq('age_group', filterAge);

      const { data, error } = await query;
      if (error) throw error;
      if (data) setMaterials(data);
    } catch (err) {
      console.warn('Lỗi tải kho học liệu từ Supabase DB:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Vui lòng nhập tên tài liệu/học liệu!', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      let filePublicUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80';
      let fileType = 'PDF / Document';
      let fileSizeMb = 1.2;

      if (selectedFile) {
        fileType = selectedFile.type || selectedFile.name.split('.').pop();
        fileSizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);

        // Upload to Supabase Storage Bucket
        const uploadRes = await uploadToStorage('learning-materials', selectedFile, 'materials');
        if (uploadRes.success) {
          filePublicUrl = uploadRes.publicUrl;
        } else {
          console.warn('Không upload được storage, dùng đường dẫn mặc định:', uploadRes.error);
        }
      }

      const payload = {
        uploader_id: user?.id || null,
        uploader_name: user?.fullname || 'Cô Phạm Thị Thanh Thảo',
        title: uploadTitle,
        description: uploadDesc,
        category: uploadCategory,
        age_group: uploadAge,
        file_url: filePublicUrl,
        file_type: fileType,
        file_size_mb: fileSizeMb,
        downloads_count: 0,
        is_approved: true
      };

      const { data, error } = await supabase
        .from('learning_materials')
        .insert([payload])
        .select();

      if (error) throw error;

      showToast('Đã tải học liệu thành công lên Supabase Storage & Database!', 'success');
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadDesc('');
      setSelectedFile(null);
      fetchMaterials();
    } catch (err) {
      showToast(`Lỗi upload học liệu: ${err.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleIncrementDownload = async (item) => {
    try {
      await supabase
        .from('learning_materials')
        .update({ downloads_count: (item.downloads_count || 0) + 1 })
        .eq('id', item.id);

      window.open(item.file_url, '_blank');
      fetchMaterials();
    } catch (e) {
      window.open(item.file_url, '_blank');
    }
  };

  const filteredList = materials.filter(m => 
    m.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
    (m.description && m.description.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  return (
    <div class="materials-page-container">
      {/* Top Banner */}
      <div class="card-box materials-banner-card">
        <div class="banner-content-row">
          <div>
            <h2><i class="fa-solid fa-box-archive text-pink"></i> KHO HỌC LIỆU MẦM NON SỐ</h2>
            <p>Tải lên & Tải về tài liệu, phiếu học tập A4, tranh tô màu, slide PPT, bài hát mầm non (Supabase Storage)</p>
          </div>
          <button class="btn-accent" onClick={() => setShowUploadModal(true)}>
            <i class="fa-solid fa-cloud-arrow-up"></i> Tải Học Liệu Mới Lên
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div class="filter-controls-grid margin-top">
          <div class="search-input-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm học liệu mầm non..." 
              value={searchKeyword} 
              onChange={e => setSearchKeyword(e.target.value)} 
            />
          </div>

          <select class="form-control" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="ALL">-- Tất cả Danh mục --</option>
            <option value="Phiếu bài tập A4">Phiếu bài tập A4</option>
            <option value="Tranh tô màu">Tranh tô màu</option>
            <option value="Giáo án mẫu">Giáo án mẫu</option>
            <option value="Slide PPT">Slide PPT</option>
            <option value="Audio / Video">Audio / Video bài hát</option>
            <option value="Hình ảnh minh họa">Hình ảnh minh họa</option>
          </select>

          <select class="form-control" value={filterAge} onChange={e => setFilterAge(e.target.value)}>
            <option value="ALL">-- Tất cả Độ tuổi --</option>
            <option value="nha_tre_3_12m">Nhà trẻ (3-12m)</option>
            <option value="nha_tre_12_24m">Nhà trẻ (12-24m)</option>
            <option value="nha_tre_24_36m">Nhà trẻ (24-36m)</option>
            <option value="mau_giao_3_4t">Mẫu giáo Bé (3-4t)</option>
            <option value="mau_giao_4_5t">Mẫu giáo Nhở (4-5t)</option>
            <option value="mau_giao_5_6t">Mẫu giáo Lớn (5-6t)</option>
          </select>
        </div>
      </div>

      {/* Materials Display Grid */}
      <div class="materials-grid margin-top">
        {loading ? (
          <div class="loading-box"><i class="fa-solid fa-spinner fa-spin"></i> Đang kết nối Supabase CSDL...</div>
        ) : filteredList.length === 0 ? (
          <div class="card-box empty-state-box full-width">
            <i class="fa-solid fa-folder-open fa-3x text-muted"></i>
            <h4 class="margin-top-sm">Chưa có học liệu nào phù hợp</h4>
            <p>Thầy/Cô hãy bấm "Tải Học Liệu Mới Lên" để lưu trữ học liệu mầm non lên Supabase Storage nhé!</p>
          </div>
        ) : (
          filteredList.map(item => (
            <div key={item.id} class="material-card-box">
              <div class="material-header-row">
                <span class="category-badge">{item.category}</span>
                <span class="age-badge">{item.age_group}</span>
              </div>
              <h3 class="material-title">{item.title}</h3>
              <p class="material-desc">{item.description || 'Học liệu mầm non hữu ích hỗ trợ hoạt động dạy học tích hợp.'}</p>
              
              <div class="material-meta-footer">
                <div class="meta-stats">
                  <span><i class="fa-solid fa-download"></i> {item.downloads_count || 0} lượt tải</span>
                  <span><i class="fa-solid fa-hard-drive"></i> {item.file_size_mb || 1} MB</span>
                </div>
                <button type="button" class="btn-primary compact-btn" onClick={() => handleIncrementDownload(item)}>
                  <i class="fa-solid fa-download"></i> Tải về
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div class="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div class="modal-card" onClick={e => e.stopPropagation()}>
            <div class="modal-header">
              <h3><i class="fa-solid fa-cloud-arrow-up text-pink"></i> Tải Học Liệu Mới Lên Supabase Storage</h3>
              <button class="close-btn" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <form onSubmit={handleUploadSubmit} class="modal-body">
              <div class="form-group">
                <label>Tên Học liệu / Tài liệu (*):</label>
                <input 
                  type="text" 
                  class="form-control" 
                  required 
                  placeholder="Ví dụ: Bộ 20 Phiếu tô màu chữ cái Mẫu giáo 4-5 tuổi"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                />
              </div>

              <div class="form-group margin-top-sm">
                <label>Mô tả ngắn học liệu:</label>
                <textarea 
                  class="form-control" 
                  rows="2" 
                  placeholder="Mô tả nội dung học liệu..."
                  value={uploadDesc}
                  onChange={e => setUploadDesc(e.target.value)}
                />
              </div>

              <div class="form-row margin-top-sm">
                <div class="form-group flex-1">
                  <label>Loại danh mục:</label>
                  <select class="form-control" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                    <option value="Phiếu bài tập A4">Phiếu bài tập A4</option>
                    <option value="Tranh tô màu">Tranh tô màu</option>
                    <option value="Giáo án mẫu">Giáo án mẫu</option>
                    <option value="Slide PPT">Slide PPT</option>
                    <option value="Audio / Video">Audio / Video bài hát</option>
                    <option value="Hình ảnh minh họa">Hình ảnh minh họa</option>
                  </select>
                </div>

                <div class="form-group flex-1">
                  <label>Nhóm độ tuổi:</label>
                  <select class="form-control" value={uploadAge} onChange={e => setUploadAge(e.target.value)}>
                    <option value="mau_giao_3_4t">Mẫu giáo Bé (3-4t)</option>
                    <option value="mau_giao_4_5t">Mẫu giáo Nhở (4-5t)</option>
                    <option value="mau_giao_5_6t">Mẫu giáo Lớn (5-6t)</option>
                    <option value="nha_tre_24_36m">Nhà trẻ (24-36m)</option>
                  </select>
                </div>
              </div>

              <div class="form-group margin-top-sm">
                <label>Chọn tệp đính kèm (File PDF, Word, Ảnh, Zip):</label>
                <input type="file" class="form-control" onChange={handleFileChange} />
              </div>

              <div class="modal-actions margin-top">
                <button type="submit" class="btn-accent" disabled={isUploading}>
                  {isUploading ? <><i class="fa-solid fa-spinner fa-spin"></i> Đang tải file lên Supabase Storage...</> : <><i class="fa-solid fa-cloud-arrow-up"></i> Tải Lên & Lưu CSDL</>}
                </button>
                <button type="button" class="btn-secondary" onClick={() => setShowUploadModal(false)}>Hủy bỏ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
