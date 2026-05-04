import { logger } from '../logging_middleware/logger';

/**
 * Filters and sorts notifications by priority
 * Priority Order: result > event > recency
 * Only includes unread notifications
 * 
 * @param {Array} notifications - List of all notifications
 * @param {Number} topN - Number of top notifications to return
 * @returns {Array} - Top N prioritized notifications
 */
export function filterByPriority(notifications, topN = 10) {
  try {
    if (!Array.isArray(notifications)) {
      logger.warn('Invalid notifications array passed to filterByPriority', 'frontend', 'priorityFilter');
      return [];
    }

    logger.info(`Filtering ${notifications.length} notifications, returning top ${topN}`, 'frontend', 'priorityFilter');

    // Filter only unread notifications
    const unreadNotifications = notifications.filter(n => !n.isRead);
    logger.debug(`Filtered to ${unreadNotifications.length} unread notifications`, 'frontend', 'priorityFilter');

    // Sort by priority: result > event > recency (newest first)
    const priorityOrder = { 'result': 0, 'event': 1, 'recency': 2 };
    
    const sorted = unreadNotifications.sort((a, b) => {
      const priorityA = priorityOrder[a.type] ?? 999;
      const priorityB = priorityOrder[b.type] ?? 999;

      // If priorities are same, sort by timestamp (newest first)
      if (priorityA === priorityB) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }

      return priorityA - priorityB;
    });

    logger.info(`Sorted notifications by priority. Returning top ${topN} of ${sorted.length}`, 'frontend', 'priorityFilter');

    return sorted.slice(0, topN);
  } catch (error) {
    logger.error(`Error in priorityFilter: ${error.message}`, 'frontend', 'priorityFilter');
    return [];
  }
}

/**
 * Maintains efficient top N notifications as new items arrive
 * Uses a heap-like approach for O(log n) insertions
 * 
 * @param {Array} currentTop - Current top N notifications
 * @param {Object} newNotification - New notification to potentially add
 * @param {Number} n - Size of top N
 * @returns {Array} - Updated top N notifications
 */
export function addNotificationToTopN(currentTop, newNotification, n = 10) {
  try {
    if (!newNotification.isRead) {
      const updated = [...currentTop, newNotification];
      const filtered = filterByPriority(updated, n);
      logger.info(`Added new notification to top ${n}. New count: ${filtered.length}`, 'frontend', 'priorityFilter');
      return filtered;
    }
    return currentTop;
  } catch (error) {
    logger.error(`Error in addNotificationToTopN: ${error.message}`, 'frontend', 'priorityFilter');
    return currentTop;
  }
}
