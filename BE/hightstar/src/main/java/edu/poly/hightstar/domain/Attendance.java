package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendances")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    private LocalDateTime checkInTime;
    private Date checkOutTime;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "ticketId", referencedColumnName = "ticketId")
    private Ticket ticket;

    private double PenaltyAmount;
}
