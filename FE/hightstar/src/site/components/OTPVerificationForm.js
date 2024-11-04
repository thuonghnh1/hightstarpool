import { useState } from "react";
import { verifyOtp } from "../services/AuthService";

function OTPVerificationForm({ phoneNumber, onVerified }) {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");

  const handleVerifyOtp = async () => {
    if (otp) {
      try {
        const response = await verifyOtp(phoneNumber, otp);
        if (response.status === 200) {
          onVerified();
        }
      } catch (error) {
        setErrors("Mã OTP không hợp lệ hoặc đã hết hạn.");
      }
    } else {
      setErrors("Vui lòng nhập mã OTP.");
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="otpField" className="form-label my-1">
          Mã OTP
        </label>
        <input
          type="text"
          id="otpField"
          placeholder="Nhập mã OTP"
          className={`form-control py-2 ${errors ? "is-invalid" : ""}`}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="invalid-feedback">{errors}</div>
      </div>
      <button
        type="button"
        className="btn w-100 py-2 fw-bold text-white mb-2"
        style={{
          background: "#2D5A8E",
        }}
        onClick={handleVerifyOtp}
      >
        Xác thực mã OTP
      </button>
    </div>
  );
}

export default OTPVerificationForm;
