import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { verifyOtp, resendOtp, register } from "../../services/authService";
import logoVertical from "../../../assets/brand/logoVertical.png";
import backgroundAuth from "../../../assets/images/backgroundAuth.jpg";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function VerifyOtpPage() {
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const identifier = location.state?.identifier;
  const userData = location.state?.userData;
  const inputRefs = useRef([]);

  // Cập nhật useEffect để countdown giảm tự động
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (!identifier) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      navigate("/login");
    }

    // Đặt countdown ban đầu
    setCountdown(60);
    setIsResendEnabled(false);
  }, [identifier, navigate]);

  const handleChangeOtp = (index, value) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtpArray.every((digit) => digit !== "") && index === 5) {
      handleVerifyOtp(newOtpArray.join(""));
    }
  };

  const handlePasteOtp = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      setOtpArray(pasteData.split(""));
      handleVerifyOtp(pasteData);
    }
    e.preventDefault();
  };

  const validateOtp = (otp) => {
    const newErrors = {};
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "Mã OTP phải gồm 6 chữ số.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async (otp = otpArray.join("")) => {
    if (validateOtp(otp)) {
      try {
        setIsLoading(true);

        // Gọi API để xác thực OTP
        const message = await verifyOtp(identifier, otp);

        if (identifier.includes("@")) {
          // Nếu là đăng ký (sử dụng email), lưu thông tin người dùng vào cơ sở dữ liệu
          const message = await register(userData);
          toast.success(message);
          navigate("/login"); // Chuyển hướng đến trang đăng nhập
        } else {
          // Nếu là đặt lại mật khẩu (sử dụng số điện thoại), chuyển hướng đến trang đặt lại mật khẩu
          navigate("/reset-password", { state: { identifier } });
          toast.success(message);
        }
      } catch (error) {
        if (!error.response) {
          toast.error(
            "Không thể kết nối đến server, vui lòng kiểm tra kết nối internet!"
          );
        } else {
          toast.error(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isResendEnabled) {
      try {
        setIsLoading(true);
        const message = await resendOtp(identifier, userData);
        toast.success(message);

        // Clear các trường OTP
        setOtpArray(Array(6).fill("")); // Reset OTP inputs
        inputRefs.current[0]?.focus(); // Đặt con trỏ vào ô đầu tiên

        // Đặt lại countdown và vô hiệu hóa nút gửi lại OTP
        setCountdown(60);
        setIsResendEnabled(false);
      } catch (error) {
        toast.error("Không thể gửi lại OTP, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Xác thực - Hight Star</title>
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
              <h5 className="mb-3 text-uppercase fw-bold">Xác thực OTP</h5>
              <p className="opacity-75">
                Vui lòng nhập mã OTP được gửi đến email của bạn để tiếp tục quá
                trình xác thực.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 mx-auto bg-body-secondary p-4 py-5 p-sm-5">
            <h3 className="mb-4 text-center text-uppercase fw-bold">
              Nhập mã OTP
            </h3>
            <div
              className="d-flex justify-content-center mb-3"
              onPaste={handlePasteOtp}
            >
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className={`form-control text-center mx-1 ${
                    errors.otp ? "is-invalid" : ""
                  }`}
                  style={{ width: "40px" }}
                  value={digit}
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                />
              ))}
            </div>
            {errors.otp && (
              <div
                className="invalid-feedback text-center"
                style={{ display: "block" }}
              >
                {errors.otp}
              </div>
            )}
            <button
              type="button"
              className="btn w-100 py-2 fw-bold text-white mb-2"
              style={{
                background: "#2D5A8E",
              }}
              onClick={() => handleVerifyOtp()}
              disabled={isLoading}
            >
              Xác thực
            </button>
            <div className="text-center mt-3">
              {isResendEnabled ? (
                <button
                  className="btn btn-link p-0 text-primary fw-bold"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Gửi lại mã OTP
                </button>
              ) : (
                <span className="text-muted">
                  Gửi lại mã sau {countdown} giây
                </span>
              )}
            </div>
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

export default VerifyOtpPage;
