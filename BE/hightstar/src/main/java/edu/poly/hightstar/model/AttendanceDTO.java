package edu.poly.hightstar.model;

import java.time.LocalTime;
import java.util.Date;

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
    private Date attendanceDate;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Long studentId;
    private Long ticketId;
    private Double penaltyAmount;
}
