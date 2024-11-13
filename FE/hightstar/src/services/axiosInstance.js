import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { refreshToken } from "../site/services/authService"; // Hàm gọi API để làm mới token

// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

let isRefreshing = false; // Cờ để xác định xem quá trình làm mới token có đang diễn ra hay không
let refreshSubscribers = []; // Mảng chứa các hàm callback cần được gọi khi token mới được cấp

// Gọi tất cả các hàm callback trong refreshSubscribers khi token mới được cấp
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken)); // Thực thi các callback với token mới
  refreshSubscribers = []; // Xóa sạch mảng sau khi tất cả callback đã được gọi
};

// Thêm một hàm callback vào danh sách các yêu cầu chờ token mới
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback); // Lưu callback để gọi khi token mới được cấp
};

// Interceptor cho request để thêm token vào headers
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage

    if (accessToken) {
      // Kiểm tra nếu accessToken đã hết hạn
      const decodedToken = jwtDecode(accessToken); // Giải mã accessToken để kiểm tra thông tin thời hạn
      const currentTime = Date.now() / 1000; // Lấy thời gian hiện tại tính bằng giây

      if (decodedToken.exp < currentTime) {
        // Nếu accessToken đã hết hạn
        if (!isRefreshing) {
          // Nếu không có quá trình làm mới accessToken nào đang diễn ra
          isRefreshing = true;
          try {
            const newAccessToken = await refreshToken(); // Gọi hàm làm mới accessToken
            localStorage.setItem("accessToken", newAccessToken); // Lưu accessToken mới vào localStorage
            isRefreshing = false; // Đặt lại cờ để cho phép làm mới tiếp theo nếu cần
            onRefreshed(newAccessToken); // Gọi tất cả các hàm callback chờ với accessToken mới
            accessToken = newAccessToken; // Cập nhật accessToken để sử dụng trong request
          } catch (error) {
            //refreshToken hết hạn
            isRefreshing = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userDetail");

            window.location.href = "/login";
            return Promise.reject(error); // Từ chối request hiện tại với lỗi
          }
        } else {
          // Nếu quá trình làm mới đang diễn ra, chờ accessToken mới
          return new Promise((resolve) => {
            addSubscriber((newAccessToken) => {
              config.headers["Authorization"] = newAccessToken;
              resolve(config); // Tiếp tục với request sau khi accessToken mới được cấp
            });
          });
        }
      }

      // Thêm accessToken hiện tại vào header Authorization
      config.headers["Authorization"] = accessToken;
    }
    return config; // Trả về config để request được tiếp tục
  },
  (error) => Promise.reject(error) // Trả về lỗi nếu xảy ra lỗi trong interceptor
);

// Interceptor cho response để xử lý các lỗi từ server
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          console.error("Lỗi ở axiosInstance:", error);
          break;
        // case 401:
        //   console.error("Lỗi ở axiosInstance:",error);
        //   // refreshToken hết hạn
        //   localStorage.removeItem("accessToken");
        //   localStorage.removeItem("refreshToken");
        //   localStorage.removeItem("userDetail");
        //   window.location.href = "/login";
        //   toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại 1!");
        //   break;
        case 403:
          console.error("Lỗi ở axiosInstance:", error);
          window.location.href = "/page403"; 
          break;
        case 404:
          console.error("Lỗi ở axiosInstance:", error);
          window.location.href = "/page404";
          break;
        case 500:
          console.error("Lỗi ở axiosInstance:", error);
          window.location.href = "/page500";
          break;
        default:
          console.error("Đã xảy ra lỗi không xác định!");
      }
    } else {
      // Xử lý lỗi không có response (lỗi mạng, lỗi máy chủ không phản hồi)
      toast.error(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
