import NotificationCard from "../components/NotificationCard";

function Notifications() {
  const notifications = [
    {
      type: "Placement",
      message: "Microsoft Hiring",
      timestamp: "2026-06-03",
    },
    {
      type: "Result",
      message: "Mid Sem Result Published",
      timestamp: "2026-06-02",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Notifications</h2>

      {notifications.map((item, index) => (
        <NotificationCard
          key={index}
          notification={item}
        />
      ))}
    </div>
  );
}

export default Notifications;