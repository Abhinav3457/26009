import { logger } from '../logging_middleware/logger';

const API_BASE_URL = 'http://20.207.122.201/evaluation-service';

export async function getNotifications() {
  try {
    logger.info('Making API request to fetch notifications', 'frontend', 'notificationService');
    
    const response = await fetch(`${API_BASE_URL}/notification`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    logger.info(`API returned ${data.notifications?.length || 0} notifications`, 'frontend', 'notificationService');
    
    return data.notifications || [];
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`, 'frontend', 'notificationService');
    throw error;
  }
}

export async function markAsRead(notificationId) {
  try {
    logger.info(`Marking notification ${notificationId} as read`, 'frontend', 'notificationService');
    
    const response = await fetch(`${API_BASE_URL}/notification/${notificationId}`, {
      method: 'PUT',
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
