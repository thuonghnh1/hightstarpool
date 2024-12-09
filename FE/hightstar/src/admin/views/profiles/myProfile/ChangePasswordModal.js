// src/components/MyProfile/ChangePasswordModal.js
import React, { useContext, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import UserProfileService from "../../../services/UserProfileService";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";

const ChangePasswordModal = ({ show, handleClose }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [changing, setChanging] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Mật khẩu hiện tại không được để trống.";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới không được để trống.";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải ít nhất 6 ký tự.";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setChanging(true);
      await UserProfileService.changePassword(
        user.userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      handleClose();
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setChanging(false);
    }
  };

  const handleModalClose = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi Mật Khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleChangePassword}>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>
              Mật khẩu hiện tại <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              isInvalid={!!errors.currentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>
              Mật khẩu mới <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              isInvalid={!!errors.newPassword}
              placeholder="Nhập mật khẩu mới"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>
              Xác nhận mật khẩu <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              isInvalid={!!errors.confirmPassword}
              placeholder="Xác nhận mật khẩu mới"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <NavLink
            to={"/forgot-password"}
            className="btn-link text-primary px-0 d-flex justify-content-end"
          >
            Quên mật khẩu
          </NavLink>

          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              className="px-5 my-2 mt-3"
              disabled={changing}
            >
              {changing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang đổi...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
