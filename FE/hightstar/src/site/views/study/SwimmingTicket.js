import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const SwimmingTicket = ({ ticketData, studentName, courseName }) => {
  if (!ticketData) {
    return <p>Không có dữ liệu vé!</p>;
  }

  const { id, issueDate, expiryDate, ticketType, qrCodeBase64 } = ticketData;

  // Thiết lập màu nền dựa trên loại vé
  const backgroundColor =
    ticketType === "ONETIME_TICKET"
      ? "#0056b3" // Xanh đậm cho vé dùng một lần
      : ticketType === "WEEKLY_TICKET"
      ? "#157347" // Xanh lá cho vé tuần
      : ticketType === "MONTHLY_TICKET"
      ? "#ffc107" // Vàng cho vé tháng
      : ticketType === "STUDENT_TICKET"
      ? "#dc3545"
      : "#0000"; // Đỏ cho vé học viên, mặc định là màu đen

  return (
    <Container
      fluid
      className="border"
      style={{
        backgroundColor: "#fff",
        maxWidth: "800px",
      }}
    >
      <Row>
        {/* Phần bên trái */}
        <Col
          lg={8}
          className="text-white d-flex flex-column justify-content-between"
          style={{ backgroundColor, padding: "20px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <img
              src="https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png"
              alt="Logo"
              style={{ height: "50px" }}
            />
            <h6 className="text-uppercase fw-lighter text-white text-center">
              CÔNG TY TNHH HIGHTSTAR
            </h6>
            <span className="text-end" style={{ fontSize: "12px" }}>
              HOTLINE: <br />
              0987654321
            </span>
          </div>
          <div className="text-center mt-3">
            <h4 className="d-none d-sm-block" style={{ margin: "0", fontWeight: "bold", color: "white" }}>
              VÉ BƠI{" "}
              {ticketType === "ONETIME_TICKET"
                ? "DÙNG MỘT LẦN"
                : ticketType === "WEEKLY_TICKET"
                ? "THEO TUẦN"
                : ticketType === "MONTHLY_TICKET"
                ? "THEO THÁNG"
                : "DÀNH CHO HỌC VIÊN"}
            </h4>
            <h6 className="d-block d-sm-none mt-3" style={{ margin: "0", fontWeight: "bold", color: "white" }}>
              VÉ BƠI{" "}
              {ticketType === "ONETIME_TICKET"
                ? "DÙNG MỘT LẦN"
                : ticketType === "WEEKLY_TICKET"
                ? "THEO TUẦN"
                : ticketType === "MONTHLY_TICKET"
                ? "THEO THÁNG"
                : "DÀNH CHO HỌC VIÊN"}
            </h6>
            <small>
              {ticketType === "STUDENT_TICKET"
                ? `${courseName} - ${new Date().getFullYear()}`
                : `Dành cho khách bơi tự do - ${new Date().getFullYear()}`}
            </small>
          </div>
          {/* Thông tin vé */}
          <div className="d-none d-md-flex mt-3" style={{justifyContent: "space-between" }}>
            <p style={{ fontSize: "14px", margin: "0" }}>
              <strong>Ngày xuất vé:</strong>
              <br />
              {new Date(issueDate).toLocaleDateString("vi-VN")}
            </p>
            <p style={{ fontSize: "14px", margin: "0" }}>
              <strong>Họ tên:</strong>
              <br />
              {studentName || "Không rõ"}
            </p>
            <p style={{ fontSize: "14px", margin: "0" }}>
              <strong>Ngày hết hạn:</strong>
              <br />
              {new Date(expiryDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="mt-4 d-block d-md-none">
            <p className="mb-1">
              <strong>Ngày xuất vé:</strong>{" "}
              {new Date(issueDate).toLocaleDateString("vi-VN")}
            </p>
            <p className="mb-1">
              <strong>Họ tên:</strong> {studentName || "Không rõ"}
            </p>
            <p className="mb-1">
              <strong>Ngày hết hạn:</strong>{" "}
              {new Date(expiryDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </Col>

        {/* Phần bên phải */}
        <Col
          lg={4}
          className="d-flex flex-column align-items-center justify-content-center p-3"
        >
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code"
            className="img-fluid"
            style={{ maxHeight: "200px" }}
          />
          <p className="fw-bold text-dark mt-">Mã vé: {id}</p>
          <p className="text-danger text-center" style={{ fontSize: "10px" }}>
            Vui lòng đưa mã này cho nhân viên khi ra vào cổng!
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default SwimmingTicket;
