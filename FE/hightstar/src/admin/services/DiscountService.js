import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../utils/FormatDate";

// Cấu hình URL API chung
const API_URL = "/admin/discounts";

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm lấy tất cả giảm giá
const getDiscounts = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const discounts = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng phần tử
    return discounts.map((discount) => ({
      ...discount,
      startDate: formatDateTimeToDMY(discount.startDate),
      endDate: formatDateTimeToDMY(discount.endDate),
    }));
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách giảm giá:");
  }
};

// Hàm lấy một giảm giá theo ID
const getDiscountById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    const discount = response.data;

    // Chuyển đổi định dạng ngày giờ
    return {
      ...discount,
      startDate: formatDateTimeToDMY(discount.startDate),
      endDate: formatDateTimeToDMY(discount.endDate),
    };
  } catch (error) {
    handleError(error, `Lỗi khi lấy giảm giá với ID: ${id}`);
  }
};

// Hàm thêm mới giảm giá
const createDiscount = async (discountData) => {
  try {
    const response = await axiosInstance.post(API_URL, discountData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới giảm giá:");
  }
};

// Hàm cập nhật giảm giá
const updateDiscount = async (id, discountData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, discountData);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật giảm giá với ID: ${id}`);
  }
};

// Hàm xóa giảm giá
const deleteDiscount = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    handleError(error, `Lỗi khi xóa giảm giá với ID: ${id}`);
  }
};

// Gán object vào một biến trước khi export
const DiscountService = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};

export default DiscountService;
