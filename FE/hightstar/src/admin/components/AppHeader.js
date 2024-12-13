import { useState, useContext, useEffect, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Image, Button, ToastContainer, Toast, Modal } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import avatarDefault from "../../assets/images/avatars/user.png";
// import iconAddUser from "../../assets/images/icons/add-user.png";
import iconBell from "../../assets/images/icons/notification.png";
// import { toast } from "react-toastify";
import { logout } from "../../site/services/AuthService";
import { UserContext } from "../../contexts/UserContext";
import NotificationService from "../../site/services/NotificationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import { useTheme } from "../../contexts/ThemeContext";

// Cấu hình Day.js với plugin relativeTime và locale tiếng Việt
dayjs.extend(relativeTime);
dayjs.locale("vi"); // Cài đặt ngôn ngữ tiếng Việt

const AppHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [roleNotifications, setRoleNotifications] = useState([]);
  const [showToasts, setShowToasts] = useState([]);

  // State để quản lý modal xem chi tiết thông báo
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState({});

  // Hàm fetch thông báo
  const fetchNotification = useCallback(async () => {
    try {
      if (user) {
        const notificationsForAll =
          await await NotificationService.getNotificationsByRecipientType(
            "ALL"
          );

        const commonNotifications =
          await await NotificationService.getNotificationsByRecipientType(
            user.role
          );

        //  kết hợp 2 mảng thông báo lại
        const allNotifications = [
          ...notificationsForAll,
          ...commonNotifications,
        ];
        setNotifications(allNotifications);

        const individualNotifications =
          await NotificationService.getNotificationsByUserId(user.userId);

        const notificationsWithIcon = individualNotifications.map(
          (notification) => ({
            ...notification,
            imgSrc: iconBell,
            createdAt: dayjs(notification.createdAt).fromNow(),
          })
        );
        setRoleNotifications(notificationsWithIcon);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  }, [user]);

  useEffect(() => {
    const handleNotifications = async () => {
      await fetchNotification();

      const toasts = notifications.map((notif) => ({
        id: notif.id,
        content: notif.content,
        createdAt: dayjs(notif.createdAt).fromNow(),
      }));
      setShowToasts(toasts);
    };
    handleNotifications();

    // eslint-disable-next-line
  }, [fetchNotification, notifications.length]);

  // Xử lý đóng toast
  const handleCloseToast = (id) => {
    setShowToasts((prevToasts) => {
      const updatedToasts = prevToasts.filter((toast) => toast.id !== id);
      return updatedToasts;
    });
  };

  const unreadNotificationsCount = roleNotifications.filter(
    (notif) => notif.status
  ).length;

  const markNotificationAsRead = async (id) => {
    setRoleNotifications((prevRoleNotifications) =>
      prevRoleNotifications.map((notif) =>
        notif.id === id ? { ...notif, status: false } : notif
      )
    );
    try {
      await NotificationService.updateNotificationStatus(id, false);
    } catch (error) {}
  };

  // Hàm mở modal và đặt thông báo được chọn
  const handleShowModal = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification({});
  };

  const handleLogout = async () => {
    logout();
    updateUser(null);
    navigate("/login");
  };

  return (
    <>
      <div
        className={`header navbar navbar-expand bg-body py-1 shadow-none border-dark-subtle  border-bottom ${
          theme === "dark" ? "dark-theme" : "light-theme"
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
              <NavLink className="nav-link" to="/admin/ticket/ticket-check">
                Soát vé
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/settings">
                Cài đặt
              </NavLink>
            </li>
          </ul>

          {/* <!-- Notification Icons --> */}
          <ul className="head__right navbar-nav mb-lg-0">
            <li className="sub__menu nav-item d-flex justify-content-center align-items-center ms-3 me-3">
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
                      onClick={() => {
                        // Đánh dấu tất cả thông báo là đã đọc
                        const unreadIds = roleNotifications
                          .filter((notif) => notif.status)
                          .map((notif) => notif.id);
                        unreadIds.forEach((id) => markNotificationAsRead(id));
                      }}
                    >
                      Đánh dấu là đã đọc
                    </Button>
                  </div>
                  <div
                    className="notif-center small custom-scrollbar"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {roleNotifications.length === 0 ? (
                      <div className="p-3 text-center text-muted">
                        Không có thông báo nào.
                      </div>
                    ) : (
                      roleNotifications.map((notif, index) => (
                        <div
                          key={index}
                          className={`box__item d-flex align-items-center border-bottom p-2 ${
                            notif.status && "new"
                          }`}
                          style={{ cursor: "pointer", position: "relative" }}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            handleShowModal(notif);
                          }}
                        >
                          <Image
                            src={notif.imgSrc}
                            alt="Profile"
                            roundedCircle
                            className="me-3 ms-1"
                            style={{ width: "40px", height: "40px" }}
                          />
                          <div>
                            <span className="fw-semibold">Hệ thống</span>
                            <div
                              className="text-truncate d-block"
                              style={{ maxWidth: "200px" }}
                            >
                              {notif.content}
                            </div>
                            <span className="small">{notif.createdAt}</span>
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
                      ))
                    )}
                  </div>
                  <div>
                    <NavLink
                      to={"/notification"}
                      className="text-decoration-none d-flex justify-content-between align-items-center p-2 px-3 text-muted small"
                    >
                      Xem tất cả thông báo
                      <i className="bi bi-arrow-right-short"></i>
                    </NavLink>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="d-flex justify-content-center align-items-center mx-2">
              <span className="fs-2 fw-lighter opacity-25 mb-2 text-dark">
                |
              </span>
            </li>
            <li className="nav-item d-flex justify-content-center align-items-center  d-sm-flex">
              <button className="nav-link icon-badge" onClick={toggleTheme}>
                {theme === "light" ? (
                  <i className="bi bi-brightness-high fs-5"></i>
                ) : (
                  <i className="bi bi-brightness-high-fill fs-5"></i>
                )}
              </button>
            </li>
            <li className="d-flex justify-content-center align-items-center mx-2  d-sm-flex">
              <span className="fs-2 fw-lighter opacity-25 mb-2 text-dark">
                |
              </span>
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
                    className="rounded-circle object-fit-cover"
                    width={40}
                    height={40}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/admin/my-profile">
                    Thông tin cá nhân
                  </Dropdown.Item>
                  {user.role !== "USER" && (
                    <Dropdown.Item as={NavLink} to="/">
                      Chuyển sang khách
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item as={NavLink} to="/admin/settings">
                    Cài đặt
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
        <ToastContainer position="top-end" className="p-3">
          {user &&
            showToasts.map((toastItem) => (
              <Toast
                key={toastItem.id}
                onClose={() => handleCloseToast(toastItem.id)}
                show={true}
                delay={10000}
                autohide={true}
                bg="white"
                animation
              >
                <Toast.Header>
                  <img
                    src={"/assets/img/notification-bell.png"}
                    className="rounded me-3"
                    style={{ width: "25px", height: "25px" }}
                    alt="Icon thông báo"
                  />
                  <strong className="me-auto">Thông báo</strong>
                  <small>{toastItem.createdAt}</small>
                </Toast.Header>
                <Toast.Body className="text-dark">
                  {toastItem.content}
                </Toast.Body>
              </Toast>
            ))}
        </ToastContainer>
      </div>
      {/* Modal Xem Thông Báo Chi Tiết */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-center">
            <Image
              src={selectedNotification.imgSrc}
              alt="Notification Icon"
              roundedCircle
              style={{ width: "35px", height: "35px", marginRight: "15px" }}
            />
            <div>
              <h5 className="m-0">Thông báo hệ thống</h5>
              <small className="text-muted">
                {dayjs(selectedNotification.createdAt).fromNow()}
              </small>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification ? (
            <p className="py-2">{selectedNotification.content}</p>
          ) : (
            <p>Không có thông báo để hiển thị.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppHeader;
