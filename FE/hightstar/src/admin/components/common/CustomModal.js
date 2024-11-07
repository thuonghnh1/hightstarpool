import { Modal, Button} from "react-bootstrap";
const CustomModal = ({
  show,
  handleClose,
  title,
  children,
  onSubmit,
  isLoading,
  statusFunction
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      size={"lg"}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        {!statusFunction.isViewDetail ? (
          <>
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
          </>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;

