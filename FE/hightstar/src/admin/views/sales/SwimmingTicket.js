import React from "react";

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
    <div
      style={{
        display: "flex",
        width: "800px",
        height: "270px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        padding: "0",
      }}
    >
      {/* Phần bên trái */}
      <div
        style={{
          flex: 2,
          padding: "20px",
          color: "#fff",
          backgroundColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Logo và tiêu đề */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img
            src="https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png"
            alt="Logo"
            style={{ height: "50px" }}
          />
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "lighter",
              color: "white",
            }}
          >
            CÔNG TY TNHH HIGHTSTAR
          </h6>
          <span style={{ fontSize: "12px", textAlign: "right" }}>
            HOTLINE: <br />
            0987654321
          </span>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0", fontWeight: "bold", color: "white" }}>
            VÉ BƠI{" "}
            {ticketType === "ONETIME_TICKET"
              ? "DÙNG MỘT LẦN"
              : ticketType === "WEEKLY_TICKET"
              ? "THEO TUẦN"
              : ticketType === "MONTHLY_TICKET"
              ? "THEO THÁNG"
              : "DÀNH CHO HỌC VIÊN"}
          </h3>
          <p style={{ margin: "0", fontSize: "14px", color: "#eee" }}>
            {ticketType === "STUDENT_TICKET"
              ? `${courseName} - ${new Date().getFullYear()}`
              : `Dành cho khách bơi tự do - ${new Date().getFullYear()}`}
          </p>
        </div>

        {/* Thông tin vé */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>

      {/* Phần bên phải */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* QR Code */}
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code"
          style={{ height: "200px" }}
        />
        <p
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "5px",
          }}
        >
          Mã vé: {id}
        </p>
        <p
          style={{
            fontSize: "9px",
            fontStyle: "italic",
            color: "red",
            textAlign: "center",
          }}
        >
          Vui lòng đưa mã này cho nhân viên khi ra vào cổng!
        </p>
      </div>
    </div>
  );
};

export default SwimmingTicket;
