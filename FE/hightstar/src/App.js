import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/layout/AdminLayout";
import SiteLayout from "./site/layout/SiteLayout";
import Login from "./site/views/Auth/Login"
import Register from "./site/views/Auth/Register"
import "./admin/css/style.css";

function App() {
  return (
    <div className="app w-100" style={{ backgroundColor: "#f3f4f7" }}>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<SiteLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
