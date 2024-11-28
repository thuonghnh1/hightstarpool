package edu.poly.hightstar.model;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO {
    @JsonProperty("id")
    private Long attendanceId;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Long studentId;
    private Long ticketId;
    private Double penaltyAmount;
}
