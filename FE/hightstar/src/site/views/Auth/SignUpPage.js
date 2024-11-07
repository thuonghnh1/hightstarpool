import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoVertical from "../../../assets/brand/logoVertical.png";
import backgroundAuth from "../../../assets/images/backgroundAuth.jpg";
import iconFB from "../../../assets/images/icons/facebook.png";
import iconGG from "../../../assets/images/icons/google.png";
import iconTT from "../../../assets/images/icons/twitter.png";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) {
      newErrors.username = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(username)) {
      newErrors.username = "Số điện thoại không đúng định dạng.";
    }

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validate()) {
      console.log("Signing up with", username, email, password);
      // Thực hiện quá trình đăng ký tại đây
      // Tương tự login






      
    }
  };

  return (
    <section
      className="container-fluid p-0 min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${backgroundAuth})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="row g-0 m-3 w-100" style={{ maxWidth: "1000px" }}>
        <div
          className="col-lg-4 d-none d-lg-flex flex-column align-items-center justify-content-center text-white p-4"
          style={{
            background: "linear-gradient(45deg, #51A4CC, #192f6a)",
          }}
        >
          <NavLink to="/" className="text-center mb-3">
            <img src={logoVertical} className="mb-4" width={140} alt="logo" />
          </NavLink>
          <div className="text-center px-4">
            <h5 className="mb-3 text-uppercase fw-bold">
              Đăng ký tài khoản Hight Star
            </h5>
            <p className="opacity-75">
              Khám phá dịch vụ bơi lội chuyên nghiệp và tiện lợi với Hight Star.
              Tạo tài khoản để trải nghiệm các dịch vụ hồ bơi thông minh, đăng
              ký khóa học dễ dàng và tiện ích!
            </p>
          </div>
        </div>
        <div className="col-lg-8 col-md-10 mx-auto bg-body-secondary p-4 py-5 p-sm-5">
          <h3 className="mb-4 text-center text-uppercase fw-bold">Đăng ký</h3>
          <form>
            <div className="row">
              <div className="col-md-6 mb-1">
                <label htmlFor="usernameField" className="form-label my-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="usernameField"
                  placeholder="Nhập vào số điện thoại"
                  className={`form-control py-2 ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="invalid-feedback">{errors.username || ""}</div>
              </div>
              <div className="col-md-6 mb-1">
                <label htmlFor="emailField" className="form-label my-1">
                  Email
                </label>
                <input
                  type="email"
                  id="emailField"
                  placeholder="Nhập vào email"
                  className={`form-control py-2 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">{errors.email || ""}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-1">
                <label htmlFor="passwordField" className="form-label my-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="passwordField"
                  placeholder="Mật khẩu"
                  className={`form-control py-2 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="invalid-feedback">{errors.password || ""}</div>
              </div>
              <div className="col-md-6 mb-1">
                <label
                  htmlFor="confirmPasswordField"
                  className="form-label my-1"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPasswordField"
                  placeholder="Xác nhận mật khẩu"
                  className={`form-control py-2 ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword || ""}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn w-100 py-2 fw-bold text-white mb-2 mt-3"
              style={{ background: "#2D5A8E" }}
              onClick={handleSignUp}
            >
              Đăng ký
            </button>
            <div className="text-center mt-4">
              <div className="d-flex align-items-center justify-content-center border-top border-2">
                <p
                  className="text-muted mb-0 position-relative px-2 bg-body-secondary"
                  style={{ top: "-14px" }}
                >
                  Hoặc đăng ký với
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn p-2 mx-2 border-0 rounded-circle"
                >
                  <img src={iconFB} width={30} alt="Facebook" />
                </button>
                <button
                  type="button"
                  className="btn p-2 mx-2 border-0 rounded-circle"
                >
                  <img src={iconGG} width={30} alt="Google" />
                </button>
                <button
                  type="button"
                  className="btn p-2 mx-2 border-0 rounded-circle"
                >
                  <img src={iconTT} width={30} alt="Twitter" />
                </button>
              </div>
              <p className="mt-3">
                Đã có tài khoản? <NavLink to="/login">Đăng nhập</NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
