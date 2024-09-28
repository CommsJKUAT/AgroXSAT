import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/@auth/login/login";
import Register from "./pages/@auth/register/register";
import Dashboard from "./pages/Dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
