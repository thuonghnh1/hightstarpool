import axiosInstance from "../../services/axiosInstance";

const API_URL = "/public/cart"; // URL API của giỏ hàng

// Hàm lấy giỏ hàng theo userId
const getCartByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}`);
    return response.data; // Trả về giỏ hàng của người dùng
  } catch (error) {
    console.error(`Lỗi khi lấy giỏ hàng với userId: ${userId}`, error);
    throw error;
  }
};

// Hàm thêm sản phẩm vào giỏ hàng
const addItemToCart = async (userId, cartItemDTO) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/${userId}/add`,
      cartItemDTO
    );
    return response.data; // Trả về giỏ hàng sau khi cập nhật
  } catch (error) {
    console.error(
      `Lỗi khi thêm sản phẩm vào giỏ hàng cho userId: ${userId}`,
      error
    );
    throw error;
  }
};

// Hàm cập nhật sản phẩm trong giỏ hàng
const updateCartItem = async (userId, cartItemDTO) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${userId}/update`,
      cartItemDTO
    );
    return response.data; // Trả về giỏ hàng sau khi cập nhật
  } catch (error) {
    console.error(
      `Lỗi khi cập nhật sản phẩm trong giỏ hàng cho userId: ${userId}`,
      error
    );
    throw error;
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
const removeItemFromCart = async (userId, cartItemId) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}/${userId}/remove/${cartItemId}`
    );
    return response.data; // Trả về giỏ hàng sau khi xóa sản phẩm
  } catch (error) {
    console.error(
      `Lỗi khi xóa sản phẩm khỏi giỏ hàng cho userId: ${userId}`,
      error
    );
    throw error;
  }
};

// Hàm xóa toàn bộ giỏ hàng
const clearCart = async (userId) => {
  try {
    await axiosInstance.delete(`${API_URL}/${userId}/clear`);
    console.log(`Đã xóa toàn bộ giỏ hàng cho userId: ${userId}`);
  } catch (error) {
    console.error(`Lỗi khi xóa toàn bộ giỏ hàng cho userId: ${userId}`, error);
    throw error;
  }
};

const CartService = {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};

export default CartService;
