import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/category";

// Hàm lấy tất cả danh mục
const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách danh mục
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw error;
  }
};

// Hàm lấy một danh mục theo ID
const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về danh mục theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy danh mục với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo danh mục mới
const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(API_URL, categoryData);
    return response.data; // Trả về danh mục đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới danh mục:", error);
    throw error;
  }
};

// Hàm cập nhật danh mục
const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, categoryData);
    return response.data; // Trả về danh mục đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật danh mục với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa danh mục
const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa danh mục với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};


// Export các hàm dưới dạng object
const CategoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
