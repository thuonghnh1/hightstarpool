import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AppSidebar, AppFooter, AppHeader } from "../components/index";
import { Dashboard, Page404, UserManagement, CourseManagement, TicketManagement, StudentList } from "../views/index";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Quản lý trạng thái ẩn/hiện sidebar

  // Toggle sidebar khi người dùng click vào nút toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Ẩn sidebar khi màn hình nhỏ hơn 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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
    <div className="d-flex">
      <AppSidebar className="" isSidebarOpen={isSidebarOpen} />
      <div
        className={`right__box d-flex flex-column ${isSidebarOpen ? "with-sidebar" : ""
          }`}
      >
        <AppHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="main min-vh-100 flex-grow-1 ">
          <div className="px-4 py-3">
            <Routes>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route
                path="/admin/user-management"
                element={<UserManagement />}
              />
              <Route
                path="/admin/course-management"
                element={<CourseManagement />}
              />
              <Route path="*" element={<Page404 />} />
              <Route
                path="/admin/student-management"
                element={<StudentList />}
              />
              <Route
                path="/admin/ticket-management"
                element={<TicketManagement />}
              />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
