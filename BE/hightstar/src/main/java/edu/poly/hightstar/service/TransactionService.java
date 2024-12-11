// src/main/java/edu.poly.hightstar/service/TransactionService.java

package edu.poly.hightstar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class TransactionService {

    // Map lưu trữ mã OTP tạm thời, khóa là mã giao dịch hoặc ID người dùng
    private ConcurrentHashMap<String, String> otpMap = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> otpExpirationMap = new ConcurrentHashMap<>(); // Lưu thời gian hết hạn của
                                                                                          // mã OTP (ms)

    // Thời gian tồn tại của mã OTP (5 phút)
    private final long OTP_EXPIRATION_TIME = TimeUnit.MINUTES.toMillis(5);

    @Autowired
    private TransactionHistoryService transactionHistoryService;

    public String generateOTP(String transactionId) {
        // Tạo mã OTP ngẫu nhiên
        String otp = String.format("%06d", (int) (Math.random() * 900000) + 100000);

        // Lưu OTP vào Map
        otpMap.put(transactionId, otp);

        // Lưu thời gian hết hạn của OTP
        otpExpirationMap.put(transactionId, System.currentTimeMillis() + OTP_EXPIRATION_TIME);

        // In ra OTP đã được tạo
        System.out.println("Generated OTP for transactionId " + transactionId + ": " + otp);

        return otp;
    }

    public boolean verifyOTP(String transactionId, String otp) {
        // In ra yêu cầu xác thực
        System.out.println("Received OTP verification request for transactionId " + transactionId + " with OTP " + otp);

        // In ra danh sách mã OTP hiện tại
        printCurrentOtps();

        // Kiểm tra xem mã OTP có tồn tại không
        if (!otpMap.containsKey(transactionId)) {
            System.out.println("OTP for transactionId " + transactionId + " does not exist.");
            return false;
        }

        // Kiểm tra thời gian hết hạn của mã OTP
        long expirationTime = otpExpirationMap.get(transactionId);
        if (System.currentTimeMillis() > expirationTime) {
            // Mã OTP đã hết hạn, xóa khỏi Map
            otpMap.remove(transactionId);
            otpExpirationMap.remove(transactionId);
            System.out.println("OTP for transactionId " + transactionId + " has expired.");
            return false;
        }

        // Kiểm tra mã OTP có khớp không
        boolean isValid = otpMap.get(transactionId).equals(otp);
        if (isValid) {
            // Nếu OTP hợp lệ, xóa nó khỏi Map
            otpMap.remove(transactionId);
            otpExpirationMap.remove(transactionId);
            System.out
                    .println("OTP for transactionId " + transactionId + " is valid and has been removed from storage.");
        } else {
            System.out.println("Invalid OTP provided for transactionId " + transactionId + ".");
        }

        // Nếu OTP là hợp lệ, kiểm tra trong danh sách giao dịch từ external API
        if (isValid) {
            Object historyResponse = transactionHistoryService.getTransactionHistory();
            if (historyResponse instanceof String) {
                String responseStr = (String) historyResponse;
                System.out.println("Transaction history response: " + responseStr); // In ra phản hồi từ API
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    JsonNode rootNode = objectMapper.readTree(responseStr);
                    boolean otpFoundInHistory = false;

                    if (rootNode.has("transactionHistoryList") && rootNode.get("transactionHistoryList").isArray()) {
                        for (JsonNode node : rootNode.get("transactionHistoryList")) {
                            JsonNode descriptionNode = node.get("description");
                            if (descriptionNode != null) {
                                String description = descriptionNode.asText();
                                // Kiểm tra xem description có chứa "CUSTOMER TT<OTP>"
                                if (description.contains("TT" + otp)) {
                                    System.out.println(
                                            "OTP " + otp + " found in transaction history. Verification successful.");
                                    otpFoundInHistory = true;
                                    return true; // Giao dịch hợp lệ
                                }
                            }
                        }
                    }

                    if (!otpFoundInHistory) {
                        System.out.println("OTP " + otp + " not found in transaction history.");
                        return false;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return false;
                }
            } else {
                // historyResponse không phải là String, xem như không tìm thấy giao dịch hợp lệ
                System.out.println("History response is not a String.");
                return false;
            }
        }

        return isValid;
    }

    public void removeOTP(String transactionId) {
        otpMap.remove(transactionId);
        otpExpirationMap.remove(transactionId);
        System.out.println("OTP for transactionId " + transactionId + " has been removed manually.");
    }

    private void printCurrentOtps() {
        if (otpMap.isEmpty()) {
            System.out.println("No OTPs are currently stored.");
        } else {
            System.out.println("Current stored OTPs:");
            otpMap.forEach(
                    (transactionId, otp) -> System.out.println("Transaction ID: " + transactionId + ", OTP: " + otp));
        }
    }
}
