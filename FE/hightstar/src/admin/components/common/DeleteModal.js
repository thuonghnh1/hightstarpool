import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, onConfirm, onClose, isLoading }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="d-flex justify-content-center align-items-center px-0">
        <div className="d-flex flex-column justify-content-center align-items-center py-3 px-0">
          <div className="icon-box">
            <i
              className="bi bi-x-circle text-danger"
              style={{ fontSize: "70px" }}
            ></i>
          </div>
          <h3 className="py-2 text-dark-emphasis">Bạn có chắc chắn?</h3>
          <p className="w-75 text-center">
            Bạn thực sự muốn xóa bản ghi này? Quá trình này sẽ không thể hoàn
            tác.
          </p>
          <div className="">
            <Button variant="secondary" className="m-3 px-5" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="danger"
              className="m-3 px-5"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Xóa"
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
