import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/@auth/login/login"
import Register from "./pages/@auth/register/register"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
