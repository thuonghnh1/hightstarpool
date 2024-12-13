// services/apiService.js
import CourseService from "./CourseService";
import DiscountService from "./DiscountService";
import TicketService from "./TicketService";
import ProductService from "./ProductService";
import axiosInstance from "../../services/axiosInstance";

const API_URL = "/employee/sales";

// Các hàm chuyển đổi dữ liệu
const formatProductData = (data) => {
  return data.map((item) => ({
    id: `SP${item.id}`, //thêm tiền tố SP (sanpham) cho id để nhận diện trong quá trình xử lý
    image: item.image,
    name: item.productName,
    type: item.categoryId, // Thay đổi nếu cần
    price: item.price,
  }));
};

const formatTicketData = (data) => {
  return data.map((item) => ({
    id: `VB${item.id}`,
    code: item.ticketCode,
    name:
      item.ticketType === "ONETIME_TICKET"
        ? "Vé dùng 1 lần"
        : item.ticketType === "WEEKLY_TICKET"
        ? "Vé tuần"
        : "Vé tháng",
    price: item.ticketPrice,
  }));
};

const formatCourseData = (data) => {
  return data.map((item) => ({
    id: `KH${item.id}`,
    image: item.image,
    name: item.courseName,
    type: `1 kèm ${item.maxStudents}`,
    price: item.price,
  }));
};

const formatDiscountData = (data) => {
  return data.map((item) => ({
    value: item.id,
    label: item.discountName,
    percentage: item.percentage,
  }));
};

// Các phương thức lấy dữ liệu từ API
const fetchProducts = async () => {
  try {
    const data = await ProductService.getProducts();
    return formatProductData(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const fetchTickets = async () => {
  try {
    const data = await TicketService.getTickets();
    return formatTicketData(data);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const data = await CourseService.getCourses();
    return formatCourseData(data);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const fetchDiscounts = async () => {
  try {
    const data = await DiscountService.getDiscounts();
    return formatDiscountData(data);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return [];
  }
};

const fetchActiveDiscounts = async () => {
  try {
    const data = await DiscountService.getActiveDiscounts();
    return formatDiscountData(data);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return [];
  }
};


const createInvoice = async (invoiceData) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/createInvoice`,
      invoiceData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng: " + error);
  }
};

const createInvoiceHaveCourse = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/createInvoiceHaveCourse`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng: " + error);
  }
};

const SalesService = {
  fetchProducts,
  fetchTickets,
  fetchCourses,
  fetchDiscounts,
  fetchActiveDiscounts,
  createInvoice,
  createInvoiceHaveCourse,
};

export default SalesService;
