package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendances")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "ticketId", referencedColumnName = "ticketId")
    private Ticket ticket;

    private Double penaltyAmount;
}
