import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import avatarDefault from "../../assets/images/avatars/user.png";
import {
  Button,
  Dropdown,
  Image,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { logout } from "../services/AuthService";
import iconBell from "../../assets/images/icons/notification.png";
import NotificationService from "../services/NotificationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import locale tiếng Việt
// import { CartContext } from "../../contexts/CartContext";

// Cấu hình Day.js với plugin relativeTime và locale tiếng Việt
dayjs.extend(relativeTime);
dayjs.locale("vi"); // Cài đặt ngôn ngữ tiếng Việt

function Header() {
  const { user, updateUser } = useContext(UserContext);
  // const { shoppingCartItems } = useContext(CartContext);
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
          await NotificationService.getNotificationsByRecipientType("ALL");
        const commonNotifications =
          await NotificationService.getNotificationsByRecipientType(user.role);

        // Kết hợp 2 mảng thông báo lại
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
      console.error("Error fetching notifications:", error);
    }
  }, [user]);

  // useEffect để lấy thông báo khi component mount hoặc khi user thay đổi
  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  // useEffect để cập nhật Toasts khi notifications thay đổi
  useEffect(() => {
    const toasts = notifications.map((notif) => ({
      id: notif.id,
      content: notif.content,
      createdAt: dayjs(notif.createdAt).fromNow(),
    }));
    setShowToasts(toasts);
  }, [notifications]);

  // Xử lý đóng toast
  const handleCloseToast = (id) => {
    setShowToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    );
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
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
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
    try {
      logout();
      updateUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {/* Topbar Start */}
      <div className="container-fluid bg-dark px-5 d-none d-lg-block">
        <div className="row gx-0">
          <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
            <div
              className="d-inline-flex align-items-center"
              style={{ height: 45 }}
            >
              <small className="me-3 text-light">
                <i className="fa fa-map-marker-alt me-2" />
                123 Ton Duc Thang, lien chieu, danang.
              </small>
              <small className="me-3 text-light">
                <i className="fa fa-phone-alt me-2" />
                +012 345 6789
              </small>
              <small className="text-light">
                <i className="fa fa-envelope-open me-2" />
                hightstarpoolcompany@gmail.com
              </small>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div
              className="d-inline-flex align-items-center"
              style={{ height: 45 }}
            >
              <Link
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-twitter fw-normal" />
              </Link>
              <Link
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-facebook-f fw-normal" />
              </Link>
              <Link
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-linkedin-in fw-normal" />
              </Link>
              <Link
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-instagram fw-normal" />
              </Link>
              <Link
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle"
                to=""
              >
                <i className="fab fa-youtube fw-normal" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      {/* Navbar & Hero Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <Link to="/" className="navbar-brand p-0">
            <h1 className="text-primary m-0">HightStarPool</h1>
          </Link>
          {/* Navbar Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="fa fa-bars" />
          </button>

          {/* Navbar Menu */}
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <NavLink to="/" className="nav-item nav-link">
                Trang chủ
              </NavLink>
              <NavLink to="/about" className="nav-item nav-link">
                Thông tin
              </NavLink>
              <NavLink to="/course" className="nav-item nav-link">
                Khóa học
              </NavLink>
              <NavLink to="/product" className="nav-item nav-link">
                Sản phẩm
              </NavLink>

              <Dropdown align="start">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="nav-link"
                  style={{ background: "none" }}
                >
                  Học tập
                </Dropdown.Toggle>

                <Dropdown.Menu className="m-0">
                  <Dropdown.Item as={NavLink} to="/my-class">
                    Lớp học đã tham gia
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/schedule">
                    Lịch học
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <NavLink to="/Contact" className="nav-item nav-link">
                Liên hệ
              </NavLink>
            </div>
            {user && (
              <div className="px-3 py-3 py-lg-0 box__notification">
                <Dropdown align="start">
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
                    <i className="bi bi-bell fs-4 fw-bold icon-cart"></i>
                    {unreadNotificationsCount > 0 && (
                      <span
                        className="badge rounded-pill bg-danger position-absolute"
                        style={{ top: "-5px", left: "15px" }}
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
              </div>
            )}
            {/* <NavLink
              to={"/shopping-cart"}
              className="nav-link icon-badge position-relative px-3 me-4 py-lg-0 py-2"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-cart text-white fs-4 icon-cart"></i>
              <span
                className="badge rounded-pill bg-danger position-absolute"
                style={{ top: "-5px", left: "32px" }}
              >
                {user ? shoppingCartItems?.length : 0}
              </span>
            </NavLink> */}
            {!user ? (
              <NavLink
                to="/login"
                className="btn btn-primary rounded-pill py-2 px-4"
              >
                Đăng Nhập
              </NavLink>
            ) : (
              <Dropdown align="start" className="ms-lg-4">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="border-0 px-0 px-lg-2"
                  bsPrefix="custom-toggle"
                  style={{ background: "none" }}
                >
                  <img
                    src={user?.avatar || avatarDefault}
                    alt="User"
                    className="rounded-circle object-fit-cover"
                    width={50}
                    height={50}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className="m-0 mt-3">
                  <Dropdown.Item as={NavLink} to="/my-profile">
                    Thông tin cá nhân
                  </Dropdown.Item>
                  {user.role !== "USER" && (
                    <Dropdown.Item as={NavLink} to="/admin">
                      Chuyển sang quản lý
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item as={NavLink} to="/settings">
                    Cài đặt
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}
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
              <Toast.Body className="text-dark">{toastItem.content}</Toast.Body>
            </Toast>
          ))}
      </ToastContainer>
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
    </div>
  );
}

export default Header;
