import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Đặt URL của backend

export const checkPhoneNumber = (phoneNumber) => {
  return axios.get(`${API_URL}/forgot-password/check-phone`, {
    params: { phoneNumber },
  });
};

export const sendOtp = (phoneNumberOrEmail) => {
  return axios.post(`${API_URL}/forgot-password/send-otp`, {
    phoneNumberOrEmail,
  });
};

export const verifyOtp = (phoneNumberOrEmail, otp) => {
  return axios.post(`${API_URL}/forgot-password/verify-otp`, {
    phoneNumberOrEmail,
    otp,
  });
};
