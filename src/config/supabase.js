import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || window.SUPABASE_CONFIG?.URL || 'https://smnbjhtttoshnbghilcs.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.SUPABASE_CONFIG?.ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbmJqaHR0dG9zaG5iZ2hpbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDE2MDQsImV4cCI6MjEwMTY3NzYwNH0._FkvfbLdGXiSiESlujOkNBU7Nb02SAFXniHjUhum6a8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Ghi nhận nhật ký đăng nhập vào Supabase DB
 */
export async function logUserLogin(userEmail, userId = null, provider = 'Email/Password') {
  try {
    const { data, error } = await supabase
      .from('user_login_logs')
      .insert([{
        user_id: userId,
        email: userEmail,
        login_time: new Date().toISOString(),
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent || 'Browser',
        provider: provider,
        status: 'SUCCESS'
      }]);
    
    if (error) console.warn('Supabase login log warning:', error.message);
    return data;
  } catch (e) {
    console.warn('Network error logging login:', e);
  }
}

/**
 * Upload File trực tiếp lên Supabase Storage
 */
export async function uploadToStorage(bucketName, file, pathPrefix = '') {
  try {
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = pathPrefix ? `${pathPrefix}/${cleanFileName}` : cleanFileName;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      filePath: data.path,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (err) {
    console.error('Storage Upload Error:', err);
    return { success: false, error: err.message };
  }
}

export default supabase;
