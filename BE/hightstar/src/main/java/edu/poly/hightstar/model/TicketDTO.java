package edu.poly.hightstar.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.TicketStatus;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date issueDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date expiryDate;
    private TicketType ticketType;
    private TicketStatus status;
    private Double ticketPrice;
    private Long studentId;
    private String qrCodeBase64; // Trường này để gửi mã QR dưới dạng Base64
}


