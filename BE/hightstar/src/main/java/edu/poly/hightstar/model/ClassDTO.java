package edu.poly.hightstar.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ClassDTO {
    @JsonProperty("id")
    private Long classId;
    private Long courseId;
    private String courseName;
    private Long trainerId;
    private String trainerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxStudents;
    private int numberOfSessions;
    private String status; // Trạng thái: "Chưa Bắt Đầu", "Đang Diễn Ra", "Đã Kết Thúc"
    private int progress; // Tiến trình lớp học (%)

    private List<TimeSlotDTO> timeSlots;
}
