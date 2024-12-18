package edu.poly.hightstar.domain;

import edu.poly.hightstar.enums.EnrollmentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "class_student_enrollments")
public class ClassStudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classStudentEnrollmentId;

    @ManyToOne
    @JoinColumn(name = "classId", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.IN_PROGRESS;
}
