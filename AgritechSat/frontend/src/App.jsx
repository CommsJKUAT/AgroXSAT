import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/@auth/login/login";
import Register from "./pages/@auth/register/register";
import Dashboard from "./pages/Dashboard/dashboard";
import Commands from "./pages/@Dashboard/pages/commands/console";
import Telemetry from "./pages/@Dashboard/pages/telemetry/telemetry";
import Sensors from "./pages/@Dashboard/pages/sensors/sensors";
import Gallery from "./pages/@Dashboard/pages/gallery/gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/commands" element={<Commands />} />
      </Routes>
    </Router>
  );
}

export default App;
