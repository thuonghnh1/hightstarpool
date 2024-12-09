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

// Hàm tạo sản phẩm mới
const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(API_URL, productData);
    return response.data; // Trả về sản phẩm đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới sản phẩm:", error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm
const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, productData);
    return response.data; // Trả về sản phẩm đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật sản phẩm với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa sản phẩm
const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về phản hồi sau khi xóa
  } catch (error) {
    console.error(`Lỗi khi xóa sản phẩm với ID: ${id}`, error);
    throw error;
  }
};

const ProductService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default ProductService;
