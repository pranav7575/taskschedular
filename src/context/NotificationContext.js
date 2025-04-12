'use client';
import { createContext, useContext, useState } from 'react';

// Rename to avoid conflict with browser Notification API
const AppNotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    
    // If you want to use browser notifications too:
    if (typeof window !== 'undefined' && 'Notification' in window) {
      new Notification(message); // Correct usage with 'new'
    }
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <AppNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
    </AppNotificationContext.Provider>
  );
}

// Renamed hook to avoid confusion
export function useAppNotification() {
  return useContext(AppNotificationContext);
}