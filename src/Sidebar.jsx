import React, { useState } from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Users,
  Shield,
  Package,
  Sun, // For light mode icon
  Moon, // For dark mode icon
  FileText, // For invoices icon
  SlidersHorizontal,
  ClipboardCheck, // For product normalization
  BookCopy, // For normalization logs
  Globe // New import for language toggle
} from 'lucide-react';
import { useTheme } from './components/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext'; // New import for language context

const Sidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettings(); // Use settings context

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col shadow-xl z-20 transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-9 bg-blue-600 rounded-full p-1 text-white border-2 border-slate-900 hover:bg-blue-500 transition-colors z-50 shadow-lg cursor-pointer"
        title={isCollapsed ? t('expand_menu') : t('collapse_menu')}
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

      {/* Main navigation section */}
      <div className="flex-1 flex flex-col justify-between">
        <nav className="p-4 gap-2 flex flex-col">
          <NavItem icon={<LayoutDashboard size={20} />} label={t('dashboard')} isCollapsed={isCollapsed} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20} />} label={t('chat_assistant')} isCollapsed={isCollapsed} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <NavItem icon={<FileText size={20} />} label={t('invoices_log')} isCollapsed={isCollapsed} active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
          <NavItem icon={<Users size={20} />} label={t('employees_management')} isCollapsed={isCollapsed} active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <NavItem icon={<Package size={20} />} label={t('products_and_items')} isCollapsed={isCollapsed} active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <NavItem icon={<ClipboardCheck size={20} />} label={t('product_normalization')} isCollapsed={isCollapsed} active={activeTab === 'product_normalization'} onClick={() => setActiveTab('product_normalization')} />
          <NavItem icon={<Shield size={20} />} label={t('permissions_management')} isCollapsed={isCollapsed} active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} />
          {currentUser.role === 'manager' && (
            <NavItem icon={<BookCopy size={20} />} label={t('normalization_logs')} isCollapsed={isCollapsed} active={activeTab === 'normalization_logs'} onClick={() => setActiveTab('normalization_logs')} />
          )}
          <NavItem icon={<SlidersHorizontal size={20} />} label={t('settings')} isCollapsed={isCollapsed} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} /> {/* Removed isAdmin check */}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
          className={`w-full flex items-center gap-3 transition-all duration-200 p-2 rounded-lg hover:bg-slate-800 mb-3 ${isCollapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
          <span className={`font-medium transition-all duration-200 ${isCollapsed ? 'hidden w-0 overflow-hidden' : 'block w-auto text-slate-300'}`}>
            {theme === 'dark' ? t('light_mode') : t('dark_mode')}
          </span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          title={language === 'ar' ? t('english') : t('arabic')}
          className={`w-full flex items-center gap-3 transition-all duration-200 p-2 rounded-lg hover:bg-slate-800 mb-3 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Globe size={20} className="text-gray-400" />
          <span className={`font-medium transition-all duration-200 ${isCollapsed ? 'hidden w-0 overflow-hidden' : 'block w-auto text-slate-300'}`}>
            {language === 'ar' ? t('english') : t('arabic')}
          </span>
        </button>

        <div
          onClick={() => setActiveTab('profile')}
          title={t('view_profile')}
          className={`w-full flex items-center gap-3 transition-all duration-200 p-2 rounded-lg hover:bg-slate-800 ${isCollapsed ? 'justify-center' : ''} ${activeTab === 'profile' ? 'bg-white/10' : ''} cursor-pointer`}
          role="button"
          tabIndex="0"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.profilePic})` }}>
            {!currentUser.profilePic && <span className="font-bold text-lg">{currentUser.name.charAt(0).toUpperCase()}</span>}
          </div>
          <div className={`flex-1 transition-opacity duration-200 ${isCollapsed ? 'hidden opacity-0' : 'block opacity-100'}`}>
            <p className="font-semibold text-sm text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onLogout(); }} title={t('logout')} className={`text-slate-400 hover:text-red-400 transition-colors p-2 ${isCollapsed ? '' : 'ml-auto'}`}>
            <LogOut size={18} />
          </button>
        </div>
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
