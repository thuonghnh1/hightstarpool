package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiscountDto {
    private int id;
    private String name;
    private int percentage;
    private String startDate;
    private String endDate;
    private String description;
}