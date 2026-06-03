import NotificationCard from "../components/NotificationCard";

function PriorityNotifications() {
  const notifications = [
    {
      type: "Placement",
      message: "Amazon Hiring",
      timestamp: "2026-06-03",
    },
    {
      type: "Placement",
      message: "Adobe Hiring",
      timestamp: "2026-06-02",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Priority Notifications</h2>

      {notifications.map((item, index) => (
        <NotificationCard
          key={index}
          notification={item}
        />
      ))}
    </div>
  );
}

export default PriorityNotifications;