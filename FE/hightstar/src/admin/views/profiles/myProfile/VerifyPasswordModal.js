import React, { useContext, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import UserProfileService from "../../../services/UserProfileService";
import { UserContext } from "../../../../contexts/UserContext";

const VerifyPasswordModal = ({ show, handleClose, onVerified }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { user } = useContext(UserContext);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors("");
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setErrors("Mật khẩu không được để trống.");
      return;
    }

    try {
      setVerifying(true);
      // Gọi API để xác minh mật khẩu
      await UserProfileService.verifyPassword(user.userId, password);

      toast.success("Xác minh thành công!");
      setPassword("");
      handleClose();
      onVerified(); // Gọi callback để cho phép thay đổi email và số điện thoại
    } catch (error) {
      setErrors("Mật khẩu không chính xác.");
    } finally {
      setVerifying(false);
    }
  };

  const handleModalClose = () => {
    setPassword("");
    setErrors("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác Minh Mật Khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleVerifyPassword}>
          <Form.Group className="mb-3" controlId="verifyPassword">
            <Form.Label>
              Nhập mật khẩu để xác minh <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handlePasswordChange}
              isInvalid={!!errors}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              className="px-5 my-2 mt-3"
              disabled={verifying}
            >
              {verifying ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang xác minh...
                </>
              ) : (
                "Xác minh"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyPasswordModal;
