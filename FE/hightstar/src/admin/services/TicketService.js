import axiosInstance from "../../services/axiosInstance";
import { formatDateToDMY } from "../utils/FormatDate";

const API_URL = "/admin/tickets";

// Hàm lấy tất cả vé
const getTickets = async () => {
  const response = await axiosInstance.get(API_URL);
  const tickets = response.data;

  return tickets.map((ticket) => ({
    ...ticket,
    issueDate: formatDateToDMY(ticket.issueDate),
    expiryDate: formatDateToDMY(ticket.expiryDate),
  }));
};

// Hàm lấy một vé theo ID
const getTicketById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  const ticket = response.data;

  return {
    ...ticket,
    issueDate: formatDateToDMY(ticket.issueDate),
    expiryDate: formatDateToDMY(ticket.expiryDate),
  };
};

// Hàm thêm mới vé
const createTicket = async (ticketData) => {
  const response = await axiosInstance.post(API_URL, ticketData);
  return response.data;
};

// Hàm cập nhật vé
const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, ticketData);
  return response.data;
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
