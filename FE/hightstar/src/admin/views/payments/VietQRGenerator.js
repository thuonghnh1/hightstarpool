// src/components/VietQRGenerator.js
import { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Modal,
} from "react-bootstrap";
import { generateOtp, verifyOtp } from "../../services/TransactionService";
import { NumericFormat } from "react-number-format";
import { UserContext } from "../../../contexts/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VietQRGenerator = ({ amountFromParent, onPaymentComplete }) => {
  const { user } = useContext(UserContext);
  // State cho form giao dịch
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("transactionInfo")) || {
      bankCode: "970422",
      accountNumber: "3402110499999",
      accountName: "NGUYEN DINH NGHI",
      amount: "",
      description: " Thanh toán tiền mua hàng tại HightStar",
    };
    return savedData;
  });

  // State cho mã VietQR
  const [qrData, setQrData] = useState("");

  // State cho loading khi tạo OTP
  const [isLoading, setIsLoading] = useState(false);

  // State cho loading khi xác thực OTP
  const [isVerifying, setIsVerifying] = useState(false);

  // State cho modal thay đổi thông tin
  const [showModal, setShowModal] = useState(false);

  // Xử lý thay đổi thông tin nhập vào
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý lưu thông tin vào localStorage
  const saveTransactionInfo = () => {
    localStorage.setItem("transactionInfo", JSON.stringify(formData));
    toast.success("Thông tin giao dịch đã được cập nhật và lưu thành công.");
    setShowModal(false);
  };

  // Xử lý tạo giao dịch và mã VietQR
  const handleGenerateVietQR = useCallback(async () => {
    const { bankCode, accountNumber, amount, description, accountName } =
      formData;

    if (!bankCode || !accountNumber || amount <= 0 || !accountName) {
      setQrData("");
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);

    try {
      const transactionId = `txn_${Date.now()}`;

      const otpResponse = await generateOtp(transactionId);
      const otpCode = otpResponse;

      if (!otpCode) {
        throw new Error("Không nhận được mã OTP từ backend.");
      }

      localStorage.setItem("transactionId", transactionId);
      localStorage.setItem("otp", otpCode);

      const encodedDescription = encodeURIComponent(
        `TT${otpCode} ${description} `
      );

      const qrString = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(
        accountName
      )}&transactionId=${transactionId}`;

      setQrData(qrString);
      toast.success(
        "Mã OTP và VietQR đã được tạo. Vui lòng chuyển tiền và xác nhận giao dịch."
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Có lỗi xảy ra khi tạo mã OTP hoặc mã VietQR. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Xử lý xác nhận giao dịch
  const handleConfirmTransaction = async () => {
    const transactionId = localStorage.getItem("transactionId");
    const otp = localStorage.getItem("otp");

    if (!transactionId || !otp) {
      toast.error(
        "Không tìm thấy giao dịch cần xác nhận. Vui lòng tạo giao dịch mới."
      );
      return;
    }

    setIsVerifying(true);

    try {
      const verifyResponse = await verifyOtp(transactionId, otp);

      if (verifyResponse === true) {
        toast.success("Xác thực OTP thành công! Giao dịch đã được xác nhận.");
        localStorage.removeItem("transactionId");
        localStorage.removeItem("otp");
        setQrData("");

        // Gọi callback để thông báo giao dịch hoàn tất
        onPaymentComplete(true);
      } else {
        toast.error(
          verifyResponse.message ||
            "Nội dung chuyển khoản không trùng khớp hoặc đã hết thời gian chuyển khoản"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
          "Có lỗi xảy ra khi xác thực nội dung chuyển khoản. Vui lòng thử lại."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Tự động tạo QR nếu có số tiền từ cha
  useEffect(() => {
    if (amountFromParent) {
      handleGenerateVietQR();
    }
  }, [amountFromParent, handleGenerateVietQR]);

  return (
    <Container fluid className="my-3">
      <Row className="justify-content-center">
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="bg-info-subtle text-white">
              <h4 className="mb-0">Tạo Giao Dịch Thanh Toán</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="accountNumber" className="mb-3">
                  <Form.Label>Số Tài Khoản</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số tài khoản"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="accountName" className="mb-3">
                  <Form.Label>Tên Chủ Tài Khoản</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên chủ tài khoản"
                    name="accountName"
                    value={formData.accountName}
                    onChange={(e) =>
                      handleInputChange("accountName", e.target.value)
                    }
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="amount" className="mb-3">
                  <Form.Label>Số Tiền</Form.Label>
                  <NumericFormat
                    thousandSeparator={true}
                    suffix=" VNĐ"
                    decimalScale={0}
                    value={formData.amount}
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      handleInputChange("amount", floatValue);
                    }}
                    className="form-control"
                    placeholder="Nhập số tiền (VNĐ)"
                    required
                    disabled={!!amountFromParent}
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-2">
                  <Form.Label>Mô Tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập mô tả"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </Form.Group>

                {user.role === "ADMIN" && (
                  <div
                    variant="warning"
                    onClick={() => setShowModal(true)}
                    className="mb-2 text-end link-primary text text-decoration-underline"
                    style={{ cursor: "pointer" }}
                  >
                    Thay đổi thông tin giao dịch
                  </div>
                )}

                {!amountFromParent && (
                  <Button
                    variant="primary"
                    type="button"
                    className="w-100 mt-1"
                    disabled={isLoading}
                    onClick={handleGenerateVietQR}
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
                      "Tạo Qr Để Thanh Toán"
                    )}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-success-subtle text-white">
              <h4 className="mb-0">Mã QR Thanh Toán</h4>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              {qrData ? (
                <div className="text-center">
                  <img
                    src={qrData}
                    alt="VietQR"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "400px" }}
                  />
                  <p className="small mt-2 fst-italic text-danger">
                    Quét mã QR để thực hiện giao dịch.
                  </p>
                </div>
              ) : (
                <p className="text-muted">Vui lòng tạo QR để thanh toán!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col md={6} className="text-center">
          <Button
            variant="success"
            onClick={handleConfirmTransaction}
            disabled={!qrData || isVerifying}
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
              "Xác nhận đã chuyển tiền thanh toán"
            )}
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi thông tin giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="bankCode" className="mb-3">
              <Form.Label>Mã Ngân Hàng</Form.Label>
              <Form.Control
                type="text"
                name="bankCode"
                value={formData.bankCode}
                onChange={(e) => handleInputChange("bankCode", e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="accountNumber" className="mb-3">
              <Form.Label>Số Tài Khoản</Form.Label>
              <Form.Control
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
              />
            </Form.Group>

            <Form.Group controlId="accountName" className="mb-3">
              <Form.Label>Tên Chủ Tài Khoản</Form.Label>
              <Form.Control
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={saveTransactionInfo}>
            Lưu Thay Đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VietQRGenerator;
