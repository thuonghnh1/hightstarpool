import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../utils/FormatDate";

const API_URL = "/admin/tickets";

// Hàm lấy tất cả vé và kiểm tra trạng thái
const getTickets = async () => {
  const response = await axiosInstance.get(API_URL);
  const tickets = response.data;

  return tickets.map((ticket) => {
    const expiryDate = new Date(ticket.expiryDate); // Chuyển expiryDate về đối tượng Date
    const currentDate = new Date(); // Lấy ngày giờ hiện tại

    // So sánh ngày hết hạn và cập nhật trạng thái
    const status =
      expiryDate < currentDate ? "EXPIRED" : ticket.ticketIsUsed ? "USED" : "ACTIVE";

    return {
      ...ticket,
      issueDate: formatDateTimeToDMY(ticket.issueDate),
      expiryDate: formatDateTimeToDMY(ticket.expiryDate),
      status, // Thêm trạng thái vào đối tượng vé
    };
  });
};

// Hàm lấy một vé theo ID
const getTicketById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  const ticket = response.data;

  return {
    ...ticket,
    issueDate: formatDateTimeToDMY(ticket.issueDate),
    expiryDate: formatDateTimeToDMY(ticket.expiryDate),
  };
};

// Hàm thêm mới vé
const createTicket = async (ticketData) => {
  const response = await axiosInstance.post(API_URL, ticketData);
  const ticket = response.data;
  const expiryDate = new Date(ticket.expiryDate); // Chuyển expiryDate về đối tượng Date
  const currentDate = new Date(); // Lấy ngày giờ hiện tại

  // So sánh ngày hết hạn và cập nhật trạng thái
  const status = expiryDate < currentDate ? "EXPIRED" : "ACTIVE";
  return { ...ticket, status };
};

// Hàm cập nhật vé
const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, ticketData);
  const ticket = response.data;
  const expiryDate = new Date(ticket.expiryDate); // Chuyển expiryDate về đối tượng Date
  const currentDate = new Date(); // Lấy ngày giờ hiện tại

  // So sánh ngày hết hạn và cập nhật trạng thái
  const status = expiryDate < currentDate ? "EXPIRED" : "ACTIVE";
  return { ...ticket, status };
};

// Hàm xóa giảm giá
const deleteTicket = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

const TicketService = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};

export default TicketService;
