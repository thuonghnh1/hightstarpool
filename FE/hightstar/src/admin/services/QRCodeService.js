// src/services/QRCodeService.js

import axiosInstance from "../../services/axiosInstance";

const API_URL = "/employee/qr";

// Hàm xác thực QR Code
const validateQRCode = async (qrCodeBase64) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/validate`, {
            qrCodeBase64
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xác thực QR Code:", error);
        throw error;
    }
};

const QRCodeService = {
    validateQRCode,
};

export default QRCodeService;
