import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/public";

// Hàm lấy tất cả khóa học
const getCourses = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/courses`);
    return response.data; // Trả về dữ liệu khóa học
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý tiếp
  }
};

// Hàm lấy một khóa học theo ID
const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm lấy tất cả huấn luyện viên
const getTrainers = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/trainers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm lấy một huấn luyện viên theo ID
const getTrainerById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/trainers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------REVIEWS-------

// Hàm thêm hoặc cập nhật đánh giá
const addOrUpdate = async (reviewData, files) => {
  const formData = new FormData();

  // Thêm dữ liệu văn bản vào FormData
  formData.append("reviewData", JSON.stringify(reviewData));

  // Nếu có hình ảnh, thêm chúng vào FormData
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("images", file); // Thêm mỗi ảnh vào FormData
    });
  }

  try {
    const response = await axiosInstance.post(
      `/user/reviews/addOrUpdate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng multipart
        },
      }
    );

    // Trả về dữ liệu từ server
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm hoặc cập nhật đánh giá:", error);
    throw error; // Ném lỗi lên trên để có thể xử lý ở nơi gọi hàm
  }
};

// Hàm lấy danh sách đánh giá theo courseId
const getReviewsByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/public/reviews/course/${courseId}`
    );
    return response.data; // Trả về danh sách đánh giá của khóa học
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá khóa học:", error);
  }
};

// Hàm lấy danh sách đánh giá theo productId
const getReviewsByProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(
      `/public/reviews/product/${productId}`
    );
    return response.data; // Trả về danh sách đánh giá của sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá sản phẩm:", error);
  }
};

// Hàm lấy danh sách đánh giá theo trainerId
const getReviewsByTrainer = async (trainerId) => {
  try {
    const response = await axiosInstance.get(
      `/public/reviews/trainer/${trainerId}`
    );
    return response.data; // Trả về danh sách đánh giá của huấn luyện viên
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá huấn luyện viên:", error);
  }
};

// -------SEND EMAIL--------

// Hàm lấy một huấn luyện viên theo ID
const sendInfoRegister = async (info) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/sendInfoRegister`,
      info
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const SiteService = {
  getCourses,
  getCourseById,
  getTrainers,
  getTrainerById,
  addOrUpdate,
  getReviewsByCourse,
  getReviewsByProduct,
  getReviewsByTrainer,
  sendInfoRegister,
};

export default SiteService;
