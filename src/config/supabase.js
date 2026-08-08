import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || window.SUPABASE_CONFIG?.URL || 'https://smnbjhtttoshnbghilcs.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.SUPABASE_CONFIG?.ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbmJqaHR0dG9zaG5iZ2hpbGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDE2MDQsImV4cCI6MjEwMTY3NzYwNH0._FkvfbLdGXiSiESlujOkNBU7Nb02SAFXniHjUhum6a8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
