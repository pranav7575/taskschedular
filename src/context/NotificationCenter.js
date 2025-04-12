'use client';
import { useEffect, useState } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../firebase/services';

export default function NotificationCenter({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifs = await getUserNotifications(userId);
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    };
    
    fetchNotifications();
    
    // Real-time updates would go here
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications(notifications.map(n => 
      n.id === notificationId ? {...n, read: true} : n
    ));
    setUnreadCount(unreadCount - 1);
  };

  return (
    <div className="notification-center">
      <div className="notification-badge">{unreadCount}</div>
      <div className="notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <p>{notification.message}</p>
            <small>{new Date(notification.createdAt?.toDate()).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}