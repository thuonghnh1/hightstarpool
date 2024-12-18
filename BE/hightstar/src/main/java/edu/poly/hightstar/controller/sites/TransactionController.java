// src/main/java/edu/poly/hightstar/controller/TransactionController.java

package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    /**
     * Endpoint để tạo mã OTP cho một giao dịch.
     * 
     * @param transactionId ID của giao dịch
     * @return Mã OTP đã được sinh ra
     */
    @PostMapping("/generate-otp")
    public ResponseEntity<String> generateOtp(@RequestParam("transactionId") String transactionId) {
        String otp = transactionService.generateOTP(transactionId);
        return ResponseEntity.ok(otp);
    }

    /**
     * Endpoint để xác thực mã OTP.
     * 
     * @param transactionId ID của giao dịch
     * @param otp           Mã OTP cần xác thực
     * @return true nếu mã OTP hợp lệ, false nếu không hợp lệ
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(
            @RequestParam("transactionId") String transactionId,
            @RequestParam("otp") String otp) {
        boolean isValid = transactionService.verifyOTP(transactionId, otp);
        return ResponseEntity.ok(isValid);
    }
}
