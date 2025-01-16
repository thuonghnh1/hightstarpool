import React, { useState } from "react";
import { Button, Card, Badge, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ClothingCard = ({
  title,
  description,
  unitPrice,
  image,
  discount = 0,
  stock,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State để điều khiển hover
  const discountedPrice = unitPrice - (unitPrice * discount) / 100;

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Chuyển đổi mô tả có dấu xuống dòng thành HTML với <br />
  const formattedDescription = description.replace(/(\r\n|\n|\r)/g, "<br />");

  return (
    <div className="col">
      <Card
        className="h-100 shadow-lg border-0 position-relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}  // Khi hover
        onMouseLeave={() => setIsHovered(false)} // Khi rời chuột
      >
        {/* Hình ảnh sản phẩm */}
        <Card.Img
          src={image}
          alt={title}
          className={`card-img-top object-fit-contain rounded-3 transition-all ${
            isHovered ? "opacity-75" : ""  // Hiệu ứng giảm độ sáng khi hover
          }`}
          style={{
            height: "300px",
            objectFit: "cover",
            transition: "opacity 0.4s ease-in-out", // Hiệu ứng mượt mà cho opacity
          }}
        />

        {/* Lớp overlay ở giữa hình ảnh */}
        <div
          className={`position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center text-white bg-opacity-50 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{
            zIndex: 1, // Đảm bảo overlay nằm trên ảnh
            padding: "10px 20px",
            borderRadius: "5px",
            transition: "opacity 0.4s ease-in-out", // Hiệu ứng overlay khi hover
          }}
        >
          <Button variant="light" size="lg" onClick={handleShowModal}>
            Xem Chi Tiết
          </Button>
        </div>

        <Card.Body className="d-flex flex-column justify-content-between p-3">
          <Card.Title className="h5">{title}</Card.Title>
          <Card.Text className="text-truncate mb-3">{description}</Card.Text>

          {/* Giá sản phẩm */}
          <div className="d-flex align-items-center justify-content-between">
            {discount > 0 ? (
              <>
                <h5 className="text-danger mb-0">
                  {discountedPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h5>
                <small className="text-muted text-decoration-line-through">
                  {unitPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </small>
              </>
            ) : (
              <h5 className="text-primary mb-0">
                {unitPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h5>
            )}
          </div>

          {/* Trạng thái sản phẩm */}
          <Badge bg={stock > 0 ? "success" : "secondary"} className="mt-3">
            {stock > 0 ? `Còn lại: ${stock}` : "Hết hàng"}
          </Badge>
        </Card.Body>
      </Card>

      {/* Modal hiển thị chi tiết sản phẩm */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <img
              src={image}
              alt={title}
              className="img-fluid mb-3"
              style={{
                objectFit: "contain",
                maxHeight: "300px",
                maxWidth: "100%", // Đảm bảo hình ảnh không bị phóng đại quá mức
              }}
            />
          </div>
          {/* Mô tả trong modal */}
          <p dangerouslySetInnerHTML={{ __html: formattedDescription }} />

          {/* Giá trong modal */}
          <div>
            <h5 className="text-danger">
              {discountedPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </h5>
            <small className="text-muted text-decoration-line-through">
              {unitPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </small>
          </div>

          <p>
            <strong>Trạng thái: </strong>
            {stock > 0 ? "Còn hàng" : "Hết hàng"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClothingCard;