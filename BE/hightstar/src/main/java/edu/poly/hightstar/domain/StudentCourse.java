package edu.poly.hightstar.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student_courses")
public class StudentCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentCourseId;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "courseId", referencedColumnName = "courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "trainerId", referencedColumnName = "trainerId", nullable = false)
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "slotId", referencedColumnName = "slotId", nullable = false)
    private TimeSlot timeSlot;

    @Temporal(TemporalType.DATE)
    private Date startDate;
    private Integer sessionsCompleted;
    private String status;
}
