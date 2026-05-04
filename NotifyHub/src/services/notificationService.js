import { logger } from '../logging_middleware/logger';
import { getAuthToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://20.207.122.201/evaluation-service';

// Mock data for development/testing
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'result',
    title: 'Semester 1 Results Released',
    message: 'Your semester results are now available in the portal',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: '2',
    type: 'event',
    title: 'Campus Tech Fest 2026',
    message: 'Join us for the annual technology festival on campus',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
  },
  {
    id: '3',
    type: 'placement',
    title: 'Advanced Micro Devices Inc. Hiring',
    message: 'Placement drive registration is now open',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isRead: false,
  },
  {
    id: '4',
    type: 'result',
    title: 'Final Exam Schedule Published',
    message: 'Check the portal for your final exam dates and timings',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
  },
  {
    id: '5',
    type: 'event',
    title: 'Sports Day Registration',
    message: 'Register now for the annual sports day competitions',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isRead: false,
  },
  {
    id: '6',
    type: 'placement',
    title: 'Campus Placement Workshop',
    message: 'Resume and interview preparation workshop this Friday',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isRead: false,
  },
  {
    id: '7',
    type: 'event',
    title: 'Internship Opportunity',
    message: 'Apply for exciting internship opportunities with leading companies',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isRead: false,
  },
  {
    id: '8',
    type: 'result',
    title: 'Mid-term Assessment Results',
    message: 'Your mid-term scores have been updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isRead: false,
  },
  {
    id: '9',
    type: 'placement',
    title: 'Placement Eligibility List',
    message: 'Check eligibility list for upcoming placement drives',
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    isRead: false,
  },
  {
    id: '10',
    type: 'event',
    title: 'Workshop on Web Development',
    message: 'Free workshop on modern web development technologies',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    isRead: false,
  },
];

export async function getNotifications({ limit, page, type } = {}) {
  try {
    logger.info('Fetching notifications from API', 'frontend', 'notificationService');
    
    // Get authentication token
    const token = await getAuthToken();
    
    const queryParams = new URLSearchParams();
    if (limit) {
      queryParams.set('limit', limit);
    }
    if (page) {
      queryParams.set('page', page);
    }
    if (type && type !== 'all') {
      queryParams.set('type', type);
    }

    const queryString = queryParams.toString();
    const requestUrl = queryString
      ? `${API_BASE_URL}/notifications?${queryString}`
      : `${API_BASE_URL}/notifications`;

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });
    
    if (!response.ok) {
      logger.warn(`API returned ${response.status}, using fallback mock data`, 'frontend', 'notificationService');
      return MOCK_NOTIFICATIONS;
    }
    
    const apiResponse = await response.json();
    // API returns {notifications: [...]}, extract the array
    const notifications = apiResponse.notifications || apiResponse;
    
    // Map API response to our format and mark all as unread
    const mappedNotifications = notifications.map(notif => {
      const rawType = notif.type || notif.Type || 'event';
      const normalizedType = String(rawType).toLowerCase();

      return {
        id: notif.id || notif.ID || notif.Id,
        type: normalizedType,
        title: notif.title || notif.Title || notif.message || notif.Message || 'Notification',
        message: notif.message || notif.Message || '',
        timestamp: notif.timestamp || notif.Timestamp || new Date().toISOString(),
        isRead: false,
      };
    });
    
    logger.info(`Successfully fetched ${mappedNotifications.length} notifications from API`, 'frontend', 'notificationService');
    return mappedNotifications;
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}. Using fallback mock data.`, 'frontend', 'notificationService');
    return MOCK_NOTIFICATIONS;
  }
}

export async function markAsRead(notificationId) {
  try {
    logger.info(`Marking notification ${notificationId} as read`, 'frontend', 'notificationService');
    
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/notification/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark as read: ${response.status}`);
    }
    
    logger.info(`Successfully marked notification ${notificationId} as read`, 'frontend', 'notificationService');
  } catch (error) {
    logger.error(`Error marking notification as read: ${error.message}`, 'frontend', 'notificationService');
    throw error;
  }
}
