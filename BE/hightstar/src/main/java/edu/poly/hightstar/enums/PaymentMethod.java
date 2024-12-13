package edu.poly.hightstar.enums;

public enum PaymentMethod {
    CASH, // Thanh toán bằng tiền mặt
    CREDIT_CARD, // Thẻ tín dụng
    DEBIT_CARD, // Thẻ ghi nợ
    BANK_TRANSFER, // Chuyển khoản ngân hàng
    PAYPAL, // Thanh toán qua PayPal
    APPLE_PAY, // Thanh toán qua Apple Pay
    GOOGLE_PAY, // Thanh toán qua Google Pay
    QR_CODE, // Thanh toán bằng mã QR
    MOBILE_BANKING, // Thanh toán qua ứng dụng ngân hàng di động
    E_WALLET, // Thanh toán bằng ví điện tử (Momo, ZaloPay, v.v.)
    UNKNOWN // Phương thức thanh toán chưa xác định
}
