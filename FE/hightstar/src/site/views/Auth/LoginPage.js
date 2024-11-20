import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { login } from "../../services/AuthService"; // Import getUserDetails
import { UserContext } from "../../../contexts/UserContext";
import logoVertical from "../../../assets/brand/logoVertical.png";
import backgroundAuth from "../../../assets/images/backgroundAuth.jpg";
import iconFB from "../../../assets/images/icons/facebook.png";
import iconGG from "../../../assets/images/icons/google.png";
import iconTT from "../../../assets/images/icons/twitter.png";
import { Spinner } from "react-bootstrap";
import "../../css/auth.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext); // Lấy hàm cập nhật user từ context
  const [isLoading, setIsLoading] = useState(false);

  // useCallback giúp đảm bảo handleNavigate sẽ không thay đổi giữa các lần render trừ khi navigate thay đổi.
  const handleNavigate = useCallback(
    (role) => {
      const rolePaths = {
        ADMIN: "/admin/dashboard",
        // EMPLOYEE: "/employee/dashboard",
        // TRAINER: "/trainer/dashboard",
        USER: "/home",
      };
      navigate(rolePaths[role] || "/home");
    },
    [navigate]
  );

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập rồi thì điều hướng trở lại trang chủ theo vai trò.
    if (user) {
      handleNavigate(user.role);
    }
  }, [user, handleNavigate]);

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!username) {
      newErrors.username = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(username)) {
      newErrors.username = "Số điện thoại không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // Ngăn chặn hành vi mặc định khi form submit
    if (validate()) {
      try {
        setIsLoading(true);
        const data = await login(username, password);
        const userDetail = {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          avatar: data.avatar,
          role: data.role,
        };
        // lưu nó vào context để context lưu vào localStorage và sử dụng chung cho toàn bộ ứng dụng
        updateUser(userDetail);

        // Hiển thị thông báo đăng nhập thành công
        toast.success(
          `Xin chào ${userDetail.fullName}, bạn đã đăng nhập thành công!`
        );

        handleNavigate(userDetail.role);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.response?.data?.message) {
          setErrors({ form: error.response.data.message });
        } else {
          toast.error(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet!"
          );
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập - Hight Star</title>
      </Helmet>
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
              <h5 className="mb-3 text-uppercase fw-bold">
                Chào mừng đến với Hight Star
              </h5>
              <p className="opacity-75">
                Nơi cung cấp dịch vụ bơi lội chuyên nghiệp và hiệu quả. Chúng
                tôi mang đến trải nghiệm an toàn, tiện lợi từ quản lý lịch học,
                đăng ký khóa học đến theo dõi tiến trình. Cùng chúng tôi khám
                phá niềm vui dưới nước mỗi ngày!
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 mx-auto bg-body-secondary p-4 py-5 p-sm-5">
            <h3 className="mb-4 text-center text-uppercase fw-bold">
              Đăng nhập
            </h3>
            <form onSubmit={handleLogin}>
              {errors.form && (
                <div className="alert alert-danger py-2" role="alert">
                  {errors.form}
                </div>
              )}
              <div className="mb-1">
                <label htmlFor="usernameField" className="form-label my-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="usernameField"
                  placeholder="Nhập vào số điện thoại của bạn"
                  className={`form-control py-2 ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="invalid-feedback">{errors.username || ""}</div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="passwordField" className="form-label my-1">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwordField"
                  placeholder="Nhập vào mật khẩu của bạn"
                  className={`form-control py-2 pe-5 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="invalid-feedback">{errors.password || ""}</div>
                <button
                  type="button"
                  className="btn fs-5 position-absolute end-0 text-muted me-1"
                  style={{ right: "10px", top: "31px", border: "none" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </button>
              </div>
              <div className="row mb-3">
                <div className="col d-flex ms-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label ms-2">Nhớ mật khẩu</label>
                </div>
                <div className="col text-end p-0 me-3">
                  <NavLink to="/forgot-password">Quên mật khẩu?</NavLink>
                </div>
              </div>
              <button
                type="submit"
                className="btn w-100 py-2 fw-bold text-white mb-2"
                style={{ background: "#2D5A8E" }}
              >
                Đăng nhập
              </button>
              <div className="text-center mt-4">
                <div className="d-flex align-items-center justify-content-center border-top border-2">
                  <p
                    className="text-muted mb-0 position-relative px-2 bg-body-secondary"
                    style={{ top: "-14px" }}
                  >
                    Hoặc đăng nhập với
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
                  Bạn chưa có tài khoản?{" "}
                  <NavLink to="/register">Đăng ký</NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      {isLoading && (
        <div className="d-flex vh-100 position-fixed top-0 start-0 end-0 justify-content-center align-items-center wrapper-loading">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      )}
    </>
  );
}

export default LoginPage;
