package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Order;
import edu.poly.hightstar.domain.Review;
import edu.poly.hightstar.domain.Trainer;
import edu.poly.hightstar.enums.OrderStatus;
import edu.poly.hightstar.model.DashboardStatisticsDTO;
import edu.poly.hightstar.model.MonthlyStatisticsDTO;
import edu.poly.hightstar.model.RecentActivityDTO;
import edu.poly.hightstar.model.RevenueByYearDTO;
import edu.poly.hightstar.model.TopTrainerDTO;
import edu.poly.hightstar.repository.OrderDetailRepository;
import edu.poly.hightstar.repository.OrderRepository;
import edu.poly.hightstar.repository.ReviewRepository;
import edu.poly.hightstar.repository.StudentRepository;
import edu.poly.hightstar.repository.TicketRepository;
import edu.poly.hightstar.repository.TrainerRepository;
import edu.poly.hightstar.service.DashboardService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TicketRepository ticketRepository;
    private final TrainerRepository trainerRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public DashboardStatisticsDTO getDashboardStatistics() {
        long totalStudents = studentRepository.count();
        long totalTicketsSold = ticketRepository.count();
        int currentYear = LocalDate.now().getYear();

        // Xác định ngày bắt đầu và kết thúc của năm hiện tại với thời gian cụ thể
        LocalDateTime startOfYear = LocalDateTime.of(currentYear, Month.JANUARY, 1, 0, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(currentYear, Month.DECEMBER, 31, 23, 59, 59);

        List<Order> orders = orderRepository.findAllByOrderDateBetween(startOfYear, endOfYear);

        // Tính tổng doanh thu (chỉ tính các đơn hàng đã hoàn thành)
        double totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED) // Sử dụng Enum trực tiếp
                .mapToDouble(Order::getTotal)
                .sum();

        long totalOrders = orderRepository.count();

        return new DashboardStatisticsDTO(totalStudents, totalTicketsSold, totalRevenue, totalOrders);
    }

    @Override
    public List<MonthlyStatisticsDTO> getMonthlyStatistics(int year) {
        List<MonthlyStatisticsDTO> monthlyStats = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            Month m = Month.of(month);
            LocalDateTime start = LocalDateTime.of(year, m, 1, 0, 0, 0);
            int lastDay = m.length(java.time.Year.isLeap(year));
            LocalDateTime end = LocalDateTime.of(year, m, lastDay, 23, 59, 59);

            long studentsRegistered = studentRepository.countByUserRegisteredDateBetween(start, end);
            long ticketsSold = ticketRepository.countByIssueDateBetween(start, end);
            long productsSold = orderDetailRepository.countProductsSoldByOrderDateBetween(start, end);

            String monthLabel = "T" + month;

            monthlyStats.add(new MonthlyStatisticsDTO(monthLabel, studentsRegistered, ticketsSold, productsSold));
        }

        return monthlyStats;
    }

    @Override
    public List<RevenueByYearDTO> getRevenueByYear() {
        List<RevenueByYearDTO> revenueByYearList = new ArrayList<>();

        // Sử dụng JPQL để lấy tổng doanh thu nhóm theo năm
        List<Object[]> results = orderRepository.findTotalRevenueGroupedByYear();

        for (Object[] row : results) {
            String year = row[0].toString();
            double revenue = ((Number) row[1]).doubleValue();
            revenueByYearList.add(new RevenueByYearDTO(year, revenue));
        }

        return revenueByYearList;
    }

    @Override
    @Transactional
    public List<RecentActivityDTO> getRecentActivities(int limit) {
        List<Activity> activities = new ArrayList<>();

        // Fetch latest orders
        Pageable orderPageable = PageRequest.of(0, limit, Sort.by("orderDate").descending());
        Page<Order> latestOrdersPage = orderRepository.findAllByOrderByOrderDateDesc(orderPageable);
        List<Order> latestOrders = latestOrdersPage.getContent();
        for (Order order : latestOrders) {
            String description = String.format("Thanh toán thành công cho đơn hàng %s", order.getOrderId());
            LocalDateTime dateTime = order.getOrderDate();
            activities.add(new Activity(description, dateTime, "bi bi-credit-card-fill text-danger fs-5")); // Icon cho thanh toán
        }

        // Fetch latest reviews
        Pageable reviewPageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        Page<Review> latestReviewsPage = reviewRepository.findAllByOrderByCreatedAtDesc(reviewPageable);
        List<Review> latestReviews = latestReviewsPage.getContent();
        for (Review review : latestReviews) {
            String description = String.format("Khách hàng %s đã đánh giá %d sao: %s",
                    review.getUser().getUsername(), review.getRating(), review.getComment());
            LocalDateTime dateTime = review.getCreatedAt();
            activities.add(new Activity(description, dateTime, "fa-regular fa-thumbs-up fs-5")); // Icon cho đánh giá
        }

        // Sort activities by dateTime descending
        activities.sort((a, b) -> b.getDateTime().compareTo(a.getDateTime()));

        // Limit the list to 'limit' items
        List<RecentActivityDTO> recentActivities = new ArrayList<>();
        int count = 0;
        for (Activity activity : activities) {
            if (count >= limit)
                break;
            String formattedTime = calculateTimeAgo(activity.getDateTime());
            recentActivities.add(new RecentActivityDTO(activity.getDescription(), formattedTime, activity.getIcon()));
            count++;
        }

        return recentActivities;
    }

    @Override
    @Transactional
    public List<TopTrainerDTO> getTopTrainers(int limit) {
        List<TopTrainerDTO> topTrainers = new ArrayList<>();

        Pageable pageable = PageRequest.of(0, limit, Sort.by("rating").descending());
        Page<Trainer> trainersPage = trainerRepository.findAllByOrderByRatingDesc(pageable);
        List<Trainer> trainers = trainersPage.getContent();

        for (Trainer trainer : trainers) {
            String trainerName = trainer.getUser().getUserProfile().getFullName();
            String specialty = trainer.getSpecialty();
            int experienceYears = trainer.getExperienceYears();
            String schedule = trainer.getSchedule();
            double rating = trainer.getRating();

            topTrainers.add(new TopTrainerDTO(trainerName, specialty, experienceYears, schedule, rating));
        }

        return topTrainers;
    }

    // Helper method để tính thời gian ago
    private String calculateTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long seconds = java.time.Duration.between(dateTime, now).getSeconds();

        if (seconds < 60) {
            return seconds + " giây trước";
        } else if (seconds < 3600) {
            long minutes = seconds / 60;
            return minutes + " phút trước";
        } else if (seconds < 86400) {
            long hours = seconds / 3600;
            return hours + " giờ trước";
        } else {
            long days = seconds / 86400;
            return days + " ngày trước";
        }
    }

    // Inner class để lưu trữ hoạt động tạm thời
    private static class Activity {
        private String description;
        private LocalDateTime dateTime;
        private String icon;

        public Activity(String description, LocalDateTime dateTime, String icon) {
            this.description = description;
            this.dateTime = dateTime;
            this.icon = icon;
        }

        public String getDescription() {
            return description;
        }

        public LocalDateTime getDateTime() {
            return dateTime;
        }

        public String getIcon() {
            return icon;
        }
    }
}
