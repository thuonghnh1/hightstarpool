package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatisticsDTO {
    private long totalStudents;
    private long totalTicketsSold;
    private double totalRevenue;
    private long totalOrders;
}
