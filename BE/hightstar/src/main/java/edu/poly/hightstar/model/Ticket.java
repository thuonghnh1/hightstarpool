package edu.poly.hightstar.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Data
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketCode;

    private Date issueDate;
    private Date expirationDate;
    private Float penaltyAmount;
    private Boolean status;
}
