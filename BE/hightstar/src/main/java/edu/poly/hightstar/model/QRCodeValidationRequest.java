package edu.poly.hightstar.model;
import lombok.Data;

@Data
public class QRCodeValidationRequest {
    private String ticketCode; // Dữ liệu QR code ở dạng Base64
}
