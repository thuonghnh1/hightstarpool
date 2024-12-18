package edu.poly.hightstar.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassStudentEnrollmentDTO {
    @JsonProperty("id")
    private Long enrollmentId;
    private Long classId;
    private String courseName;
    private Long studentId;
    private String studentName;
    private EnrollmentStatus status;
    private List<TimeSlotDTO> timeSlots;
}