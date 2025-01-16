package edu.poly.hightstar.model;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class SessionAttendanceDTO {
    private Long sessionId;
    private LocalDate sessionDate;
    private Boolean present;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
}
