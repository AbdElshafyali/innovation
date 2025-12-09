import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = uuidv4();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3">
        {notifications.map(notif => (
          <Notification key={notif.id} {...notif} onDismiss={removeNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

// --- Notification Component ---
const Notification = ({ id, message, type, onDismiss }) => {
  const getIcon = (notificationType) => {
    switch (notificationType) {
      case 'success': return <CheckCircle className="text-green-500" />;
      case 'error': return <XCircle className="text-red-500" />;
      case 'warning': return <AlertTriangle className="text-yellow-500" />;
      case 'info':
      default: return <Info className="text-blue-500" />;
    }
  };

  const getBackgroundColor = (notificationType) => {
    switch (notificationType) {
      case 'success': return 'bg-green-50 dark:bg-green-900';
      case 'error': return 'bg-red-50 dark:bg-red-900';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900';
      case 'info':
      default: return 'bg-blue-50 dark:bg-blue-900';
    }
  };
  
  const getTextColor = (notificationType) => {
    switch (notificationType) {
      case 'success': return 'text-green-800 dark:text-green-200';
      case 'error': return 'text-red-800 dark:text-red-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
      default: return 'text-blue-800 dark:text-blue-200';
    }
  };


  return (
    <div className={`relative flex items-center gap-3 p-4 pr-10 rounded-lg shadow-md ${getBackgroundColor(type)} ${getTextColor(type)}`}>
      <div className="flex-shrink-0">
        {getIcon(type)}
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={() => onDismiss(id)} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <X size={16} />
      </button>
    </div>
  );
};
