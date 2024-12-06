// src/components/VietQRGenerator.js
import React, { useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { generateOtp, verifyOtp } from "../../services/TransactionService";

const VietQRGenerator = () => {
  // State cho form giao dịch
  const [formData, setFormData] = useState({
    bankCode: "970422",
    accountNumber: "3402110499999",
    accountName: "NGUYEN DINH NGHI",
    amount: 0,
    description: "",
  });

  // State cho mã VietQR
  const [qrData, setQrData] = useState("");

  // State cho thông báo
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State cho loading khi tạo OTP
  const [isLoading, setIsLoading] = useState(false);

  // State cho loading khi xác thực OTP
  const [isVerifying, setIsVerifying] = useState(false);

  // Xử lý thay đổi thông tin nhập vào
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý tạo giao dịch và mã VietQR
  const handleGenerateVietQR = async (e) => {
    e.preventDefault();
    const { bankCode, accountNumber, amount, description, accountName } =
      formData;

    // Kiểm tra thông tin nhập
    if (!bankCode || !accountNumber || amount <= 0 || !accountName) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setQrData("");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Tạo mã giao dịch (transactionId)
      const transactionId = `txn_${Date.now()}`;

      // Gọi API để tạo OTP
      const otpResponse = await generateOtp(transactionId);
      const otpCode = otpResponse;

      if (!otpCode) {
        throw new Error("Không nhận được mã OTP từ backend.");
      }

      // Lưu transactionId và OTP vào localStorage
      localStorage.setItem("transactionId", transactionId);
      localStorage.setItem("otp", otpCode);

      // Đính kèm OTP vào mô tả (nếu cần thiết)
      const encodedDescription = encodeURIComponent(
        `TT${otpCode} ${description} `
      );

      // Tạo chuỗi QR
      const qrString = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(
        accountName
      )}&transactionId=${transactionId}`; // Đính kèm transactionId để xác thực sau này

      setQrData(qrString);
      setMessage(
        "Mã OTP đã được tạo và mã VietQR đã được tạo. Vui lòng xác nhận giao dịch."
      );

      // Reset form
      setFormData({
        bankCode: "970422",
        accountNumber: "3402110499999",
        accountName: "NGUYEN DINH NGHI",
        amount: 0,
        description: "",
      });
    } catch (error) {
      console.error(error);
      setError(
        "Có lỗi xảy ra khi tạo mã OTP hoặc mã VietQR. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác nhận giao dịch
  const handleConfirmTransaction = async () => {
    const transactionId = localStorage.getItem("transactionId");
    const otp = localStorage.getItem("otp");

    if (!transactionId || !otp) {
      setError(
        "Không tìm thấy giao dịch cần xác nhận. Vui lòng tạo giao dịch mới."
      );
      return;
    }

    setIsVerifying(true);
    setError("");
    setMessage("");

    try {
      // Gọi API để xác thực OTP với transactionId và otp từ localStorage
      const verifyResponse = await verifyOtp(transactionId, otp);

      if (verifyResponse === true) {
        setMessage("Xác thực OTP thành công! Giao dịch đã được xác nhận.");
        // Xóa transactionId và otp khỏi localStorage sau khi xác thực thành công
        localStorage.removeItem("transactionId");
        localStorage.removeItem("otp");
        setQrData(""); // Xóa QR code nếu muốn
      } else {
        setError(
          verifyResponse.message || "Mã OTP không chính xác hoặc đã hết hạn!"
        );
      }
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Có lỗi xảy ra khi xác thực mã OTP. Vui lòng thử lại."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Container>
      {/* Row cho Form và QR Code */}
      <Row className="mt-5">
        {/* Cột bên trái: Form tạo giao dịch */}
        <Col md={6}>
          <h3>Tạo Giao dịch VietQR</h3>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleGenerateVietQR}>
            <Form.Group controlId="bankCode">
              <Form.Label>Mã Ngân Hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã ngân hàng"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="accountNumber">
              <Form.Label>Số Tài Khoản</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số tài khoản"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="accountName">
              <Form.Label>Tên Chủ Tài Khoản</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên chủ tài khoản"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Số Tiền</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số tiền"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang tạo...
                </>
              ) : (
                "Tạo VietQR và Gửi OTP"
              )}
            </Button>
          </Form>
        </Col>

        {/* Cột bên phải: Mã QR */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          {qrData ? (
            <div className="text-center">
              <h5>Mã VietQR:</h5>
              <img
                src={qrData}
                alt="VietQR"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          ) : (
            <p>Không có mã VietQR nào được tạo.</p>
          )}
        </Col>
      </Row>

      {/* Row cho nút xác nhận giao dịch */}
      <Row className="mt-5">
        <Col className="text-center">
          <Button
            variant="success"
            onClick={handleConfirmTransaction}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Đang xác nhận...
              </>
            ) : (
              "Xác nhận đã chuyển"
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VietQRGenerator;
