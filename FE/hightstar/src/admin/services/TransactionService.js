import axiosInstance from "../../services/axiosInstance"; // Đường dẫn đến axiosInstance

// Hàm gọi API để tạo mã OTP
export const generateOtp = async (transactionId) => {
  try {
    const response = await axiosInstance.post(
      "/auth/transaction/generate-otp",
      null, // Không gửi body
      {
        params: { transactionId }, // Gửi transactionId dưới dạng query parameter
      }
    );
    console.log(response.data);
    return response.data; // Trả về mã OTP nhận được từ backend
  } catch (error) {
    console.error("Lỗi khi tạo OTP", error);
    throw error; // Ném lỗi nếu có
  }
};

// Hàm gọi API để xác thực mã OTP
export const verifyOtp = async (transactionId, otp) => {
  try {
    const response = await axiosInstance.post(
      "/auth/transaction/verify-otp",
      null, // Không gửi body
      {
        params: { transactionId, otp }, // Gửi transactionId và otp dưới dạng query parameters
      }
    );
    return response.data; // Trả về kết quả xác thực từ backend
  } catch (error) {
    console.error("Lỗi khi xác thực OTP", error);
    throw error; // Ném lỗi nếu có
  }
};

// Hàm gọi API lấy lịch sử giao dịch
export const getTransactionHistory = async () => {
  try {
    const response = await axiosInstance.get("/public/transactions");
    return response.data; // Trả về lịch sử giao dịch
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử giao dịch", error);
    throw error; // Ném lỗi nếu có
  }
};
