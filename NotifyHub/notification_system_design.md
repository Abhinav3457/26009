# Stage 1 - Notification System Design

## Overview
This document describes how the Priority Inbox identifies the top N unread notifications using live data from the notification API. The priority order is Placement > Result > Event, with recency (latest timestamp) used as a tiebreaker within the same priority.

## Approach
- Fetch all notifications from the live API.
- Convert API fields to a normalized format.
- Filter to unread items only.
- Sort by priority first, then by timestamp (newest first).
- Return the top N items.

## Priority Rules
1. Placement notifications have the highest priority.
2. Result notifications are second.
3. Event notifications are third.
4. If two notifications share the same priority, the newest timestamp wins.

## Pseudocode
```
function getTopNotifications(notifications, topN):
	if notifications is not a list:
		return []

	unread = filter notifications where isRead == false

	priorityOrder = {
		"placement": 0,
		"result": 1,
		"event": 2
	}

	sort unread by:
		(priorityOrder[type], timestamp desc)

	return first topN items from unread
```

## Notes
- The algorithm is efficient enough for typical list sizes and can be optimized with a heap if needed.
- Logging middleware records each major step (fetch, filter, sort) for traceability.
