package edu.poly.hightstar.utils.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý AppException tổng quát với ErrorCode
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex, WebRequest request) {
        HttpStatus status = getStatusByErrorCode(ex.getErrorCode());
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                ex.getMessage(),
                ex.getErrorCode());
        return new ResponseEntity<>(errorResponse, status);
    }

    // Xử lý ngoại lệ không mong đợi
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
                ErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xác định HttpStatus dựa trên ErrorCode
    private HttpStatus getStatusByErrorCode(ErrorCode errorCode) {
        return switch (errorCode) {
            case INVALID_LOGIN, UNAUTHORIZED_ACCESS -> HttpStatus.UNAUTHORIZED;
            case EMAIL_ALREADY_EXISTS, PHONE_NUMBER_ALREADY_EXISTS, CONFLICT_ERROR, DUPLICATE_ENTRY -> HttpStatus.CONFLICT;
            case USER_NOT_FOUND, RESOURCE_NOT_FOUND, ORDER_NOT_FOUND, PRODUCT_NOT_FOUND, COURSE_NOT_FOUND, STUDENT_NOT_FOUND, TRAINER_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case INVALID_INPUT -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}
