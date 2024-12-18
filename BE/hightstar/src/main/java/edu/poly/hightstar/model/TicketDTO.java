package edu.poly.hightstar.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import edu.poly.hightstar.enums.TicketType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO {
    @JsonProperty("id")
    private Long ticketId;
    private String ticketCode;
    private LocalDateTime issueDate;
    private LocalDateTime expiryDate;
    private TicketType ticketType;
    @JsonProperty("price")
    private Double ticketPrice;
    private boolean ticketIsUsed;
    private Long classStudentEnrollmentId;
    private String qrCodeBase64; // Trường này để gửi mã QR dưới dạng Base64
}
