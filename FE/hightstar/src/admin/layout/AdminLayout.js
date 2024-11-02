import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AppSidebar, AppFooter, AppHeader } from "../components/index";
import {
  Dashboard,
  Page404,
  UserManagement,
  StudentManagement,
  CourseManagement,
  TicketManagement,
  DiscountManagement,
} from "../views/index";
import { Bounce, ToastContainer } from "react-toastify";

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
    <div className="container__admin overflow-hidden">
      <AppSidebar className="" isSidebarOpen={isSidebarOpen} />
      <div
        className={`right__box d-flex flex-column ${isSidebarOpen ? "with-sidebar" : ""
          }`}
      >
        <AppHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="main p-0">
          <div className="container-fluid m-0 p-0 p-md-4">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="user-management"
                element={<UserManagement />}
              />
              <Route
                path="course-management"
                element={<CourseManagement />}
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
                path="ticket-management"
                element={<TicketManagement />}
              />
              <Route path="*" element={<Page404 />} />
            </Routes>
            <Outlet /> {/* Để hiển thị các component con */}
          </div>
        </div>
        <AppFooter />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default AdminLayout;
