package edu.poly.hightstar.model;

import lombok.Data;

@Data
public class QRCodeValidationResponse {
    private boolean valid;
    private String message;
    private TicketDTO ticketDto; // Thông tin vé nếu hợp lệ
}
