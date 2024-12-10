import axiosInstance from "../../services/axiosInstance";

// Cấu hình URL API chung cho giá vé
const API_URL = "/admin/ticket-prices";

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Lấy tất cả giá vé
const getTicketPrices = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giá vé:", error);
    throw error;
  }
};

// Lấy giá vé theo loại vé
const getTicketPriceByTicketType = async (ticketType) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/search-by-ticket-type`,
      {
        params: { ticketType: ticketType }, // Truyền tham số loại vé dưới dạng chuỗi
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi lấy giá vé theo loại vé: ${ticketType}`);
  }
};

// Thêm mới giá vé
const createTicketPrice = async (ticketPriceData) => {
  try {
    const response = await axiosInstance.post(API_URL, ticketPriceData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới giá vé:");
  }
};

// Cập nhật giá vé theo ID
const updateTicketPrice = async (id, ticketPriceData) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      ticketPriceData
    );
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật giá vé với ID: ${id}`);
  }
};

// Gán object vào một biến trước khi export
const TicketPriceService = {
  getTicketPrices,
  getTicketPriceByTicketType,
  createTicketPrice,
  updateTicketPrice,
};

export default TicketPriceService;
