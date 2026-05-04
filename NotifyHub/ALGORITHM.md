# Priority-Based Notification Filter Algorithm

## Overview
The notification system implements a **three-tier priority filtering algorithm** that intelligently sorts campus notifications to display the most important unread items first.

## Priority Order
Notifications are ranked by the following priority levels:
1. **RESULT** (Priority 0) - Academic results and grades
2. **EVENT** (Priority 1) - Campus events and announcements
3. **RECENCY** (Priority 2) - Sorted by most recent timestamp

## Algorithm Details

### Main Filter: `filterByPriority(notifications, topN)`
**Input:** Array of notification objects, desired count (topN)
**Output:** Array of top N notifications sorted by priority

**Steps:**
```
1. Filter: Keep only unread notifications (isRead === false)
2. Sort by:
   - Primary: notification type (result=0, event=1, recency=2)
   - Secondary: timestamp descending (newest first)
3. Slice: Return first topN items
```

**Time Complexity:** O(n log n) due to sorting
**Space Complexity:** O(n) for filtered array

### Notification Priorities
```javascript
{
  "result":  0,  // Exam results, grade releases
  "event":   1,  // Campus events, announcements
  "recency": 2   // Default - sorted by timestamp
}
```

## Example
Given 5 notifications:
- Exam Result (4/5/2026 11:40 am) → Priority 0 ✅ **1st**
- Campus Event (4/3/2026 2:00 pm) → Priority 1 ✅ **3rd**
- Exam Result (4/4/2026 10:00 am) → Priority 0 ✅ **2nd**
- Event Alert (4/5/2026 9:00 am) → Priority 1 ✅ **4th**
- Recency Notification (4/2/2026 5:00 pm) → Priority 2 ✅ **5th**

**Displayed order (top 5):** Result → Result → Event → Event → Recency

## Bonus Function: `addNotificationToTopN(topN, newNotification)`
**Purpose:** Efficiently add a new notification to existing sorted list
**Time Complexity:** O(log n) insertion with binary search
**Benefit:** Real-time notification updates without full re-sort

**Algorithm:**
1. Find insertion position using binary search
2. Insert new notification maintaining sort order
3. Remove last item if exceeding topN limit

## Implementation Benefits
- **Unread-only filtering**: Ensures users see fresh content
- **Consistent prioritization**: Results always surface before events
- **Timestamp tiebreaker**: Newest items within same priority appear first
- **Scalable**: Efficient O(n log n) even with large datasets
- **Real-time ready**: addNotificationToTopN supports dynamic updates

## File Location
- Filter logic: [src/services/priorityFilter.js](src/services/priorityFilter.js)
- Usage: [src/components/NotificationList.jsx](src/components/NotificationList.jsx)
