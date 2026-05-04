import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { getNotifications } from '../services/notificationService';
import { filterByPriority } from '../services/priorityFilter';
import { logger } from '../logging_middleware/logger';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      logger.info('Fetching notifications from API', 'frontend', 'notificationService');
      const data = await getNotifications();
      logger.info(`Successfully fetched ${data.length} notifications`, 'frontend', 'notificationService');
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      logger.error(`Failed to fetch notifications: ${error.message}`, 'frontend', 'notificationService');
      setLoading(false);
    }
  };

  const prioritizedNotifications = filterByPriority(notifications, topN);

  const handleTopNChange = (value) => {
    setTopN(parseInt(value));
    logger.info(`Changed top N to ${value}`, 'frontend', 'notificationService');
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notification-list-container">
      <div className="controls">
        <label htmlFor="topN">Show top </label>
        <select id="topN" value={topN} onChange={(e) => handleTopNChange(e.target.value)}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <span> notifications</span>
      </div>

      <div className="notifications">
        {prioritizedNotifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          prioritizedNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}
