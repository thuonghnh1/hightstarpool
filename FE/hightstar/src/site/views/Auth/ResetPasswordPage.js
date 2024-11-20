import { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { resetPassword } from "../../services/AuthService"; // Thêm service cho reset mật khẩu
import logoVertical from "../../../assets/brand/logoVertical.png";
import backgroundAuth from "../../../assets/images/backgroundAuth.jpg";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.identifier;

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (!phoneNumber) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      navigate("/login");
    }
  }, [phoneNumber, navigate]);

  const validatePassword = () => {
    const newErrors = {};
    if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validatePassword()) {
      try {
        setIsLoading(true);
        const message = await resetPassword(phoneNumber, password);
        toast.success(message);
        navigate("/login");
      } catch (error) {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
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
            className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center text-white p-4"
            style={{
              background: "linear-gradient(45deg, #51A4CC, #192f6a)",
            }}
          >
            <NavLink to="/" className="text-center mb-3">
              <img src={logoVertical} className="mb-4" width={180} alt="logo" />
            </NavLink>
            <div className="text-center px-4">
              <h5 className="mb-3 text-uppercase fw-bold">Đặt lại mật khẩu</h5>
              <p className="opacity-75">
                Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật
                khẩu.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 mx-auto bg-body-secondary p-4 py-5 p-sm-5">
            <h3 className="mb-4 text-center text-uppercase fw-bold">
              Đặt lại mật khẩu
            </h3>
            <div className="mb-1">
              <label htmlFor="passwordField" className="form-label my-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="passwordField"
                placeholder="Nhập mật khẩu mới"
                className={`form-control py-2 ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.password || ""}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPasswordField" className="form-label my-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPasswordField"
                placeholder="Nhập lại mật khẩu"
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
            <button
              type="button"
              className="btn w-100 py-2 fw-bold text-white mb-2 mt-3"
              style={{
                background: "#2D5A8E",
              }}
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              Đặt lại mật khẩu
            </button>
            <p className="text-center mt-3">
              <NavLink to="/login">Quay lại đăng nhập</NavLink>
            </p>
          </div>
        </div>
      </section>
      {isLoading && (
        <div className="d-flex vh-100 position-fixed top-0 start-0 end-0 justify-content-center align-items-center wrapper-loading">
          <Spinner animation="border" variant="primary"></Spinner>
        </div>
      )}
    </>
  );
}

export default ResetPasswordPage;
