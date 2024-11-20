import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { sendOtp } from "../../services/authService";
import logoVertical from "../../../assets/brand/logoVertical.png";
import backgroundAuth from "../../../assets/images/backgroundAuth.jpg";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng

  const validatePhoneNumber = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không đúng định dạng.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (validatePhoneNumber()) {
      try {
        setIsLoading(true);
        // Gửi otp
        const message = await sendOtp(phoneNumber);
        toast.success(message);
        navigate("/verify-otp", { state: { identifier: phoneNumber } });
      } catch (error) {
        console.error("Lỗi handleSendOTP:", error);
        if (error.response?.data?.message) {
          setErrors({ form: error.response.data.message });
          toast.error(error.response.data.message);
        } else {
          toast.error("Đã xảy ra lỗi vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu - Hight Star</title>
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
              <h5 className="mb-3 text-uppercase fw-bold">Quên mật khẩu</h5>
              <p className="opacity-75">
                Đừng lo, hãy nhập số điện thoại của bạn để đặt lại mật khẩu.
                Chúng tôi sẽ hướng dẫn bạn các bước tiếp theo.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 mx-auto bg-body-secondary p-4 py-5 p-sm-5">
            <h3 className="mb-4 text-center text-uppercase fw-bold">
              Quên mật khẩu
            </h3>
            <div className="mb-3">
              <label htmlFor="phoneNumberField" className="form-label my-1">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumberField"
                placeholder="Nhập vào số điện thoại của bạn"
                className={`form-control py-2 ${
                  errors.phoneNumber ? "is-invalid" : ""
                }`}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="invalid-feedback">{errors.phoneNumber || ""}</div>
            </div>
            <button
              type="button"
              className="btn w-100 py-2 fw-bold text-white mb-2"
              style={{
                background: "#2D5A8E",
              }}
              onClick={handleSendOtp}
            >
              Gửi mã OTP
            </button>

            <p className="text-center mt-3">
              <NavLink to="/login">Quay lại đăng nhập</NavLink>
            </p>
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

export default ForgotPasswordPage;
