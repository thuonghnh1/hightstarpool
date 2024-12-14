package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.DashboardStatisticsDTO;
import edu.poly.hightstar.model.MonthlyStatisticsDTO;
import edu.poly.hightstar.model.RecentActivityDTO;
import edu.poly.hightstar.model.RevenueByYearDTO;
import edu.poly.hightstar.model.TopTrainerDTO;
import edu.poly.hightstar.service.DashboardService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/statistics")
    public DashboardStatisticsDTO getDashboardStatistics() {
        return dashboardService.getDashboardStatistics();
    }

    @GetMapping("/monthly-statistics/{year}")
    public List<MonthlyStatisticsDTO> getMonthlyStatistics(@PathVariable int year) {
        return dashboardService.getMonthlyStatistics(year);
    }

    @GetMapping("/revenue-by-year")
    public List<RevenueByYearDTO> getRevenueByYear() {
        return dashboardService.getRevenueByYear();
    }

    @GetMapping("/recent-activities")
    public List<RecentActivityDTO> getRecentActivities(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getRecentActivities(limit);
    }

    @GetMapping("/top-trainers")
    public List<TopTrainerDTO> getTopTrainers(@RequestParam(defaultValue = "5") int limit) {
        return dashboardService.getTopTrainers(limit);
    }
}
