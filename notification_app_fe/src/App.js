import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";
import PriorityNotifications from "./pages/PriorityNotifications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Notifications />} />
        <Route path="/priority" element={<PriorityNotifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;