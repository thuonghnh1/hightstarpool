package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.DashboardStatisticsDTO;
import edu.poly.hightstar.model.MonthlyStatisticsDTO;
import edu.poly.hightstar.model.RecentActivityDTO;
import edu.poly.hightstar.model.RevenueByYearDTO;
import edu.poly.hightstar.model.TopTrainerDTO;

public interface DashboardService {
    DashboardStatisticsDTO getDashboardStatistics();

    List<MonthlyStatisticsDTO> getMonthlyStatistics(int year);

    List<RevenueByYearDTO> getRevenueByYear();

    List<RecentActivityDTO> getRecentActivities(int limit);

    List<TopTrainerDTO> getTopTrainers(int limit);
}
