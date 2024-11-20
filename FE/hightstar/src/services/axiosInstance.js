import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleErrorResponse from "../common/utils/ErrorHandler";
import { refreshToken } from "../site/services/authService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Interceptor cho request để thêm token vào headers
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newAccessToken = await refreshToken();
            localStorage.setItem("accessToken", newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
            accessToken = newAccessToken;
          } catch (error) {
            isRefreshing = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userDetail");
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } else {
          return new Promise((resolve) => {
            addSubscriber((newAccessToken) => {
              config.headers["Authorization"] = newAccessToken;
              resolve(config);
            });
          });
        }
      }

      config.headers["Authorization"] = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response để xử lý các lỗi từ server
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleErrorResponse(error); // Chuyển đến hàm xử lý lỗi
    return Promise.reject(error);
  }
);

export default axiosInstance;
