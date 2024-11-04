import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import AdminLayout from "./admin/layout/AdminLayout";
import SiteLayout from "./site/layout/SiteLayout";
import LoginPage from "./site/views/Auth/LoginPage";
import SignUpPage from "./site/views/Auth/SignUpPage";
import ForgotPasswordPage from "./site/views/Auth/ForgotPasswordPage";

function App() {
  return (
    <div className="app w-100" style={{ backgroundColor: "#f3f4f7" }}>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<SiteLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
