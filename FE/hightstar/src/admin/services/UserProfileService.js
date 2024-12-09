import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY, formatDateTimeToISO } from "../utils/FormatDate";

const API_URL = "/employee/user-profiles";

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm chuyển đổi ngày tháng với xử lý null
const convertProfileDates = (profile) => ({
  ...profile,
  updatedAt: profile.updatedAt ? formatDateTimeToDMY(profile.updatedAt) : "",
});

// Hàm lấy tất cả user profile
const getUserProfiles = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const profiles = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng phần tử
    return profiles.map(convertProfileDates);
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách hồ sơ người dùng:");
  }
};

// Hàm lấy user profile theo ID
const getUserProfileById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/user/${id}`);
    const profile = response.data;

    // Chuyển đổi định dạng ngày giờ
    return convertProfileDates(profile);
  } catch (error) {
    handleError(error, `Lỗi khi lấy hồ sơ người dùng với ID: ${id}`);
  }
};

// Hàm lấy user profile theo userId
const getProfileByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
    const profile = response.data;

    // Chuyển đổi định dạng ngày giờ
    return convertProfileDates(profile);
  } catch (error) {
    handleError(error, `Lỗi khi lấy hồ sơ người dùng với userId: ${userId}`);
  }
};

// Hàm xác thực mật khẩu
const verifyPassword = async (userId, password) => {
  try {
    const response = await axiosInstance.post(`/auth/verify-password`, {
      userId,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi xác thực mật khẩu!`);
  }
};

// Hàm thay đổi mật khẩu
const changePassword = async (userId, password, newPassword) => {
  try {
    const response = await axiosInstance.post(`/auth/change-password`, {
      userId,
      password,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi đổi mật khẩu!`);
  }
};

// Hàm cập nhật user profile với avatar file
const updateUserProfile = async (id, userProfileData, avatarFile) => {
  userProfileData = {
    ...userProfileData,
    updatedAt: formatDateTimeToISO(userProfileData.updatedAt),
  };
  try {
    const formData = new FormData();
    formData.append("userProfile", JSON.stringify(userProfileData));
    if (avatarFile) {
      formData.append("file", avatarFile);
    }

    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật hồ sơ người dùng với ID: ${id}`);
  }
};

// Gán object vào một biến trước khi export
const UserProfileService = {
  getUserProfiles,
  getUserProfileById,
  getProfileByUserId,
  updateUserProfile,
  verifyPassword,
  changePassword,
};

export default UserProfileService;
