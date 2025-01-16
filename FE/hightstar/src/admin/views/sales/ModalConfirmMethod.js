import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalConfirmMethod = ({ show, handleClose, onSelectMethod }) => {
  const handleSelect = (method) => {
    onSelectMethod(method);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Phương Thức Thanh Toán</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-2">
          <div className="col-sm-6 mb-sm-0 mb-2 ">
            <Button
              variant="primary"
              className="d-flex align-items-center h-100 w-100 justify-content-center text-uppercase fw-bolder p-3"
              onClick={() => handleSelect("CASH")}
            >
              <i className="bi bi-cash-coin me-2 fs-5"></i> Bằng Tiền Mặt
            </Button>
          </div>
          <div className="col-sm-6">
            <Button
              variant="success"
              className="d-flex align-items-center h-100 w-100 justify-content-center text-uppercase fw-bolder p-3"
              onClick={() => handleSelect("BANK_TRANSFER")}
            >
              <i className="bi bi-bank me-2 fs-5"></i> Chuyển Khoản
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfirmMethod;
