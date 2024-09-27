import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/@auth/login/login"
import Register from "./pages/@auth/register/register"
import Home from "./pages/@auth/login/home"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
