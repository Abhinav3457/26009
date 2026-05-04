import React from 'react';

export default function NotificationItem({ notification }) {
  const getPriorityColor = (type) => {
    switch (type) {
      case 'result':
        return '#d32f2f';
      case 'event':
        return '#1976d2';
      case 'recency':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="notification-item" style={{ borderLeft: `4px solid ${getPriorityColor(notification.type)}` }}>
      <div className="notification-header">
        <span className="notification-type" style={{ backgroundColor: getPriorityColor(notification.type) }}>
          {notification.type.toUpperCase()}
        </span>
        <span className="notification-timestamp">{formatDate(notification.timestamp)}</span>
      </div>
      <h3 className="notification-title">{notification.title}</h3>
      <p className="notification-message">{notification.message}</p>
    </div>
  );
}
