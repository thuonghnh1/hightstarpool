package edu.poly.hightstar.model;

import edu.poly.hightstar.enums.EnrollmentStatus;
import lombok.Data;

@Data
public class StudentEnrollmentDTO {
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private Long classId;
    private String courseName;
    private EnrollmentStatus status;
}
