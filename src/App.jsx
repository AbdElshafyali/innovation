import React, { useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

import AuthScreen from './AuthScreen.jsx';
import Sidebar from './Sidebar.jsx';
import ChatInterface from './ChatInterface.jsx';
import InvoicesDashboard from './InvoicesDashboard.jsx';
import ProfilePage from './ProfilePage.jsx';
import PermissionsPage from './PermissionsPage.jsx';

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

  return <MainApp currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />;
};

const MainApp = ({ currentUser, setCurrentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('chat');
  
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
  const [employees, setEmployees] = useLocalStorage(`employees_${currentUser.id}`, []);

  const addInvoice = (invoiceData) => {
    setInvoices(prev => [invoiceData, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
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
      case 'permissions':
        return <PermissionsPage employees={employees} setEmployees={setEmployees} />;
      default:
        return <ChatInterface messages={messages} setMessages={setMessages} addInvoice={addInvoice} invoices={invoices} currentUser={currentUser} />;
    }
  }

  return (
    <div dir="rtl" className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
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