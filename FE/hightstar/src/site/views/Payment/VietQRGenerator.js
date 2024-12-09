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
  Card,
} from "react-bootstrap";
import { generateOtp, verifyOtp } from "../../services/TransactionService";

const VietQRGenerator = () => {
  // State cho form giao dịch
  const [formData, setFormData] = useState({
    bankCode: "970422",
    accountNumber: "3402110499999",
    accountName: "NGUYEN DINH NGHI",
    amount: "",
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
        amount: "",
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
          verifyResponse.message || "Nội dung chuyển khoản không trùng khớp hoặc đã hết thời gian chuyển khoản"
        );
      }
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Có lỗi xảy ra khi xác thực nội dung chuyển khoản. Vui lòng thử lại."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Container className="my-5">
      {/* Thông báo */}
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Row cho Form và QR Code */}
      <Row className="justify-content-center">
        {/* Cột bên trái: Form tạo giao dịch */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-info-subtle text-white">
              <h4 className="mb-0">Tạo Giao dịch VietQR</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleGenerateVietQR}>
                <Form.Group controlId="bankCode" className="mb-3">
                  <Form.Label>Mã Ngân Hàng</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã ngân hàng"
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="accountNumber" className="mb-3">
                  <Form.Label>Số Tài Khoản</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số tài khoản"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="accountName" className="mb-3">
                  <Form.Label>Tên Chủ Tài Khoản</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên chủ tài khoản"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="amount" className="mb-3">
                  <Form.Label>Số Tiền</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số tiền"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
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
                  className="w-100"
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
            </Card.Body>
          </Card>
        </Col>

        {/* Cột bên phải: Mã QR */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-success-subtle text-white">
              <h4 className="mb-0">Mã VietQR</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              {qrData ? (
                <div className="text-center">
                  <img
                    src={qrData}
                    alt="VietQR"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "300px" }}
                  />
                  <p>Quét mã QR để thực hiện giao dịch.</p>
                </div>
              ) : (
                <p className="text-muted">
                  Không có mã VietQR nào được tạo. Vui lòng tạo giao dịch.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Row cho nút xác nhận giao dịch */}
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button
            variant="success"
            onClick={handleConfirmTransaction}
            disabled={isVerifying}
            className="w-100"
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
