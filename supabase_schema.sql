-- ============================================================================
-- NỀN TẢNG HỌC LIỆU, TRÒ CHƠI & SOẠN GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ MẦM NON (2026)
-- ĐÂY LÀ FILE SQL KHỞI TẠO HOÀN CHỈNH. CHẠY TOÀN BỘ TRONG SUPABASE SQL EDITOR.
-- ============================================================================

-- 1. BẢNG PROFILES (THÔNG TIN TÀI KHOẢN GIÁO VIÊN & ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    school_name TEXT DEFAULT 'Trường Mầm non Hoa Sen',
    school_address TEXT DEFAULT 'Quận / Huyện Nghệ An',
    role TEXT DEFAULT 'Giáo viên Mầm non',
    system_role TEXT DEFAULT 'ROLE_TEACHER', -- 'ROLE_TEACHER', 'ROLE_ADMIN'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tự động thêm cột & thả các ràng buộc không cần thiết
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS system_role TEXT DEFAULT 'ROLE_TEACHER';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Thiết lập RLS cho bảng Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép đọc toàn bộ profiles" ON public.profiles;
CREATE POLICY "Cho phép đọc toàn bộ profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép chèn và đồng bộ profile từ Web" ON public.profiles;
CREATE POLICY "Cho phép chèn và đồng bộ profile từ Web" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép cập nhật profile từ Web" ON public.profiles;
CREATE POLICY "Cho phép cập nhật profile từ Web" ON public.profiles FOR UPDATE USING (true);

-- Khởi tạo tài khoản Admin và Giáo viên mẫu
INSERT INTO public.profiles (id, email, full_name, school_name, system_role)
VALUES 
    (gen_random_uuid(), 'skynhp8901@gmail.com', 'Quản trị viên skynhp8901', 'Trường Mầm non Hoa Sen', 'ROLE_ADMIN'),
    (gen_random_uuid(), 'thao.nguyen@gmail.com', 'Cô Phạm Thị Thanh Thảo', 'Trường Mầm non Ánh Dương', 'ROLE_TEACHER'),
    (gen_random_uuid(), 'phuongmai.nursery@edu.vn', 'Cô Trần Phương Mai', 'Trường Mầm non Sao Mai', 'ROLE_TEACHER')
ON CONFLICT (email) DO UPDATE 
SET system_role = EXCLUDED.system_role, last_login_at = NOW();

-- 2. TRIGGER TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG NHẬP BẰNG EMAIL / GOOGLE (SUPABASE AUTH)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (email) DO UPDATE
    SET last_login_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BẢNG USER_LOGIN_LOGS (NHẬT KÝ ĐĂNG NHẬP HỆ THỐNG)
CREATE TABLE IF NOT EXISTS public.user_login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    email TEXT NOT NULL,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT DEFAULT '127.0.0.1',
    user_agent TEXT DEFAULT 'Browser',
    provider TEXT DEFAULT 'Email/Password',
    status TEXT DEFAULT 'SUCCESS'
);

ALTER TABLE public.user_login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem nhật ký đăng nhập" ON public.user_login_logs;
CREATE POLICY "Cho phép xem nhật ký đăng nhập" ON public.user_login_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép ghi nhật ký đăng nhập" ON public.user_login_logs;
CREATE POLICY "Cho phép ghi nhật ký đăng nhập" ON public.user_login_logs FOR INSERT WITH CHECK (true);

-- 4. BẢNG LESSON_PLANS (GIÁO ÁN TÍCH HỢP NĂNG LỰC SỐ MẦM NON)
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name TEXT,
    title TEXT NOT NULL,
    age_group TEXT NOT NULL, -- 'nha_tre_3_12m', 'nha_tre_12_24m', 'nha_tre_24_36m', 'mau_giao_3_4t', 'mau_giao_4_5t', 'mau_giao_5_6t'
    domain TEXT NOT NULL, -- 'Phát triển Ngôn ngữ', 'Phát triển Thể chất', 'Phát triển Nhận thức', 'Phát triển Thẩm mỹ', 'Phát triển Tình cảm & KNS'
    topic TEXT, -- Chủ đề bài học
    duration_minutes INT DEFAULT 30,
    digital_competencies_json JSONB, -- Danh sách năng lực số tích hợp
    objectives_html TEXT, -- Mục tiêu bài học (Kiến thức, Kỹ năng, Thái độ, Năng lực số)
    preparations_html TEXT, -- Đồ dùng & Học liệu số chuẩn bị
    activities_json JSONB, -- Tiến trình các hoạt động học
    evaluation_rubric_json JSONB, -- Rubric đánh giá năng lực số của trẻ
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem tất cả giáo án" ON public.lesson_plans;
CREATE POLICY "Cho phép xem tất cả giáo án" ON public.lesson_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép tạo giáo án mới" ON public.lesson_plans;
CREATE POLICY "Cho phép tạo giáo án mới" ON public.lesson_plans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép sửa giáo án" ON public.lesson_plans;
CREATE POLICY "Cho phép sửa giáo án" ON public.lesson_plans FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Cho phép xóa giáo án" ON public.lesson_plans;
CREATE POLICY "Cho phép xóa giáo án" ON public.lesson_plans FOR DELETE USING (true);

-- 5. BẢNG LEARNING_MATERIALS (KHO HỌC LIỆU MẦM NON)
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id BIGSERIAL PRIMARY KEY,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploader_name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Phiếu bài tập A4', 'Tranh tô màu', 'Giáo án mẫu', 'Slide PPT', 'Audio / Video', 'Hình ảnh minh họa'
    age_group TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size_mb NUMERIC(6,2) DEFAULT 0.5,
    downloads_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem tất cả học liệu" ON public.learning_materials;
CREATE POLICY "Cho phép xem tất cả học liệu" ON public.learning_materials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép thêm học liệu mới" ON public.learning_materials;
CREATE POLICY "Cho phép thêm học liệu mới" ON public.learning_materials FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép cập nhật học liệu" ON public.learning_materials;
CREATE POLICY "Cho phép cập nhật học liệu" ON public.learning_materials FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Cho phép xóa học liệu" ON public.learning_materials;
CREATE POLICY "Cho phép xóa học liệu" ON public.learning_materials FOR DELETE USING (true);

-- 6. BẢNG INTERACTIVE_GAMES (KHO TRÒ CHƠI HỌC TẬP MẦM NON)
CREATE TABLE IF NOT EXISTS public.interactive_games (
    id BIGSERIAL PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    creator_name TEXT,
    title TEXT NOT NULL,
    game_type TEXT NOT NULL, -- 'Chữ cái & Con số', 'Ghép hình & Nhận biết', 'Đố vui tương tác', 'Âm thanh & Màu sắc'
    age_group TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    thumbnail_url TEXT,
    game_config_json JSONB, -- Dữ liệu câu hỏi, đáp án, hình ảnh trong game
    play_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interactive_games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem tất cả trò chơi" ON public.interactive_games;
CREATE POLICY "Cho phép xem tất cả trò chơi" ON public.interactive_games FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép tạo trò chơi mới" ON public.interactive_games;
CREATE POLICY "Cho phép tạo trò chơi mới" ON public.interactive_games FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép sửa trò chơi" ON public.interactive_games;
CREATE POLICY "Cho phép sửa trò chơi" ON public.interactive_games FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Cho phép xóa trò chơi" ON public.interactive_games;
CREATE POLICY "Cho phép xóa trò chơi" ON public.interactive_games FOR DELETE USING (true);

-- 7. KHỞI TẠO BUCKET TỰ ĐỘNG CHO SUPABASE STORAGE
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('learning-materials', 'learning-materials', true),
    ('game-assets', 'game-assets', true),
    ('skkn-references', 'skkn-references', true),
    ('skkn-artifacts', 'skkn-artifacts', true)
ON CONFLICT (id) DO NOTHING;

-- Thiết lập RLS cho Storage
DROP POLICY IF EXISTS "Cho phép truy cập công khai Storage Buckets" ON storage.objects;
CREATE POLICY "Cho phép truy cập công khai Storage Buckets" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép upload file lên Storage Buckets" ON storage.objects;
CREATE POLICY "Cho phép upload file lên Storage Buckets" ON storage.objects FOR INSERT WITH CHECK (true);
