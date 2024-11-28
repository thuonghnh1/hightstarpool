package edu.poly.hightstar.domain;

import java.time.LocalDate;

import edu.poly.hightstar.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollmentId;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "courseId", referencedColumnName = "courseId", nullable = false)
    private Course course;

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate; // Sử dụng LocalDate thay vì String

    @Column(name = "endDate", nullable = false)
    private LocalDate endDate; // Sử dụng LocalDate thay vì String

    @ManyToOne
    @JoinColumn(name = "trainerId", referencedColumnName = "trainerId", nullable = false)
    private Trainer trainer;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EnrollmentStatus status; // IN_PROGRESS, COMPLETED, WITHDRAWN

    @ManyToOne
    @JoinColumn(name = "renewedEnrollmentId", referencedColumnName = "enrollmentId")
    private Enrollment renewedEnrollment; // Liên kết đến bản ghi gia hạn

    @ManyToOne
    @JoinColumn(name = "nextCourseId", referencedColumnName = "courseId")
    private Course nextCourse; // Khóa học tiếp theo
}
