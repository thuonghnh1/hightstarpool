import axios from "axios";
import { formatDateTimeToDMY } from "../utils/FormatDate";

// Cấu hình axios với URL API chung
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/reviews", // Thay bằng URL thực tế của bạn
  // headers: { Authorization: "Bearer <your_token>" }, // Nếu cần thêm mã thông báo
});

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm lấy tất cả đánh giá
const getReviews = async () => {
  try {
    const response = await axiosInstance.get("");
    const reviews = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng phần tử
    return reviews.map((review) => ({
      ...review,
      createdAt: formatDateTimeToDMY(review.createdAt),
    }));
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách đánh giá:");
  }
};

// Hàm lấy một đánh giá theo ID
const getReviewById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    const review = response.data;

    // Chuyển đổi định dạng ngày giờ
    return {
      ...review,
      createdAt: formatDateTimeToDMY(review.createdAt),
    };
  } catch (error) {
    handleError(error, `Lỗi khi lấy đánh giá với ID: ${id}`);
  }
};

// Hàm thêm mới đánh giá
const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post("", reviewData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới đánh giá:");
  }
};

// Hàm cập nhật đánh giá
const updateReview = async (id, reviewData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, reviewData);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật đánh giá với ID: ${id}`);
  }
};

// Hàm xóa đánh giá
const deleteReview = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    handleError(error, `Lỗi khi xóa đánh giá với ID: ${id}`);
  }
};

// Gán object vào một biến trước khi export
const ReviewService = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};

export default ReviewService;
