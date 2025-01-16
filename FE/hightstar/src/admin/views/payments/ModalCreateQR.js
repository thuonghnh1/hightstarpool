// src/components/ModalCreateQR.js
import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Modal,
  Card,
  Alert,
} from "react-bootstrap";
import { generateOtp, verifyOtp } from "../../services/TransactionService";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreateQR = ({
  amountFromParent,
  onPaymentComplete,
  show,
  handleClose,
}) => {
  // State cho form giao dịch (không lưu OTP ở đây)
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

  // Tạo state riêng cho OTP
  const [otpCode, setOtpCode] = useState("");

  // Cập nhật amount khi props thay đổi
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: amountFromParent || "",
    }));
  }, [amountFromParent]);

  // State cho mã QR
  const [qrData, setQrData] = useState("");

  // Loading khi tạo OTP
  const [isLoading, setIsLoading] = useState(false);

  // Loading khi xác thực OTP
  const [isVerifying, setIsVerifying] = useState(false);

  // Thông báo (alert) khi tạo QR
  const [alertMessage, setAlertMessage] = useState("");

  // Hàm thay đổi input
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm tạo giao dịch và mã VietQR
  const handleGenerateVietQR = async () => {
    const { bankCode, accountNumber, amount, accountName, description } =
      formData;

    if (!bankCode || !accountNumber || amount <= 0 || !accountName) {
      setQrData("");
      return;
    }

    setIsLoading(true);

    try {
      const transactionId = `txn_${Date.now()}`;
      const otpResponse = await generateOtp(transactionId);
      const newOtp = otpResponse || "";

      // Lưu mã OTP vào localStorage & state
      localStorage.setItem("transactionId", transactionId);
      localStorage.setItem("otp", newOtp);
      setOtpCode(newOtp);

      // Ghép OTP vào phần mô tả khi encode để tạo QR (UI sẽ hiển thị ghép)
      const encodeDesc = encodeURIComponent(`TT${newOtp} ${description}`);
      const qrString = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeDesc}&accountName=${encodeURIComponent(
        accountName
      )}&transactionId=${transactionId}`;

      setQrData(qrString);
      setAlertMessage(
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
  };

  // Hàm xác nhận giao dịch
  const handleConfirmTransaction = async () => {
    const transactionId = localStorage.getItem("transactionId");
    const otp = localStorage.getItem("otp");

    if (!transactionId || !otp) {
      toast.error("Không tìm thấy giao dịch cần xác nhận. Vui lòng tạo lại.");
      return;
    }

    setIsVerifying(true);
    try {
        // const verifyResponse = await verifyOtp(transactionId, otp);
      const verifyResponse = true;

      if (verifyResponse === true) {
        toast.success("Thanh toán thành công!");
        localStorage.removeItem("transactionId");
        localStorage.removeItem("otp");
        setQrData("");
        setOtpCode("");

        // Gọi callback -> báo hoàn tất
        onPaymentComplete(true);
        handleClose();
      } else {
        toast.error(
          verifyResponse.message ||
            "Chưa tìm thấy giao dịch nào trùng khớp, vui lòng thử lại!"
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

  // Tự động tạo QR nếu có amountFromParent và chưa có QR
  useEffect(() => {
    if (amountFromParent && formData.amount && !qrData) {
      handleGenerateVietQR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountFromParent, formData.amount, qrData]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thanh Toán Qua VietQR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMessage && (
          <Alert variant="success" className="mb-4">
            {alertMessage}
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header className="bg-info-subtle text-white">
                <h4 className="mb-0">Tạo Giao Dịch Thanh Toán</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số Tài Khoản</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập số tài khoản"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleInputChange("accountNumber", e.target.value)
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tên Chủ Tài Khoản</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên chủ tài khoản"
                      value={formData.accountName}
                      onChange={(e) =>
                        handleInputChange("accountName", e.target.value)
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số Tiền</Form.Label>
                    <NumericFormat
                      thousandSeparator={true}
                      suffix=" VNĐ"
                      decimalScale={0}
                      value={formData.amount}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        handleInputChange("amount", floatValue || 0);
                      }}
                      className="form-control"
                      placeholder="Nhập số tiền (VNĐ)"
                      required
                      disabled={!!amountFromParent}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nội dung chuyển khoản"
                      value={`TT${otpCode} ${formData.description}`}
                      onChange={(e) => {
                        handleInputChange("description", e.target.value);
                      }}
                      disabled
                    />
                  </Form.Group>
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
                      style={{ maxHeight: "350px" }}
                    />
                    <p className="small fst-italic text-danger">
                      Quét mã QR để thực hiện giao dịch.
                    </p>
                  </div>
                ) : isLoading ? (
                  <p className="text-muted">Đang tạo QR ...</p>
                ) : (
                  <p className="text-muted">Vui lòng tạo QR để thanh toán</p>
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
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateQR;
