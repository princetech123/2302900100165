import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ padding: "15px", background: "#1976d2" }}>
      <Link
        to="/"
        style={{
          color: "white",
          marginRight: "20px",
          textDecoration: "none",
        }}
      >
        Notifications
      </Link>

      <Link
        to="/priority"
        style={{
          color: "white",
          textDecoration: "none",
        }}
      >
        Priority Inbox
      </Link>
    </div>
  );
}

export default Navbar;