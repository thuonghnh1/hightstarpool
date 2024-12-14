package edu.poly.hightstar.utils.exception;

public enum ErrorCode {
    // Lỗi xác thực (Authentication Errors)
    INVALID_LOGIN("INVALID_LOGIN"), // Đăng nhập không thành công
    UNAUTHORIZED_ACCESS("UNAUTHORIZED_ACCESS"), // Người dùng không có quyền truy cập tài nguyên

    // Lỗi tài khoản và người dùng (User and Account Errors)
    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS"), // Email đã tồn tại
    PHONE_NUMBER_ALREADY_EXISTS("PHONE_NUMBER_ALREADY_EXISTS"), // Số điện thoại đã tồn tại
    USER_NOT_FOUND("USER_NOT_FOUND"), // Không tìm thấy người dùng
    USER_PROFILE_NOT_FOUND("USER_PROFILE_NOT_FOUND"), // Không tìm thấy danh mục
    ACCOUNT_LOCKED("ACCOUNT_LOCKED"), // Tài khoản bị khóa

    // Lỗi khi truy cập tài nguyên không tồn tại (Resource Not Found Errors)
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND"), // Không tìm thấy tài nguyên
    ORDER_NOT_FOUND("ORDER_NOT_FOUND"), // Không tìm thấy đơn hàng
    PRODUCT_NOT_FOUND("PRODUCT_NOT_FOUND"), // Không tìm thấy sản phẩm
    COURSE_NOT_FOUND("COURSE_NOT_FOUND"), // Không tìm thấy khóa học
    STUDENT_NOT_FOUND("STUDENT_NOT_FOUND"), // Không tìm thấy học viên
    TRAINER_NOT_FOUND("TRAINER_NOT_FOUND"), // Không tìm thấy HLV
    DISCOUNT_NOT_FOUND("DISCOUNT_NOT_FOUND"), // Không tìm thấy Discount
    EMPLOYEE_NOT_FOUND("EMPLOYEE_NOT_FOUND"), // Không tìm thấy Nhân viên
    CATEGORY_NOT_FOUND("CATEGORY_NOT_FOUND"), // Không tìm thấy danh mục
    TICKET_NOT_FOUND("TICKET_NOT_FOUND"), // Không tìm thấy vé
    TIMESLOT_NOT_FOUND("TIMESLOT_NOT_FOUND"), // Không tìm thấy suất học
    ATTENDANCE_NOT_FOUND("ATTENDANCE_NOT_FOUND"), // không tìm thấy điểm danh
    NOTIFICATION_NOT_FOUND("NOTIFICATION_NOT_FOUND"), // không tìm thấy thông báo
    REVIEW_NOT_FOUND("REVIEW_NOT_FOUND"), // không tìm thấy đánh giá
    TICKET_PRICE_NOT_FOUND("TICKET_PRICE_NOT_FOUND"), // không tìm thấy giá vé

    TICKET_EXPIRED("TICKET_EXPIRED"), // Vé đã hết hạn

    // Lỗi do dữ liệu xung đột (Conflict Errors)
    CONFLICT_ERROR("CONFLICT_ERROR"), // Xung đột dữ liệu tổng quát
    DUPLICATE_ENTRY("DUPLICATE_ENTRY"), // Bản ghi đã tồn tại
    DUPLICATE_TIMESLOT("DUPLICATE_TIMESLOT"), // Suất học này đã tồn tại
    EMAIL_ALREADY_USED("EMAIL_ALREADY_USED"), // Email đã được sử dụng
    PHONE_ALREADY_USED("PHONE_ALREADY_USED"), // Số điện thoại đã được sử dụng
    TICKET_IN_USE("TICKET_IN_USE"), // Vé này đã tồn tại trong đơn hàng

    // Lỗi hợp lệ dữ liệu (Validation Errors)
    INVALID_INPUT("INVALID_INPUT"), // Dữ liệu đầu vào không hợp lệ
    INVALID_EMAIL_FORMAT("INVALID_EMAIL_FORMAT"), // Định dạng email không hợp lệ
    PASSWORD_TOO_WEAK("PASSWORD_TOO_WEAK"), // Mật khẩu quá yếu
    INVALID_PHONE_NUMBER("INVALID_PHONE_NUMBER"), // Số điện thoại không hợp lệ
    INVALID_ORDER_DETAILS("INVALID_ORDER_DETAILS"), // Không có sản phẩm, khóa học hoặc vé nào tồn tại
    INVALID_EMAIL("INVALID_EMAIL"), // lỗi email không hợp lệ hoặc không tồn tại.
    INVALID_OTP("INVALID_OTP"), // lỗi otp không hợp lệ hoặc đã hết hạn.
    INVALID_QR_CODE("INVALID_QR_CODE"), // Mã qr không hợp lệ
    INVALID_OPERATION("INVALID_OPERATION"), // Vé đã được quét ra (đã quét ra khỏi hồ rồi)

    // Lỗi hệ thống và máy chủ (System and Server Errors)
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR"), // Lỗi máy chủ nội bộ
    SERVICE_UNAVAILABLE("SERVICE_UNAVAILABLE"), // Dịch vụ không khả dụng
    DATABASE_ERROR("DATABASE_ERROR"), // Lỗi cơ sở dữ liệu
    TIMEOUT_ERROR("TIMEOUT_ERROR"), // Hết thời gian chờ
    EMAIL_SEND_FAILURE("EMAIL_SEND_FAILURE"), // Lỗi trong quá trình gửi email.
    EMAIL_CONFIG_ERROR("EMAIL_CONFIG_ERROR"), // Khi cấu hình email sai.

    // Lỗi khi thao tác không được phép (Operation Not Allowed)
    OPERATION_NOT_ALLOWED("OPERATION_NOT_ALLOWED"), // Thao tác không được phép
    PERMISSION_DENIED("PERMISSION_DENIED"), // Từ chối quyền truy cập
    OPERATION_FAILED("OPERATION_FAILED"), // Thao tác thất bại

    // Lỗi khi thiếu tham số (Missing Parameters Errors)
    MISSING_REQUIRED_PARAMETER("MISSING_REQUIRED_PARAMETER"), // Thiếu tham số bắt buộc trong yêu cầu
    PARAMETER_VALIDATION_FAILED("PARAMETER_VALIDATION_FAILED"), // Kiểm tra tham số không hợp lệ

    // Lỗi khi không thể xử lý dữ liệu (Data Processing Errors)
    DATA_PROCESSING_ERROR("DATA_PROCESSING_ERROR"), // Lỗi trong quá trình xử lý dữ liệu
    FILE_UPLOAD_ERROR("FILE_UPLOAD_ERROR"), // Lỗi tải lên tệp
    FILE_FORMAT_NOT_SUPPORTED("FILE_FORMAT_NOT_SUPPORTED"), // Định dạng tệp không được hỗ trợ

    // Lỗi không xác định (Unknown Errors)
    UNKNOWN_ERROR("UNKNOWN_ERROR"); // Lỗi không xác định

    private final String code;

    ErrorCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
