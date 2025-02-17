package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

import edu.poly.hightstar.enums.DayOfWeek;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timeslots", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "dayOfWeek", "startTime", "endTime" })
})
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
