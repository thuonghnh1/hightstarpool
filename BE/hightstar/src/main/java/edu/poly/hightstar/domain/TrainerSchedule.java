package edu.poly.hightstar.domain;

import edu.poly.hightstar.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trainer_schedules")
public class TrainerSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainerScheduleId;

    @ManyToOne
    @JoinColumn(name = "trainerId", referencedColumnName = "trainerId", nullable = false)
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "slotId", referencedColumnName = "slotId", nullable = false)
    private TimeSlot timeSlot;

    @Column(name = "maxStudents")
    private Integer maxStudents; // Số lượng học viên tối đa (null khi chưa có học viên đầu tiên)

    @Column(name = "studentCount", nullable = false)
    private Integer studentCount = 0; // Số lượng học viên hiện tại trong slot

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScheduleStatus status = ScheduleStatus.AVAILABLE; // Trạng thái (Available, Full)
}
