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
      <div
        className="position-relative image-modal-container"
        style={{
          width: "400px", // Để modal không bị vượt quá màn hình
          height: "400px", // Tự động điều chỉnh chiều cao
        }}
      >
        <img
          src={imageSrc}
          alt="Large view"
          className="img-fluid"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px", // Tùy chọn làm bo góc
          }}
        />
        <button
          type="button"
          className="bg-light p-2 btn-close position-absolute"
          aria-label="Close"
          onClick={onClose}
          style={{
            top: "10px", // Cách trên một chút
            right: "10px", // Cách phải một chút
            borderRadius: "50%",
          }}
        ></button>
      </div>
    </Modal>
  );
}

export default ImageModal;
