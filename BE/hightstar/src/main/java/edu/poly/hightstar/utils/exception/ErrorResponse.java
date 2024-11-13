package edu.poly.hightstar.utils.exception;

public class ErrorResponse {
    private String message; // thông báo
    private int errorCode; // Mã lỗi

    public ErrorResponse(String message, int errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

    // Getters và Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }
}
