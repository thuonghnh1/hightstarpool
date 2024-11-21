package edu.poly.hightstar.utils.exception;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
    private int status; // mã trạng thái
    private String message;
    private String errorCode; // mã lỗi custom
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String message, ErrorCode errorCode) {
        this.status = status;
        this.message = message;
        this.errorCode = errorCode.getCode();
        this.timestamp = LocalDateTime.now();
    }

}
