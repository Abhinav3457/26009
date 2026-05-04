import React from 'react';

export default function NotificationItem({ notification, onMarkAsRead }) {
  const getPriorityColor = (type) => {
    switch (type) {
      case 'result':
        return '#d32f2f';
      case 'event':
        return '#1976d2';
      case 'placement':
        return '#f57c00';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className={`notification-item ${notification.isRead ? 'read' : 'unread'}`} style={{ borderLeft: `4px solid ${getPriorityColor(notification.type)}` }}>
      <div className="notification-header">
        <span className="notification-type" style={{ backgroundColor: getPriorityColor(notification.type) }}>
          {notification.type.toUpperCase()}
        </span>
        <span className="notification-timestamp">{formatDate(notification.timestamp)}</span>
        {!notification.isRead && <span className="new-badge">NEW</span>}
      </div>
      <h3 className="notification-title">{notification.title}</h3>
      <p className="notification-message">{notification.message}</p>
      {onMarkAsRead && !notification.isRead && (
        <button className="mark-read-btn" onClick={() => onMarkAsRead(notification.id)}>
          Mark as Read
        </button>
      )}
    </div>
  );
}
