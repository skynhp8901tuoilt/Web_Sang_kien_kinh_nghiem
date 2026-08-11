import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LessonPlanTab from './components/LessonPlanTab';
import MaterialsTab from './components/MaterialsTab';
import GamesTab from './components/GamesTab';
import WriterTab from './components/WriterTab';
import ReferencesTab from './components/ReferencesTab';
import ChartsTab from './components/ChartsTab';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/AuthModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const [activeTab, setActiveTab] = useState('tab-lesson-plan');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skkn_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(!user);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
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
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleLoginSuccess = (userData) => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');

    const fullUser = {
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      fullname: userData.fullname || (userData.email === 'skynhp8901@gmail.com' ? 'Quản trị viên skynhp8901' : 'Cô Phạm Thị Thanh Thảo'),
      school: userData.school || 'Trường Mầm non Hoa Sen',
      system_role: userData.system_role || (userData.email === 'skynhp8901@gmail.com' ? 'ROLE_ADMIN' : 'ROLE_TEACHER'),
      loginTime: formattedTime,
      provider: userData.provider || 'Supabase DB'
    };

    setUser(fullUser);
    localStorage.setItem('skkn_user', JSON.stringify(fullUser));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('skkn_user');
    setUser(null);
    setIsAuthOpen(true);
    showToast('Đã đăng xuất tài khoản thành công.', 'info');
  };

  return (
    <div class="app-root">
      <Header 
        user={user} 
        sessionTime={formatSessionTime(sessionSeconds)} 
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onLogout={handleLogout}
      />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} showToast={showToast} />

      <main class="app-main">
        {activeTab === 'tab-lesson-plan' && <LessonPlanTab showToast={showToast} user={user} />}
        {activeTab === 'tab-materials' && <MaterialsTab showToast={showToast} user={user} />}
        {activeTab === 'tab-games' && <GamesTab showToast={showToast} user={user} />}
        {activeTab === 'tab-writer' && <WriterTab showToast={showToast} />}
        {activeTab === 'tab-references' && <ReferencesTab showToast={showToast} />}
        {activeTab === 'tab-charts' && <ChartsTab showToast={showToast} />}
        {activeTab === 'tab-admin' && <AdminDashboard user={user} showToast={showToast} />}
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      <SupabaseConfigModal 
        isOpen={isDbModalOpen} 
        onClose={() => setIsDbModalOpen(false)}
        showToast={showToast}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
