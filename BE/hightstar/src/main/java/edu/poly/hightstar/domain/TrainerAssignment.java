package edu.poly.hightstar.domain;

import edu.poly.hightstar.enums.TrainerAssignmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trainer_assignments")
public class TrainerAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "trainerId", referencedColumnName = "trainerId", nullable = false)
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "slotId", referencedColumnName = "slotId", nullable = false)
    private TimeSlot timeSlot;

    @ManyToOne
    @JoinColumn(name = "courseId", referencedColumnName = "courseId", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TrainerAssignmentStatus status; // ACTIVE, COMPLETED, SWITCHED

    @Column(name = "completedSessions")
    private Integer completedSessions = 0; // Số buổi học đã hoàn thành
}
