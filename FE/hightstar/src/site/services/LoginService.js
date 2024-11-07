import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';  // Địa chỉ của backend

const headers = {
  'Content-Type': 'application/json',
};

// Đăng nhập người dùng
const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData, { headers });
    return response.data;
  } catch (error) {
    console.error('Đăng nhập thất bại:', error);
    throw error.response ? error.response.data : error.message;
  }
};

export { loginUser }; // Sử dụng export cho loginUser
