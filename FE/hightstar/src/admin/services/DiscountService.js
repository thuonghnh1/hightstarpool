import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../utils/FormatDate";

const API_URL = "/admin/discounts";

// Hàm lấy tất cả giảm giá
const getDiscounts = async () => {
  const response = await axiosInstance.get(API_URL);
  const discounts = response.data;

  return discounts.map((discount) => ({
    ...discount,
    startDate: formatDateTimeToDMY(discount.startDate),
    endDate: formatDateTimeToDMY(discount.endDate),
  }));
};

// Hàm lấy tất cả giảm giá
const getActiveDiscounts = async () => {
  const response = await axiosInstance.get(`${API_URL}/active`);
  const discounts = response.data;

  return discounts.map((discount) => ({
    ...discount,
    startDate: formatDateTimeToDMY(discount.startDate),
    endDate: formatDateTimeToDMY(discount.endDate),
  }));
};

// Hàm lấy một giảm giá theo ID
const getDiscountById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  const discount = response.data;

  return {
    ...discount,
    startDate: formatDateTimeToDMY(discount.startDate),
    endDate: formatDateTimeToDMY(discount.endDate),
  };
};

// Hàm thêm mới giảm giá
const createDiscount = async (discountData) => {
  const response = await axiosInstance.post(API_URL, discountData);
  return response.data;
};

// Hàm cập nhật giảm giá
const updateDiscount = async (id, discountData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, discountData);
  return response.data;
};

// Hàm xóa giảm giá
const deleteDiscount = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

const DiscountService = {
  getDiscounts,
  getActiveDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};

export default DiscountService;
