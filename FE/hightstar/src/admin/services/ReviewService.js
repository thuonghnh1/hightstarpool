import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../utils/FormatDate";

const API_URL = "/public/reviews";

const getReviews = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const reviews = response.data;
    return reviews.map((review) => ({
      ...review,
      createdAt: formatDateTimeToDMY(review.createdAt),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

const ReviewService = {
  getReviews,
};

export default ReviewService;
