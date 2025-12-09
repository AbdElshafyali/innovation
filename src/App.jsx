import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

import AuthScreen from './AuthScreen.jsx';
import Sidebar from './Sidebar.jsx';
import ChatInterface from './ChatInterface.jsx';
import InvoicesDashboard from './InvoicesDashboard.jsx';
import ProfilePage from './ProfilePage.jsx'; // We will create this
import EmployeesPage from './EmployeesPage.jsx';
import PermissionsPage from './PermissionsPage.jsx'; // Adding back permissions
import ProductsPage from './ProductsPage.jsx';
import ProductNormalizationPage from './ProductNormalizationPage.jsx';
import NormalizationLogPage from './NormalizationLogPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { NotificationProvider } from './components/NotificationContext';
import { SettingsProvider, useSettings } from './SettingsContext';
import { useTranslation } from 'react-i18next';

const InvoiceBotApp = () => {
  const [users, setUsers] = useLocalStorage('users_db', []);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);  

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthScreen
      onLoginSuccess={setCurrentUser} 
      users={users}
      setUsers={setUsers}
    />;
  }

  // Pass all users to MainApp so PermissionsPage can manage them
  return (
    <ThemeProvider>
      <NotificationProvider>
        <SettingsProvider>
          <MainApp 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            onLogout={handleLogout} 
            users={users}
            setUsers={setUsers} 
          />
        </SettingsProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

const MainApp = ({ currentUser, setCurrentUser, onLogout, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme } = useTheme();
  const { language } = useSettings();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Use localStorage for invoices and messages, specific to the user
  const [invoices, setInvoices] = useLocalStorage(`invoices_${currentUser.id}`, []);
  const [messages, setMessages] = useLocalStorage(`messages_${currentUser.id}`, [
    { 
      id: 1, 
      sender: 'bot', 
      text: `أهلاً بك يا ${currentUser.nickname || currentUser.name}! أنا مساعدك الذكي ✨.`,
      type: 'text'
    }
  ]);
  // Employees should be shared across the company, not per user.
  // We'll use a single key for all employees.
  const [employees, setEmployees] = useLocalStorage('employees_db', []);
  const [products, setProducts] = useLocalStorage('products_db', []);

  const addInvoice = (invoiceData) => {
    setInvoices(prev => [invoiceData, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage employees={employees} products={products} invoices={invoices} />;
      case 'chat':
        return <ChatInterface 
          messages={messages} 
          setMessages={setMessages} 
          addInvoice={addInvoice} 
          invoices={invoices}
          currentUser={currentUser}
        />;
      case 'invoices':
        return <InvoicesDashboard invoices={invoices} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      case 'employees':
        return <EmployeesPage employees={employees} setEmployees={setEmployees} />;
      case 'permissions':
        return <PermissionsPage users={users} setUsers={setUsers} />;
      case 'products':
        return <ProductsPage products={products} setProducts={setProducts} />;
      case 'product_normalization':
        return <ProductNormalizationPage products={products} setProducts={setProducts} currentUser={currentUser} />;
      case 'normalization_logs':
        return currentUser.role === 'manager' ? <NormalizationLogPage /> : <DashboardPage employees={employees} products={products} invoices={invoices} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage employees={employees} products={products} invoices={invoices} />;
    }
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main className="flex-1 flex flex-col h-full relative transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

export default InvoiceBotApp;