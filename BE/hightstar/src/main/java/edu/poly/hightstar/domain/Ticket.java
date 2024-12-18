package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    @Column(length = 500, unique = true)
    private String ticketCode;
    @Column(name = "issue_date")
    private LocalDateTime issueDate;
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    @Enumerated(EnumType.STRING)
    private TicketType ticketType; // OneTime_ticket, Weekly_ticket ,Monthly_ticket.
    private Double ticketPrice;
    @ManyToOne
    @JoinColumn(name = "class_student_enrollment_id", nullable = true)
    private ClassStudentEnrollment classStudentEnrollment;
    @Column(length = 4096)
    private String qrCodeBase64; // Lưu mã QR dưới dạng Base64 string

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Attendance> attendances;
}
