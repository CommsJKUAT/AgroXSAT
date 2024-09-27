import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/@auth/login/login";
import Register from "./pages/@auth/register/register";
import Dashboard from "./pages/Dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
