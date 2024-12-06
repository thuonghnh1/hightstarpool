package edu.poly.hightstar.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OTP {
    private String otpCode;
    private LocalDateTime createdAt;
    private LocalDateTime expireAt;

    public OTP(String otpCode, LocalDateTime createdAt) {
        this.otpCode = otpCode;
        this.createdAt = createdAt;
        this.expireAt = createdAt.plusMinutes(5); // OTP sẽ hết hạn sau 5 phút
    }
}
