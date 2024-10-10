import Dropdown from "react-bootstrap/Dropdown";
import { NavLink } from "react-router-dom";
import avatar from "../../assets/images/avatars/1.jpg";

const AppHeader = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div
      className="header navbar navbar-expand bg-body py-1 shadow-none border-dark-subtle  border-bottom"
      style={{ height: "66px", left: isSidebarOpen ? "250px" : "0px" }}
    >
      <div className="container-fluid d-flex align-items-center px-2">
        {/* <!-- Sidebar Toggle --> */}
        <button
          className="btn__toggleSidebar border-0 bg-body mx-2"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <ul className="head__center navbar-nav me-auto d-none d-lg-flex ">
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/dashboard">
              Bảng điều khiển
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/user-management">
              Người dùng
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/settings">
              Cài đặt
            </NavLink>
          </li>
        </ul>

        {/* <!-- Notification Icons --> */}
        <ul className="head__right navbar-nav  mb-lg-0">
          <li className="nav-item d-flex justify-content-center align-items-center ms-3">
            <NavLink
              className="nav-link icon-badge position-relative"
              to="/notifications"
            >
              <i className="bi bi-bell fs-5"></i>
              <span
                className="position-absolute badge rounded-pill bg-danger d-flex justify-content-center"
                style={{ top: "4px", right: "-3px" }}
              >
                5
              </span>
            </NavLink>
          </li>
          <li className="nav-item d-flex justify-content-center align-items-center mx-3">
            <NavLink
              className="nav-link icon-badge position-relative"
              to="/messages"
            >
              <i className="bi bi-envelope-open fs-5"></i>
              <span
                className="position-absolute badge rounded-pill d-flex justify-content-center"
                style={{ top: "4px", right: "-3px", background: "#2D8CE2" }}
              >
                6
              </span>
            </NavLink>
          </li>
          <li className="d-flex justify-content-center align-items-center mx-2">
            <span className="fs-2 fw-lighter opacity-25 mb-2">|</span>
          </li>
          <li className="nav-item d-flex justify-content-center align-items-center">
            <NavLink className="nav-link icon-badge" to="/brightness-settings">
              <i className="bi bi-brightness-high fs-5"></i>
            </NavLink>
          </li>
          <li className="d-flex justify-content-center align-items-center mx-2">
            <span className="fs-2 fw-lighter opacity-25 mb-2">|</span>
          </li>
          {/* <!-- User profile --> */}
          <li className="nav-item d-flex justify-content-center align-items-center ms-2 me-1">
            <Dropdown align="start">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="p-0 border-0"
                style={{ background: "none" }}
              >
                <img
                  src={avatar}
                  alt="User"
                  className="rounded-circle"
                  width={40}
                  height={40}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/profile">
                  Thông tin cá nhân
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/settings">
                  Cài đặt
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/logout">
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppHeader;
