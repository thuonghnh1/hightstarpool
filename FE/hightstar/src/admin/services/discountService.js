import axios from "axios";
import { formatDateTimeToDMY } from "../utils/FormatDate";
// Cấu hình URL API chung
const API_URL = "http://localhost:8080/api/discounts"; // Thay bằng URL thực tế của bạn

// Hàm lấy tất cả giảm giá
const getDiscounts = async () => {
  try {
    const response = await axios.get(API_URL);
    const discounts = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng phần tử
    const formattedDiscounts = discounts.map((discount) => ({
      ...discount,
      startDate: formatDateTimeToDMY(discount.startDate), // Chuyển đổi ngày giờ bắt đầu
      endDate: formatDateTimeToDMY(discount.endDate), // Chuyển đổi ngày giờ kết thúc
    }));

    return formattedDiscounts;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giảm giá:", error);
    throw error;
  }
};

// Hàm lấy một giảm giá theo ID
const getDiscountById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const discount = response.data;

    // Chuyển đổi định dạng ngày giờ
    const formattedDiscount = {
      ...discount,
      startDate: formatDateTimeToDMY(discount.startDate), // Chuyển đổi ngày giờ bắt đầu
      endDate: formatDateTimeToDMY(discount.endDate), // Chuyển đổi ngày giờ kết thúc
    };

    return formattedDiscount;
  } catch (error) {
    console.error(`Lỗi khi lấy giảm giá với ID: ${id}`, error);
    throw error;
  }
};

// Hàm thêm mới giảm giá
const createDiscount = async (discountData) => {
  try {
    const response = await axios.post(API_URL, discountData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới giảm giá:", error);
    throw error;
  }
};

// Hàm cập nhật giảm giá
const updateDiscount = async (id, discountData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, discountData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật giảm giá với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa giảm giá
const deleteDiscount = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa giảm giá với ID: ${id}`, error);
    throw error;
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
