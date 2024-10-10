import React from "react";
import Logo from "../../assets/brand/Logo";
import { NavLink } from "react-router-dom"; // Sử dụng NavLink để có trạng thái active

const AppSidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}  p-0`}>
      <div
        className="logo d-flex justify-content-center align-items-center border-dark-subtle  border-bottom "
        style={{ height: "66px" }}
      >
        <NavLink to="/admin/dashboard">
          <Logo />
        </NavLink>
      </div>
      <ul className="menu list-unstyled overflow-auto custom-scrollbar">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
            style={{ marginTop: "12px", position: "relative"}}
          >
            <i className="me-2 bi bi-speedometer2"></i> Bảng điều khiển
          </NavLink>
        </li>
        <li className="sidebar__title text-uppercase fw-bold opacity-50">
          Quản lý
        </li>
        <li>
          <NavLink
            to="/admin/sell"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa fa-shopping-cart"></i> Bán hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin//ticket-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 bi bi-ticket-perforated"></i> Vé bơi
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/user-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 bi bi-people-fill"></i> Người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/student-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa-solid fa-people-roof"></i> Học viên
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/course-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 bi bi-journal-bookmark"></i> Khóa học
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/employee-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa-solid fa-building-user"></i> Nhân viên
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/class-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa fa-university"></i> Lớp học
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/discount-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa fa-gift"></i> Ưu đãi
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/stook-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <i className="me-2 fa fa-archive"></i> Kho hàng
          </NavLink>
        </li>
        <li className="sidebar__title text-uppercase fw-bold opacity-50">
          Tiện ích
        </li>
        <li>
          <NavLink
            to="/admin/setting-management"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
            style={{ marginBottom: "12px" }}
          >
            <i className="me-2 fa fa-cogs"></i> Cài đặt
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
