import React, { useState } from "react";

import "../../css/auth-style/Register.css";  // Ensure the corresponding CSS is included


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log(formData);
  };

  return (
    <div className="register-container">
      <div className="form-background">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Đăng Ký</h2>

          {/* First row: Username and Full Name */}
          <div className="form-row">
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Second row: Email and Password */}
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật Khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Third row: Confirm Password and Gender */}
          <div className="form-row">
            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <div className="gender-options ">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  required
                  className="radioo"
                />
                <label>Nam</label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="radioo"
                  
                 
                />
                <label>Nữ</label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                  className="radioo"
                />
                <label>Khác</label>
              </div>
            </div>
          </div>

          {/* Fourth row: Agree to terms checkbox */}
          <div className="form-group checkbox-group">
            <label >
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="mx-2"
              />
              Tôi đồng ý với điều khoản và dịch vụ của HightStar
            </label>
          </div>

          <button type="submit" className="register-btn">
            Đăng ký ngay !
          </button>
        </form>
        <p>
          Bạn đã có tài khoản ?{" "}
          <a href="/login" className="login-link">
            Đăng nhập ở đây !
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;