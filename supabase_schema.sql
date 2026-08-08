-- ============================================================================
-- MẦMNON SKKN AI - SUPABASE DATABASE INITIALIZATION SCRIPT (2026)
-- Coi đây là file khởi tạo hoàn chỉnh. Chạy toàn bộ trong Supabase SQL Editor.
-- ============================================================================

-- 1. BẢNG PROFILES (TÀI KHOẢN GIÁO VIÊN MẦM NON)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    school_name TEXT DEFAULT 'Trường Mầm non Hoa Sen',
    school_address TEXT DEFAULT 'ỦY BÀN NHÂN DÂN QUẬN / HUYỆN NGHỆ AN',
    role TEXT DEFAULT 'Giáo viên Mầm non - Khối Mẫu giáo Lớn',
    system_role TEXT DEFAULT 'ROLE_TEACHER', -- 'ROLE_TEACHER', 'ROLE_EXPERT_REVIEWER', 'ROLE_ADMIN'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TỰ ĐỘNG THÊM CỘT & THIẾT LẬP ID DEFAULT NẾU BẢNG ĐÃ TỒN TẠI TỪ TRƯỚC (SỬA LỖI 23502 & 42703)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS system_role TEXT DEFAULT 'ROLE_TEACHER';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- CHO PHÉP MỌI KẾT NỐI WEB ĐỒNG BỘ PROFILES (TRÁNH LỖI BẢNG TRỐNG)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép đọc toàn bộ profiles" ON public.profiles;
CREATE POLICY "Cho phép đọc toàn bộ profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép chèn và đồng bộ profile từ Web" ON public.profiles;
CREATE POLICY "Cho phép chèn và đồng bộ profile từ Web" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép cập nhật profile từ Web" ON public.profiles;
CREATE POLICY "Cho phép cập nhật profile từ Web" ON public.profiles FOR UPDATE USING (true);

-- GÁN CẤP NGUỒN TÀI KHOẢN QUẢN TRỊ VIÊN ADMIN CHO SKYNHP8901@GMAIL.COM (THÊM GEN_RANDOM_UUID() SỬA LỖI 23502)
INSERT INTO public.profiles (id, email, full_name, school_name, system_role)
VALUES 
    (gen_random_uuid(), 'skynhp8901@gmail.com', 'Quản trị viên skynhp8901', 'Trường Mầm non Hoa Sen', 'ROLE_ADMIN'),
    (gen_random_uuid(), 'thao.nguyen@gmail.com', 'Cô Phạm Thị Thanh Thảo', 'Trường Mầm non Ánh Dương', 'ROLE_TEACHER'),
    (gen_random_uuid(), 'phuongmai.nursery@edu.vn', 'Cô Trần Phương Mai', 'Trường Mầm non Sao Mai', 'ROLE_EXPERT_REVIEWER')
ON CONFLICT (email) DO UPDATE 
SET system_role = EXCLUDED.system_role, last_login_at = NOW();

-- 2. TRIGGER TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG NHẬP BẰNG GOOGLE / EMAIL
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

-- 3. BẢNG USER_LOGIN_LOGS (NHẬT KÝ ĐĂNG NHẬP CÁ NHÂN)
CREATE TABLE IF NOT EXISTS public.user_login_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    email TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    provider TEXT DEFAULT 'Google/Email',
    status TEXT DEFAULT 'SUCCESS'
);

ALTER TABLE public.user_login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép xem toàn bộ nhật ký" ON public.user_login_logs;
CREATE POLICY "Cho phép xem toàn bộ nhật ký" ON public.user_login_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép ghi nhật ký từ Web" ON public.user_login_logs;
CREATE POLICY "Cho phép ghi nhật ký từ Web" ON public.user_login_logs FOR INSERT WITH CHECK (true);

-- 4. BẢNG SKKN_INITIATIVES (SÁNG KIẾN KINH NGHIỆM)
CREATE TABLE IF NOT EXISTS public.skkn_initiatives (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    age_group TEXT NOT NULL, -- 'nha_tre_3_12m', 'nha_tre_24_36m', 'mau_giao_5_6t'...
    field_category TEXT NOT NULL,
    school_name TEXT,
    school_address TEXT,
    author_name TEXT,
    problem_statement TEXT,
    solutions_json JSONB,
    results_json JSONB,
    full_content TEXT,
    plagiarism_score NUMERIC(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'COMPLETED', 'EXPORTED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skkn_initiatives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giáo viên quản lý SKKN cá nhân" ON public.skkn_initiatives;
CREATE POLICY "Giáo viên quản lý SKKN cá nhân"
    ON public.skkn_initiatives FOR ALL
    USING (auth.uid() = user_id);

-- 5. BẢNG SKKN_REFERENCES (TÀI LIỆU THAM KHẢO RAG)
CREATE TABLE IF NOT EXISTS public.skkn_references (
    id BIGSERIAL PRIMARY KEY,
    skkn_id BIGINT REFERENCES public.skkn_initiatives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(6,2),
    extracted_text TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skkn_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giáo viên quản lý tài liệu tham khảo cá nhân" ON public.skkn_references;
CREATE POLICY "Giáo viên quản lý tài liệu tham khảo cá nhân"
    ON public.skkn_references FOR ALL
    USING (auth.uid() = user_id);

-- 6. BẢNG SKKN_PAGE_CONFIGS (CẤU HÌNH ĐỘ DÀI TRANG A4)
CREATE TABLE IF NOT EXISTS public.skkn_page_configs (
    id BIGSERIAL PRIMARY KEY,
    skkn_id BIGINT REFERENCES public.skkn_initiatives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_preset TEXT DEFAULT 'district',
    sec_1_pages NUMERIC(3,1) DEFAULT 1.0,
    sec_2_pages NUMERIC(3,1) DEFAULT 4.0,
    sec_3_pages NUMERIC(3,1) DEFAULT 1.0,
    sec_4_pages NUMERIC(3,1) DEFAULT 0.5,
    total_estimated_pages NUMERIC(4,1) DEFAULT 6.5,
    total_estimated_words INT DEFAULT 2480,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skkn_page_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giáo viên quản lý cấu hình độ dài A4 cá nhân" ON public.skkn_page_configs;
CREATE POLICY "Giáo viên quản lý cấu hình độ dài A4 cá nhân"
    ON public.skkn_page_configs FOR ALL
    USING (auth.uid() = user_id);

-- 7. BẢNG AI_COMMAND_LOGS (LỊCH SỬ AI SỬA NỘI DUNG THEO LỆNH)
CREATE TABLE IF NOT EXISTS public.ai_command_logs (
    id BIGSERIAL PRIMARY KEY,
    skkn_id BIGINT REFERENCES public.skkn_initiatives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_section TEXT NOT NULL,
    prompt_command TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_command_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Giáo viên xem nhật ký AI Command cá nhân" ON public.ai_command_logs;
CREATE POLICY "Giáo viên xem nhật ký AI Command cá nhân"
    ON public.ai_command_logs FOR ALL
    USING (auth.uid() = user_id);

-- 8. TẠO SUPABASE STORAGE BUCKETS CHỜ SẴN
INSERT INTO storage.buckets (id, name, public) 
VALUES ('skkn-references', 'skkn-references', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('skkn-artifacts', 'skkn-artifacts', true)
ON CONFLICT (id) DO NOTHING;
