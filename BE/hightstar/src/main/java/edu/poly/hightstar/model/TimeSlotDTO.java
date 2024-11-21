package edu.poly.hightstar.model;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.poly.hightstar.enums.DayOfWeek;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotDTO {
    @JsonProperty("id")
    private Long slotId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
