import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';  // Địa chỉ của backend (sửa theo đường dẫn thật)

const headers = {
  'Content-Type': 'application/json',
};

// Đăng ký người dùng mới
const registerUser = async (registerData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, registerData, { headers });
    return response.data; // trả về dữ liệu phản hồi
  } catch (error) {
    console.error('Đăng ký thất bại:', error);
    throw error.response ? error.response.data : error.message;
  }
};

export {
  registerUser,
};
