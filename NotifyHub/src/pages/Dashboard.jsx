import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NotificationItem from '../components/NotificationItem';
import { getNotifications, markAsRead } from '../services/notificationService';
import { logger } from '../logging_middleware/logger';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Query parameters
  const limit = parseInt(searchParams.get('limit')) || 20;
  const page = parseInt(searchParams.get('page')) || 1;
  const typeFilter = searchParams.get('type') || 'all';
  const viewFilter = searchParams.get('view') || 'all'; // all, new, viewed

  useEffect(() => {
    fetchAllNotifications();
  }, [limit, page, typeFilter]);

  useEffect(() => {
    filterAndDisplay();
  }, [allNotifications, limit, typeFilter, viewFilter]);

  const fetchAllNotifications = async () => {
    try {
      logger.info('Fetching all notifications for dashboard', 'frontend', 'dashboard');
      const data = await getNotifications({ limit, page, type: typeFilter });
      logger.info(`Fetched ${data.length} notifications`, 'frontend', 'dashboard');
      setAllNotifications(data);
      setLoading(false);
    } catch (error) {
      logger.error(`Failed to fetch notifications: ${error.message}`, 'frontend', 'dashboard');
      setLoading(false);
    }
  };

  const filterAndDisplay = () => {
    let filtered = [...allNotifications];

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
      logger.info(`Filtered by type: ${typeFilter}`, 'frontend', 'dashboard');
    }

    // Filter by view (new/viewed)
    if (viewFilter === 'new') {
      filtered = filtered.filter(n => !n.isRead);
      logger.info('Showing new (unread) notifications', 'frontend', 'dashboard');
    } else if (viewFilter === 'viewed') {
      filtered = filtered.filter(n => n.isRead);
      logger.info('Showing viewed (read) notifications', 'frontend', 'dashboard');
    }

    // Apply limit
    filtered = filtered.slice(0, limit);
    
    setFilteredNotifications(filtered);
    logger.info(`Dashboard displaying ${filtered.length} notifications (limit: ${limit})`, 'frontend', 'dashboard');
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      logger.info(`Marking notification ${notificationId} as read`, 'frontend', 'dashboard');
      
      // Update local state
      setAllNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );

      // Call API
      await markAsRead(notificationId);
      logger.info(`Successfully marked ${notificationId} as read`, 'frontend', 'dashboard');
    } catch (error) {
      logger.error(`Failed to mark as read: ${error.message}`, 'frontend', 'dashboard');
    }
  };

  const updateQueryParam = (param, value) => {
    setSearchParams(prev => {
      if (value === 'all' || value === undefined) {
        prev.delete(param);
      } else {
        prev.set(param, value);
      }
      return prev;
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Notification Dashboard</h1>
        <p>Total notifications: {allNotifications.length}</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Show:</label>
          <select value={viewFilter} onChange={(e) => updateQueryParam('view', e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="new">New (Unread)</option>
            <option value="viewed">Viewed (Read)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={typeFilter} onChange={(e) => updateQueryParam('type', e.target.value)}>
            <option value="all">All Types</option>
            <option value="result">Result</option>
            <option value="event">Event</option>
            <option value="placement">Placement</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Limit:</label>
          <select value={limit} onChange={(e) => updateQueryParam('limit', e.target.value)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="notifications-grid">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification.id} className="notification-card-wrapper">
              <NotificationItem
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications found</p>
        )}
      </div>

      <div className="dashboard-footer">
        <p>Showing {filteredNotifications.length} notifications</p>
      </div>
    </div>
  );
}
