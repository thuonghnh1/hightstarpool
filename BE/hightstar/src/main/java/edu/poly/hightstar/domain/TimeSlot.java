package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

import edu.poly.hightstar.enums.DayOfWeek;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timeslots")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DayOfWeek dayOfWeek;
    @Column(nullable = false)
    private LocalTime startTime;
    @Column(nullable = false)
    private LocalTime endTime;
}
