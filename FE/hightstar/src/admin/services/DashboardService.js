import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/dashboard";

// Hàm lấy tất cả danh mục
const getDashboardStatistics = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê:", error);
    throw error;
  }
};

const getMonthlyStatistics = async (year) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/monthly-statistics/${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê theo tháng:", error);
    throw error;
  }
};

const getRevenueByYear = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/revenue-by-year`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo năm:", error);
    throw error;
  }
};

const getRecentActivities = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/recent-activities`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy hoạt động gần đây:", error);
    throw error;
  }
};

const getTopTrainers = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/top-trainers`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hlv có đánh giá đứng đầu:", error);
    throw error;
  }
};

const DashboardService = {
  getDashboardStatistics,
  getMonthlyStatistics,
  getRevenueByYear,
  getRecentActivities,
  getTopTrainers,
};

export default DashboardService;
