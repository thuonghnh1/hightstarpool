import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    // Lấy access token từ header
    const accessToken =
      response.headers["authorization"] || response.headers["Authorization"];
    // Giả sử refresh token được trả về trong body
    const refreshToken = response.data.refreshToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken); // Lưu access token
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken); // Lưu refresh token
    }

    return response.data; // trả về userDetail để lưu vào localStorage
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userDetail");
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    return response.data; // Trả về dữ liệu nếu đăng ký thành công
  } catch (error) {
    //trả về thông báo lỗi từ server
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // Lấy refresh token từ localStorage hoặc nguồn lưu trữ khác
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await axios.post(
      `${API_URL}/refresh-token`,
      {},
      {
        headers: {
          Authorization: `${refreshToken}`,
        },
      }
    );

    const newAccessToken = response.data.accessToken;
    return newAccessToken; // Trả về access token mới
  } catch (error) {
    console.error("Error refreshing token", error);
    throw error;
  }
};

// Hàm gửi OTP
export const sendOtp = async (identifier, userData) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, {
      identifier,
      userData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm gửi lại OTP mới
export const resendOtp = async (identifier, userData) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, {
      identifier,
      userData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm xác thực OTP
export const verifyOtp = async (identifier, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm đặt lại mật khẩu
export const resetPassword = async (phoneNumber, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      phoneNumber,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
