package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;
    @Temporal(TemporalType.DATE)
    private Date issueDate;
    @Temporal(TemporalType.DATE)
    private Date expiryDate;
    @Column(length = 20)
    private String ticketType; // OneTime_ticket, Weekly_ticket ,Monthly_ticket.
    private boolean status; // Còn hiệu lực, hết hiệu lực
    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId")
    private Student student;
}
