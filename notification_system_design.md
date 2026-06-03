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
# Stage 2 – Database Design

## Database Selection

For this notification platform, I would choose PostgreSQL as the primary database.

### Reasons

- Supports ACID transactions.
- Reliable for large-scale applications.
- Powerful indexing capabilities.
- Supports millions of notification records efficiently.
- Easy integration with backend services.

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Indexes

```sql
CREATE INDEX idx_user_notifications
ON notifications(user_id);

CREATE INDEX idx_user_read_status
ON notifications(user_id, is_read);

CREATE INDEX idx_notification_date
ON notifications(created_at DESC);
```

---

## Possible Scaling Problems

As the number of students and notifications increases, the following problems may occur:

### 1. Slow Queries

Fetching notifications for a user may become slower when millions of records exist.

### Solution

Use indexes on:

- user_id
- is_read
- created_at

---

### 2. Large Table Size

The notifications table may grow rapidly.

### Solution

Use table partitioning based on creation date.

Example:

- notifications_2026
- notifications_2027

This reduces scan time.

---

### 3. High Read Traffic

Many students may request notifications simultaneously.

### Solution

Use Redis caching for frequently accessed notifications and unread counts.

---

### 4. Database Bottleneck

Single database server may become overloaded.

### Solution

Use Read Replicas.

- Primary DB handles writes.
- Replica DB handles reads.

---

## SQL Queries

### Create Notification

```sql
INSERT INTO notifications
(id, user_id, type, message)
VALUES
(uuid_generate_v4(),
'user123',
'Placement',
'Microsoft hiring for SDE role');
```

---

### Get All Notifications

```sql
SELECT *
FROM notifications
WHERE user_id = 'user123'
ORDER BY created_at DESC;
```

---

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE user_id = 'user123'
AND is_read = FALSE
ORDER BY created_at DESC;
```

---

### Mark Notification As Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notification_id';
```

---

### Mark All Notifications As Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE user_id = 'user123';
```

---

### Delete Notification

```sql
DELETE FROM notifications
WHERE id = 'notification_id';
```

---

## Conclusion

PostgreSQL is a suitable choice for this notification system because it provides reliability, strong consistency, indexing support, and scalability options. As data grows, techniques such as indexing, partitioning, caching, and read replicas can be used to maintain performance.

# Stage 3 – Query Optimization and Indexing

## Analysis of the Existing Query

The existing query is:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Correct?

Yes, the query is logically correct because it fetches all unread notifications for a specific student and sorts them based on the notification creation time.

However, as the system grows to 50,000 students and 5,000,000 notifications, the query may become slow and inefficient.

---

## Why is the Query Slow?

### 1. Full Table Scan

If no suitable index exists, the database must scan a large portion of the notifications table to find matching records.

This becomes expensive when millions of notifications are stored.

### 2. Sorting Overhead

After filtering unread notifications, the database still needs to sort the results using the `createdAt` column.

Sorting large datasets increases query execution time.

### 3. Selecting All Columns

Using `SELECT *` retrieves every column from the table, even when only a few fields are needed.

This increases memory usage and network transfer time.

---

## Recommended Optimization

### Composite Index

A composite index should be created on the columns used in filtering and sorting.

```sql
CREATE INDEX idx_notifications_student_read_date
ON notifications(studentID, isRead, createdAt);
```

This allows the database to quickly locate unread notifications for a student and return them in the required order.

---

## Optimized Query

```sql
SELECT id,
       notificationType,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;
```

This query fetches only the required columns, reducing unnecessary data transfer.

---

## Should We Add Indexes on Every Column?

No.

Adding indexes on every column is not a good practice.

### Reasons

* Increased storage consumption.
* Slower INSERT operations.
* Slower UPDATE operations.
* Slower DELETE operations.
* Additional maintenance overhead.

Indexes should only be created on frequently searched, filtered, sorted, or joined columns.

---

## Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

This query returns all unique students who received a placement-related notification during the previous seven days.

---

## Additional Index Recommendation

```sql
CREATE INDEX idx_notification_type_date
ON notifications(notificationType, createdAt);
```

This index improves the performance of reporting and filtering operations based on notification type and date.

---

## Conclusion

The existing query is functionally correct but may perform poorly when the notification table contains millions of records. Creating a composite index on `(studentID, isRead, createdAt)` significantly improves query performance. Indexes should be added only where necessary because excessive indexing can negatively affect database write operations and increase storage requirements.

# Stage 4 – Performance Improvement and Reducing Database Load

## Problem Statement

Currently, notifications are fetched from the database every time a user loads a page. As the number of users increases, the database receives a large number of repeated read requests, resulting in high CPU usage, increased response times, and poor user experience.

---

## Proposed Solutions

### 1. Redis Caching

Instead of querying the database on every request, frequently accessed notifications can be stored in Redis.

#### Approach

1. User requests notifications.
2. Application checks Redis cache.
3. If data exists, return it immediately.
4. If data is not found, fetch from PostgreSQL and store it in Redis.

#### Benefits

* Significantly reduces database queries.
* Faster response times.
* Improved user experience.

#### Tradeoffs

* Additional infrastructure cost.
* Cached data may become slightly outdated until refreshed.

---

### 2. Pagination

Loading all notifications at once is inefficient.

#### Approach

Return notifications in smaller batches.

Example:

```http id="0wb6ha"
GET /api/notifications?page=1&limit=20
```

#### Benefits

* Reduced database load.
* Faster API responses.
* Lower memory consumption.

#### Tradeoffs

* Additional API calls when users navigate through pages.

---

### 3. Infinite Scrolling

Instead of loading hundreds of notifications at once, load more data only when the user scrolls.

#### Benefits

* Better user experience.
* Reduced initial page load time.

#### Tradeoffs

* Slightly more frontend complexity.

---

### 4. Real-Time Notifications using WebSockets

Currently users repeatedly fetch notifications through API requests.

Instead, use WebSockets to push notifications from the server whenever new notifications arrive.

#### Benefits

* Eliminates unnecessary polling.
* Instant notification delivery.
* Reduced database reads.

#### Tradeoffs

* More complex backend implementation.
* Requires persistent connections.

---

### 5. Read Replicas

Use separate database instances for read operations.

#### Architecture

* Primary Database → Handles Writes
* Replica Database → Handles Reads

#### Benefits

* Distributes database load.
* Improves scalability.

#### Tradeoffs

* Increased infrastructure cost.
* Small replication delay may occur.

---

### 6. Background Refresh Strategy

Instead of requesting notifications on every page load, refresh notifications periodically.

Example:

* Initial fetch on login.
* Refresh every 30–60 seconds.

#### Benefits

* Fewer database queries.
* Lower server load.

#### Tradeoffs

* Users may not see notifications immediately.

---

## Recommended Architecture

The best solution is a combination of:

1. PostgreSQL as the primary database.
2. Redis for caching notifications.
3. Pagination for large notification lists.
4. WebSockets for real-time updates.
5. Read replicas for handling heavy read traffic.

This approach minimizes database load while maintaining fast response times and an excellent user experience.

---

## Conclusion

Fetching notifications directly from the database on every page load is not scalable. By combining caching, pagination, WebSockets, read replicas, and controlled refresh mechanisms, the notification system can efficiently serve thousands of students while maintaining low latency and high performance.
# Stage 5 – Reliable and Scalable Notification Delivery

## Problems in the Current Implementation

The current implementation processes all students sequentially.

```text
for each student:
    send_email()
    save_to_db()
    push_to_app()
```

This approach has several drawbacks:

1. Very slow for 50,000 students.
2. Failure of one email can interrupt the process.
3. No retry mechanism.
4. No tracking of failed notifications.
5. Email service latency affects overall execution.
6. Difficult to scale during placement season.

If email delivery fails for 200 students, identifying and reprocessing failed records becomes difficult.

---

## Should Database Save and Email Sending Happen Together?

No.

Saving notification records and sending emails should be separated.

### Reason

Database operations are critical and must succeed first.

Email delivery depends on external services and may fail due to:

* Network issues
* SMTP downtime
* Rate limits
* Temporary provider failures

The notification should be stored even if email delivery fails.

This ensures no notification data is lost.

---

## Proposed Architecture

1. Save notification in database.
2. Publish notification event to a message queue.
3. Worker services process the queue.
4. Email service sends emails.
5. Push service sends in-app notifications.
6. Failed messages are retried automatically.

### Recommended Technologies

* PostgreSQL
* Redis / RabbitMQ / Kafka
* WebSockets
* Worker Services

---

## Revised Pseudocode

```text
function notify_all(student_ids, message):

    for student_id in student_ids:

        save_notification_to_db(student_id, message)

        publish_to_queue({
            student_id: student_id,
            message: message
        })


EmailWorker():

    while queue_not_empty:

        notification = consume_message()

        try:
            send_email(
                notification.student_id,
                notification.message
            )

        catch error:

            retry(notification)


PushWorker():

    while queue_not_empty:

        notification = consume_message()

        push_to_app(
            notification.student_id,
            notification.message
        )
```

---

## Handling Failed Emails

If email delivery fails:

1. Log the failure.
2. Retry automatically.
3. Move permanently failed messages to a Dead Letter Queue (DLQ).
4. Allow administrators to reprocess failed messages later.

This guarantees that no notifications are lost.

---

## Benefits of the New Design

* Faster processing.
* Better fault tolerance.
* Supports 50,000+ students.
* Easy horizontal scaling.
* Automatic retries.
* Improved reliability.
* Better user experience.

---

## Conclusion

The original design is not suitable for large-scale notification delivery. A queue-based asynchronous architecture provides reliability, fault tolerance, and scalability. Notifications should be saved to the database first, while email and push delivery should be handled independently by worker services with retry support.

# Stage 6 – Priority Inbox

## Problem Statement

The product team wants a Priority Inbox that displays the most important unread notifications first.

Priority is determined using:

- Notification Type Weight
- Recency

Weight Assignment:

- Placement = 3
- Result = 2
- Event = 1

Notifications are sorted first by weight and then by timestamp in descending order.

The top 10 unread notifications are displayed in the Priority Inbox.

---

## Approach

Each notification receives a priority score.

Priority Rules:

1. Placement notifications have highest priority.
2. Result notifications have medium priority.
3. Event notifications have lowest priority.
4. Newer notifications are ranked above older notifications.

---

## Maintaining Top 10 Efficiently

If notifications continuously arrive, sorting all notifications every time is inefficient.

To optimize performance, a Min Heap (Priority Queue) of size 10 can be maintained.

Process:

1. Calculate priority score.
2. Compare with minimum element in heap.
3. Replace if new notification has higher priority.
4. Keep heap size fixed at 10.

Complexity:

- Insert = O(log 10)
- Delete = O(log 10)

This approach remains efficient even for millions of notifications.

---

## Conclusion

The Priority Inbox improves user experience by ensuring that important notifications such as placement opportunities are always visible first. Using a fixed-size heap allows the system to scale efficiently while maintaining fast access to the most relevant notifications.