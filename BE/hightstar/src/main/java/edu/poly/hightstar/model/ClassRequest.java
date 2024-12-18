package edu.poly.hightstar.model;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class ClassRequest {
    private Long courseId;
    private Long trainerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxStudents;
    private List<Long> timeSlotIds;
}
