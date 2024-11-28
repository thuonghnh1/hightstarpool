package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

import edu.poly.hightstar.enums.TicketStatus;
import edu.poly.hightstar.enums.TicketType;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;
    @Column(length = 50, unique = true)
    private String ticketCode;
    @Temporal(TemporalType.DATE)
    private Date issueDate;
    @Temporal(TemporalType.DATE)
    private Date expiryDate;
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private TicketType ticketType; // OneTime_ticket, Weekly_ticket ,Monthly_ticket.
    @Enumerated(EnumType.STRING)
    private TicketStatus status; // Còn hiệu lực, hết hiệu lực
    private Double ticketPrice;
    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId")
    private Student student;
}
