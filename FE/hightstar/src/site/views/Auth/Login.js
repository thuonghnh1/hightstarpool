import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "../../css/auth-style/Login.css"; // Import your custom CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email/SDT</label>
            <input
              type="email"
              placeholder="nguyendinhnghi@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label>Lưu thông tin</label>
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <div className="footer">
          <Link to="/resetpassword">Quên mật khẩu?</Link>{" "}
          {/* Điều hướng tới trang reset mật khẩu */}
          <p>
            Chưa là hội viên? <Link to="/register">Đăng ký</Link>
          </p>{" "}
          {/* Điều hướng tới trang đăng ký */}
        </div>
      </div>
    </div>
  );
};

export default Login;
