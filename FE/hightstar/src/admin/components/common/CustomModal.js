import { Modal, Button, Form } from "react-bootstrap";

const CustomModal = ({
  show,
  handleClose,
  title,
  children,
  onSubmit,
  isLoading,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Phần này sẽ hiển thị nội dung con được truyền từ component cha */}
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Lưu"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
