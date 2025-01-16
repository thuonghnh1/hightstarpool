import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import SiteService from "../../services/SiteService";

const ModalAdvisory = ({ courseName, courseId, show, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    courseId: courseId || "",
    notes: "",
  });
  const [errorFields, setErrorFields] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Tên không được để trống.";
    } else if (/\d/.test(formData.fullName)) {
      newErrors.fullName = "Tên không được chứa chữ số.";
    }

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrorFields({});
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      courseId: courseId || "",
      notes: "",
    });
    setErrorFields({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoadingPage(true);
        await SiteService.sendInfoRegister(formData);
        toast.success("Chúng tôi sẽ sớm liên hệ tư vấn cho bạn!");
        handleResetForm();
        onClose();
      } catch (error) {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setLoadingPage(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Điền Thông Tin Liên Hệ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Tên */}
            <Col xs={12}>
              <Form.Group controlId="formFullName">
                <Form.Control
                  type="text"
                  placeholder="Tên Của Bạn"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  isInvalid={!!errorFields.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Control
                  type="email"
                  placeholder="Email Của Bạn"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isInvalid={!!errorFields.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Số Điện Thoại */}
            <Col md={6}>
              <Form.Group controlId="formPhoneNumber">
                <Form.Control
                  type="tel"
                  placeholder="Số Điện Thoại"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  isInvalid={!!errorFields.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Tên Khóa Học */}
            <Col xs={12}>
              <Form.Group controlId="formCourseName">
                <Form.Control
                  type="text"
                  placeholder="Khóa Học"
                  value={courseName}
                  disabled
                />
              </Form.Group>
            </Col>

            {/* Ghi Chú */}
            <Col xs={12}>
              <Form.Group controlId="formNotes">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ghi Chú"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Nút Submit */}
            <Col xs={12}>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loadingPage}
              >
                {loadingPage ? "Đang xử lý..." : "Gửi thông tin"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAdvisory;
