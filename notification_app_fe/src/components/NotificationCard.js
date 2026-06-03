function NotificationCard({ notification }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
      }}
    >
      <h3>{notification.type}</h3>
      <p>{notification.message}</p>
      <small>{notification.timestamp}</small>
    </div>
  );
}

export default NotificationCard;