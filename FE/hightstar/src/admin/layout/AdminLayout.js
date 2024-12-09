import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AppSidebar, AppFooter, AppHeader } from "../components/index";
import {
  Dashboard,
  SalesManagement,
  UserManagement,
  StudentManagement,
  CourseManagement,
  TrainerManagement,
  TicketManagement,
  DiscountManagement,
  OrderManagement,
  TimeSlotManagement,
  AttendanceManagement,
  NotificationManagement,
  MyProfile,
} from "../views/index";
import "../css/style.css";
import { ThemeProvider } from "../components/common/ThemeContext";
import TicketCheck from "../views/tickets/TicketCheck";
import BackToTop from "../../common/components/BackToTop";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Quản lý trạng thái ẩn/hiện sidebar

  // Toggle sidebar khi người dùng click vào nút toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Ẩn sidebar khi màn hình nhỏ hơn 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        // 992 là kích thước dưới của lg
        setSidebarOpen(false); // Thu nhỏ thì ẩn sidebar
      } else {
        setSidebarOpen(true); // Mở rộng thì hiển thị sidebar
      }
    };

    window.addEventListener("resize", handleResize);

    // Gọi handleResize lần đầu để kiểm tra kích thước màn hình
    handleResize();

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="container__admin overflow-hidden">
        <AppSidebar className="" isSidebarOpen={isSidebarOpen} />
        <div
          className={`right__box d-flex flex-column ${
            isSidebarOpen ? "with-sidebar" : ""
          }`}
        >
          <AppHeader
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="main p-0">
            <div className="container-fluid m-0 p-0 p-md-4 d-flex flex-column">
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sales-management" element={<SalesManagement />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="my-profile" element={<MyProfile />} />
                <Route
                  path="course-management"
                  element={<CourseManagement />}
                />
                <Route
                  path="notificaton-management"
                  element={<NotificationManagement />}
                />
                <Route
                  path="trainer-management"
                  element={<TrainerManagement />}
                />
                <Route
                  path="discount-management"
                  element={<DiscountManagement />}
                />
                <Route
                  path="student-management"
                  element={<StudentManagement />}
                />
                <Route
                  path="ticket/ticket-management"
                  element={<TicketManagement />}
                />
                <Route path="ticket/ticket-check" element={<TicketCheck />} />
                <Route path="order-management" element={<OrderManagement />} />
                <Route
                  path="timeSlot-management"
                  element={<TimeSlotManagement />}
                />
                <Route
                  path="attendance-management"
                  element={<AttendanceManagement />}
                />
                <Route path="*" element={<Navigate to={"/page404"} />} />
              </Routes>
              <Outlet /> {/* Để hiển thị các component con */}
            </div>
          </div>
          <AppFooter />
        </div>
        <BackToTop />
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
