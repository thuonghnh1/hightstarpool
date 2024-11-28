import { useState, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Image, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import avatarDefault from "../../assets/images/avatars/user.png";
import iconAddUser from "../../assets/images/icons/add-user.png";
import iconBell from "../../assets/images/icons/notification.png";
import { useTheme } from "./common/ThemeContext";
// import { toast } from "react-toastify";
import { logout } from "../../site/services/AuthService";
import { UserContext } from "../../contexts/UserContext";
const AppHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { user, updateUser } = useContext(UserContext);

  // Sử dụng state để lưu trữ danh sách thông báo
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Linh Nguyễn",
      content: "Bạn có khỏe không?",
      time: "5 phút trước",
      imgSrc: "http://127.0.0.1:5500/assets/img/jm_denis.jpg",
      status: true,
    },
    {
      id: 2,
      name: "Lê Trang",
      content: "Ok, Cảm ơn!",
      time: "12 phút trước",
      imgSrc: "http://127.0.0.1:5500/assets/img/chadengle.jpg",
      status: false,
    },
    {
      id: 3,
      name: "Quang Thắng",
      content: "Bạn đã sẵn sàng cho cuộc họp ngày mai chưa?",
      time: "12 phút trước",
      imgSrc: "http://127.0.0.1:5500/assets/img/talha.jpg",
      status: false,
    },
    {
      id: 4,
      name: "Hoài Thương",
      content: "Hi, Làm chi đó?",
      time: "17 phút trước",
      imgSrc: "http://127.0.0.1:5500/assets/img/mlane.jpg",
      status: false,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "Hồ sơ của bạn đã được cập nhật.",
      time: "1 giờ trước",
      imgSrc: iconBell,
      status: true,
    },
    {
      id: 2,
      content: "Có người dùng mới đăng ký",
      time: "2 giờ trước",
      imgSrc: iconAddUser,
      status: false,
    },
    {
      id: 3,
      content: "Máy chủ được lên lịch bảo trì vào ngày mai.",
      time: "5 giờ trước",
      imgSrc: "http://127.0.0.1:5500/assets/img/jm_denis.jpg",
      status: true,
    },
  ]);

  const unreadMessagesCount = messages.filter((msg) => msg.status).length;
  const unreadNotificationsCount = notifications.filter(
    (notif) => notif.status
  ).length;

  const markMessageAsRead = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, status: false } : msg
      )
    );
    // // Gọi API để cập nhật trạng thái trong CSDL (ví dụ)
    // updateMessageStatusAPI(id);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, status: false } : notif
      )
    );
    // // Gọi API để cập nhật trạng thái trong CSDL (ví dụ)
    // updateNotificationStatusAPI(id);
  };
  const handleLogout = async () => {
    logout();
    updateUser(null);
    navigate("/login");
  };

  return (
    <div
      className={`header navbar navbar-expand bg-body py-1 shadow-none border-dark-subtle  border-bottom ${theme === "dark" ? "dark-theme" : "light-theme"
        }`}
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
          <li className="sub__menu nav-item d-flex justify-content-center align-items-center ms-3 ">
            <Dropdown align="start">
              {/* Sử dụng 'div' thay vì mặc định để loại bỏ mũi tên */}
              <Dropdown.Toggle
                as="div"
                id="dropdownNotification"
                className="nav-link icon-badge position-relative"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {/* Icon */}
                <i className="bi bi-bell fs-5"></i>
                {unreadNotificationsCount > 0 && (
                  <span
                    className="badge rounded-pill bg-danger position-absolute"
                    style={{ top: "4px", right: "-3px" }}
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="p-0"
                style={{ width: "350px" }}
                aria-labelledby="dropdownNotification"
              >
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom small">
                  <span className="fw-bolder text-muted">Thông báo</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-decoration-none p-0"
                  >
                    Đánh dấu là đã đọc
                  </Button>
                </div>
                <div
                  className="notif-center small custom-scrollbar"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`box__item d-flex align-items-center border-bottom p-2 ${notif.status && "new"
                        }`}
                      style={{ cursor: "pointer", position: "relative" }}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <Image
                        src={notif.imgSrc}
                        alt="Profile"
                        roundedCircle
                        className="me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <span className="fw-semibold">{notif.name}</span>
                        <div
                          className="text-truncate d-block"
                          style={{ maxWidth: "200px" }}
                        >
                          {notif.content}
                        </div>
                        <span className="small">{notif.time}</span>
                      </div>
                      <span
                        className="badge bg-danger rounded-circle"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          bottom: "10px",
                          width: "10px",
                          height: "10px",
                          transform: "translateY(-50%)",
                          padding: 0,
                          display: notif.status ? "block" : "none",
                        }}
                      ></span>
                    </div>
                  ))}
                </div>
                <div>
                  <NavLink
                    to={"/message"}
                    className="text-decoration-none d-flex justify-content-between align-items-center p-2 px-3 text-muted small"
                  >
                    Xem tất cả thông báo
                    <i className="bi bi-arrow-right-short"></i>
                  </NavLink>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="sub__menu nav-item d-flex justify-content-center align-items-center mx-3 ">
            <Dropdown align="start">
              {/* Sử dụng 'div' thay vì mặc định để loại bỏ mũi tên */}
              <Dropdown.Toggle
                as="div"
                id="dropdownMessage"
                className="nav-link icon-badge position-relative"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {/* Icon envelope */}
                <i className="bi bi-envelope-open fs-5"></i>
                {unreadMessagesCount > 0 && (
                  <span
                    className="badge rounded-pill bg-primary position-absolute"
                    style={{ top: "4px", right: "-3px" }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="p-0"
                style={{ width: "350px" }}
                aria-labelledby="dropdownMessage"
              >
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom small">
                  <span className="fw-bolder text-muted">Tin nhắn</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-decoration-none p-0"
                  >
                    Đánh dấu là đã đọc
                  </Button>
                </div>
                <div
                  className="msg-center small custom-scrollbar"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`box__item d-flex align-items-center border-bottom p-2 ${msg.status && "new"
                        }`}
                      style={{ cursor: "pointer", position: "relative" }}
                      onClick={() => markMessageAsRead(msg.id)}
                    >
                      <Image
                        src={msg.imgSrc}
                        alt="Profile"
                        roundedCircle
                        className="me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <span className="fw-semibold">{msg.name}</span>
                        <div
                          className="text-truncate d-block"
                          style={{ maxWidth: "200px" }}
                        >
                          {msg.content}
                        </div>
                        <span className="small">{msg.time}</span>
                      </div>
                      <span
                        className="badge bg-danger rounded-circle"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          bottom: "10px",
                          width: "10px",
                          height: "10px",
                          transform: "translateY(-50%)",
                          padding: 0,
                          display: msg.status ? "block" : "none",
                        }}
                      ></span>
                    </div>
                  ))}
                </div>
                <div>
                  <NavLink
                    to={"/message"}
                    className="text-decoration-none d-flex justify-content-between align-items-center p-2 px-3 text-muted small"
                  >
                    Xem tất cả tin nhắn
                    <i className="bi bi-arrow-right-short"></i>
                  </NavLink>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="d-flex justify-content-center align-items-center mx-2">
            <span className="fs-2 fw-lighter opacity-25 mb-2 text-dark">|</span>
          </li>
          <li className="nav-item d-flex justify-content-center align-items-center d-none d-sm-flex">
            <button className="nav-link icon-badge" onClick={toggleTheme}>
              {theme === "light" ? (
                <i className="bi bi-brightness-high fs-5"></i>
              ) : (
                <i className="bi bi-brightness-high-fill fs-5"></i>
              )}
            </button>
          </li>
          <li className="d-flex justify-content-center align-items-center mx-2 d-none d-sm-flex">
            <span className="fs-2 fw-lighter opacity-25 mb-2 text-dark">|</span>
          </li>
          {/* <!-- User profile --> */}
          <li className="nav-item d-flex justify-content-center align-items-center ms-2 me-3">
            <Dropdown align="start">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="p-0 border-0"
                style={{ background: "none" }}
              >
                <img
                  src={user?.avatar || avatarDefault} // userData có tồn tại và userData.avatar không null thì lấy còn ng lại thì lấy mặc định
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
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppHeader;
