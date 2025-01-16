import CourseService from "./CourseService";
import DiscountService from "./DiscountService";
import ProductService from "./ProductService";
import axiosInstance from "../../services/axiosInstance";
import TicketPriceService from "./TicketPriceService";

const API_URL = "/employee/sales";

const formatTicketData = (data) => {
  return data
    .filter((item) => item.ticketType !== "STUDENT_TICKET") // Lọc bỏ vé học viên
    .map((item) => ({
      id: `VB${item.id}`,
      type: item.ticketType,
      name:
        item.ticketType === "ONETIME_TICKET"
          ? "Vé dùng 1 lần"
          : item.ticketType === "WEEKLY_TICKET"
          ? "Vé tuần"
          : item.ticketType === "MONTHLY_TICKET"
          ? "Vé tháng"
          : "",
      price: item.price,
    }));
};

// Các hàm chuyển đổi dữ liệu
const formatProductData = (data) => {
  return data.map((item) => ({
    id: `SP${item.id}`, //thêm tiền tố SP (sanpham) cho id để nhận diện trong quá trình xử lý
    image: item.image,
    name: item.productName,
    type: item.categoryName, // Thay đổi nếu cần
    stock: item.stock,
    price: item.price - item.price * item.discount,
  }));
};

const formatCourseData = (data) => {
  return data.map((item) => ({
    id: `KH${item.id}`,
    image: item.image,
    name: item.courseName,
    type: "",
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

const fetchTicketPrices = async () => {
  try {
    const data = await TicketPriceService.getTicketPrices();
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
  fetchTicketPrices,
  fetchCourses,
  fetchDiscounts,
  fetchActiveDiscounts,
  createInvoice,
  createInvoiceHaveCourse,
};

export default SalesService;
