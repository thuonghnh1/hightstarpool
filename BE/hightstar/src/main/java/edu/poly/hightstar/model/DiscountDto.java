package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountDTO {
    @JsonProperty("id") // cấu hình thuộc tính giống với trong file json.
    private Long discountId;
    private String discountName;
    private int percentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
}