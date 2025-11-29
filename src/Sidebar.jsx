import React, { useState } from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Users
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  return (
    <div
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col shadow-xl z-20 transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-9 bg-blue-600 rounded-full p-1 text-white border-2 border-slate-900 hover:bg-blue-500 transition-colors z-50 shadow-lg cursor-pointer"
        title={isCollapsed ? "توسيع القائمة" : "تصغير القائمة"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-4 md:p-6 flex items-center gap-3 border-b border-slate-700 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-900/50 shrink-0">
          <Sparkles size={24} className="text-white animate-pulse" />
        </div>
        <h1 className={`font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white transition-opacity duration-200 ${isCollapsed ? 'hidden opacity-0' : 'block opacity-100'}`}>
          AI Invoicer
        </h1>
      </div>

      <nav className="flex-1 p-4 gap-2 flex flex-col">
        <NavItem icon={<MessageSquare size={20} />} label="المساعد الذكي" isCollapsed={isCollapsed} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <NavItem icon={<LayoutDashboard size={20} />} label="سجل الفواتير" isCollapsed={isCollapsed} active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
        {currentUser.accountType === 'company' && (
          <NavItem icon={<Users size={20} />} label="إدارة الصلاحيات" isCollapsed={isCollapsed} active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} />
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => setActiveTab('profile')}
          title="عرض الملف الشخصي"
          className={`w-full flex items-center gap-3 transition-all duration-200 p-2 rounded-lg hover:bg-slate-800 ${isCollapsed ? 'justify-center' : ''} ${activeTab === 'profile' ? 'bg-white/10' : ''}`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.profilePic})` }}>
            {!currentUser.profilePic && <span className="font-bold text-lg">{currentUser.name.charAt(0).toUpperCase()}</span>}
          </div>
          <div className={`flex-1 transition-opacity duration-200 ${isCollapsed ? 'hidden opacity-0' : 'block opacity-100'}`}>
            <p className="font-semibold text-sm text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onLogout(); }} title="تسجيل الخروج" className={`text-slate-400 hover:text-red-400 transition-colors p-2 ${isCollapsed ? '' : 'ml-auto'}`}>
            <LogOut size={18} />
          </button>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isCollapsed, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${active ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} ${isCollapsed ? 'justify-center' : ''}`}
    title={label}
  >
    <div className="shrink-0">{icon}</div>
    <span className={`font-medium transition-all duration-200 ${isCollapsed ? 'hidden w-0 overflow-hidden' : 'block w-auto'}`}>{label}</span>
  </button>
);

export default Sidebar;
