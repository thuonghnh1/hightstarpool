package edu.poly.hightstar.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "classes")
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classId;

    @ManyToOne
    @JoinColumn(name="courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name="trainerId", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private int maxStudents;

    // Số buổi học thực tế của lớp (tính sau khi tạo sessions)
    @Column(nullable = false)
    private int numberOfSessions;

    // Liên kết với ClassTimeSlot để lưu danh sách TimeSlot
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL)
    private List<ClassTimeSlot> classTimeSlots = new ArrayList<>();
}

