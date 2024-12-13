import axiosInstance from "../../services/axiosInstance";

const API_URL = "/admin/products"; // URL thực tế của bạn

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

const createProduct = async (productData, file) => {
  const formData = new FormData();
  formData.append("product", JSON.stringify(productData));
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới khóa học:", error);
    throw error;
  }
};

// Hàm cập nhật khóa học
const updateProduct = async (id, productData, file) => {
  const formData = new FormData();
  formData.append("product", JSON.stringify(productData));
  if (file) {
    formData.append("file", file);
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật khóa học với ID: ${id}`, error);
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