import axiosInstance from "../../services/axiosInstance";

const API_URL = "/public/products"; // URL thực tế của bạn

const getProducts = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};
// Hàm lấy một sản phẩm theo ID
const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về sản phẩm theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm với ID: ${id}`, error);
    throw error;
  }
};

const ProductService = {
    getProducts,
    getProductById,
  };
  
  export default ProductService;