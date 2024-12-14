package edu.poly.hightstar.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyStatisticsDTO {
    private String month;
    private long studentsRegistered;
    private long ticketsSold;
    private long productsSold;
}
