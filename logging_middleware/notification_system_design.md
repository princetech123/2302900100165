# Stage 1 – Notification System API Design

## Overview

The goal of this notification system is to help students receive important updates related to placements, results, and events in real time. The system should allow users to view notifications, track unread messages, and receive updates instantly without refreshing the page.

The following core functionalities are required:

- Create a notification
- View all notifications
- View a specific notification
- Mark a notification as read
- Mark all notifications as read
- Delete a notification
- Fetch only unread notifications
- Receive notifications in real time

---

## Notification Data Structure

Each notification will contain the following information:

```json
{
  "id": "uuid",
  "userId": "student_id",
  "type": "Placement",
  "message": "Microsoft hiring for SDE role",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:30Z"
}
```

---

## API Endpoints

### 1. Create Notification

This API is used whenever the system needs to send a new notification to a student.

**Endpoint**

```http
POST /api/notifications
```

**Request Body**

```json
{
  "userId": "12345",
  "type": "Placement",
  "message": "Microsoft hiring for SDE role"
}
```

**Response**

```json
{
  "success": true,
  "notificationId": "n001"
}
```

---

### 2. Get All Notifications

This API returns all notifications belonging to a user.

**Endpoint**

```http
GET /api/notifications
```

**Response**

```json
{
  "notifications": []
}
```

---

### 3. Get Notification By ID

This API returns details of a specific notification.

**Endpoint**

```http
GET /api/notifications/{id}
```

---

### 4. Mark Notification As Read

When a student opens a notification, it should be marked as read.

**Endpoint**

```http
PATCH /api/notifications/{id}/read
```

**Response**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 5. Mark All Notifications As Read

Students may want to clear all unread notifications at once.

**Endpoint**

```http
PATCH /api/notifications/read-all
```

---

### 6. Delete Notification

Allows removal of old or unnecessary notifications.

**Endpoint**

```http
DELETE /api/notifications/{id}
```

---

### 7. Get Only Unread Notifications

This API helps display unread notification count and unread notification lists.

**Endpoint**

```http
GET /api/notifications?isRead=false
```

---

## Request Headers

All APIs will use the following headers:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Real-Time Notification Mechanism

To provide a smooth user experience, notifications should be delivered in real time using WebSockets.

### Workflow

1. User logs into the application.
2. A WebSocket connection is established between client and server.
3. Whenever a new event, result, or placement update is created, the server pushes the notification instantly.
4. The notification appears on the user's screen without refreshing the page.
5. Once viewed, the notification can be marked as read.

### Why WebSockets?

- Real-time communication
- Low latency
- No repeated polling requests
- Better scalability and user experience

---

## Conclusion

This API design provides a clean and scalable foundation for a campus notification platform. It supports notification management, unread tracking, and real-time delivery while maintaining a simple and consistent REST API structure.