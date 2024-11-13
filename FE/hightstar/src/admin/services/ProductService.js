import axiosInstance from "../../services/axiosInstance";

const API_URL = "/employee/products"; // URL thực tế của bạn

const getProducts = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

const ProductService = {
  getProducts,
};

export default ProductService;
