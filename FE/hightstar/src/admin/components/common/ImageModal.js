import { Modal } from "react-bootstrap";

function ImageModal({ show, imageSrc, onClose }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="border-0"
      contentClassName="bg-transparent border-0 d-flex justify-content-center align-items-center"
    >
      <div className="position-relative" style={{ maxWidth: "90%" }}>
        <img
          src={imageSrc}
          alt="Large view"
          className="img-fluid"
          style={{ width: "50vw", maxWidth: "100%", objectFit: "contain" }}
        />
        <button
          type="button"
          className="bg-light p-2 btn-close position-absolute"
          aria-label="Close"
          onClick={onClose}
          style={{
            top: "10px", // Cách phía trên một chút để không che mất ảnh
            right: "10px", // Cách phía phải một chút để không che mất ảnh
            borderRadius: "50%",
          }}
        ></button>
      </div>
    </Modal>
  );
}

export default ImageModal;
