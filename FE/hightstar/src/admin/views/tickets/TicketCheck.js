// src/components/TicketCheck.js

import { useState, useEffect, useRef, useCallback } from "react";
import { Table, Card, Modal, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import QrScanner from "qr-scanner";
import { toast } from "react-toastify";
import "../../css/ticket/ticket-check.css";
import AttendanceService from "../../services/AttendanceService";

const ERROR_MESSAGES = {
  CAMERA_ACCESS: "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập!",
  INVALID_QR: "Dữ liệu mã QR không hợp lệ! Vui lòng kiểm tra lại mã QR.",
  FILE_UPLOAD: "Vui lòng chọn một file ảnh để quét!",
  NO_QR_FOUND: "Không tìm thấy mã QR hợp lệ trong ảnh!",
  GENERIC_ERROR: "Đã xảy ra lỗi khi quét ảnh! Vui lòng thử lại.",
};

const TicketCheck = () => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalState, setModalState] = useState({
    show: false,
    type: "success", // "success" hoặc "failure"
    message: "",
  });
  const isSuccess = modalState.type === "success";
  // Danh sách khách
  const [guestList, setGuestList] = useState([]);

  // Flag để ngăn chặn việc xử lý quét liên tục
  const [isProcessing, setIsProcessing] = useState(false);

  // Hàm xử lý khi quét thành công
  const handleScanSuccessRef = useRef();

  handleScanSuccessRef.current = async (decodedData) => {
    if (isProcessing || modalState.show) {
      // Nếu đang xử lý hoặc modal đang mở, không xử lý tiếp
      return;
    }

    setIsProcessing(true);

    try {
      const qrCodeData = decodedData.data;
      const response = await AttendanceService.scanQRCode(qrCodeData);

      // Tìm bản ghi điểm danh hiện tại trong guestList
      const existingAttendance = guestList.find(
        (g) => g.ticketId === response.ticketId
      );

      let message = "";

      if (existingAttendance) {
        if (existingAttendance.checkout === "Chưa ra") {
          message = `Cập nhật giờ ra thành công cho khách với mã vé ${response.ticketId} và tiền phạt 0đ`;
        }
      } else {
        message = `Cập nhật giờ vào thành công cho khách với mã vé ${response.ticketId}`;
      }

      // const currentTime = new Date().toLocaleTimeString("vi-VN", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });

      setModalState({
        show: true,
        type: "success",
        message: message,
      });

      await fetchAttendances();
    } catch (error) {
      console.error("Lỗi khi xử lý mã QR:", error);
      let errorMsg = ERROR_MESSAGES.GENERIC_ERROR;
      if (error.response && error.response.data) {
        errorMsg = error.response.data;
      } else if (error.message) {
        errorMsg = error.message;
      }
      setModalState({
        show: true,
        type: "failure",
        message: errorMsg,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, show: false });
    setIsProcessing(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setModalState({
        show: true,
        type: "failure",
        message: ERROR_MESSAGES.FILE_UPLOAD,
      });
      return;
    }

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });

      if (result?.data) {
        handleScanSuccessRef.current(result);
      } else {
        setModalState({
          show: true,
          type: "failure",
          message: ERROR_MESSAGES.NO_QR_FOUND,
        });
      }
    } catch (error) {
      if (error && error.includes("No QR code found")) {
        setModalState({
          show: true,
          type: "failure",
          message: ERROR_MESSAGES.NO_QR_FOUND,
        });
      } else {
        console.error(error);
        setModalState({
          show: true,
          type: "failure",
          message: ERROR_MESSAGES.GENERIC_ERROR,
        });
      }
    }
  };

  const fetchAttendances = useCallback(async () => {
    try {
      const attendances =
        await AttendanceService.getAttendancesWithoutCheckOut();
      const formattedAttendances = attendances.map((attendance) => ({
        id: attendance.id,
        checkIn: attendance.checkInTime || "Chưa vào",
        checkout: attendance.checkOutTime || "Chưa ra",
        classStudentEnrollmentId: attendance.classStudentEnrollmentId,
        ticketId: attendance.ticketId,
        penalty: attendance.penaltyAmount
          ? `${attendance.penaltyAmount}đ`
          : "0đ",
      }));
      setGuestList(formattedAttendances);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách điểm danh chưa có checkOut:", error);
      toast.error("Đã xảy ra lỗi khi lấy danh sách điểm danh.");
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  useEffect(() => {
    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanSuccessRef.current(result), // Tham chiếu ổn định
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start().catch((error) => {
        console.error("Lỗi camera:", error);
        toast.error(ERROR_MESSAGES.CAMERA_ACCESS);
        setErrorMessage(ERROR_MESSAGES.CAMERA_ACCESS);
      });

      // Cleanup khi component unmount
      return () => {
        scannerRef.current?.stop();
      };
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Quản lý soát vé - Hight Star</title>
      </Helmet>
      <section className="row m-0 p-0 bg-white rounded-3 h-100">
        <div className="row g-0">
          <div className="col-lg-8 p-4">
            <Card className="border-0 h-100">
              <Card.Body className="overflow-y-auto table-responsive custom-scrollbar">
                <h5 className="text-uppercase fw-bold mb-4">
                  Bảng quản lý số lượng khách trong hồ
                </h5>
                <Table hover className="flex-grow-1">
                  <thead>
                    <tr>
                      <th>Mã điểm danh</th>
                      <th>Giờ vào</th>
                      <th>Mã vào lớp của học viên</th>
                      <th>Mã vé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestList.map((guest, index) => (
                      <tr key={index}>
                        <td className="text-nowrap">{guest.id}</td>
                        <td className="text-nowrap">{guest.checkIn}</td>
                        <td className="text-nowrap">
                          {guest.classStudentEnrollmentId || "N/A"}
                        </td>
                        <td className="text-nowrap">{guest.ticketId}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p className="text-end">
                  <strong>Tổng khách trong hồ:</strong> {guestList.length}
                </p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-lg-4 p-4 border-start">
            <Card className="border-0">
              <Card.Body className="text-center p-0">
                <div className="scanner-container">
                  <h5 className="text-uppercase fw-bold mb-4">Quét mã QR</h5>
                  <div className="scanner-wrapper d-flex justify-content-center align-items-center">
                    {!errorMessage ? (
                      <video ref={videoRef} className="scanner-video" />
                    ) : (
                      <p className="p-4 text-danger">{errorMessage}</p>
                    )}
                    <div className="scanner-overlay"></div>
                  </div>
                  <p className="mt-3 text-danger small fst-italic">
                    Đưa mã QR vào khung quét để kiểm tra thông tin.
                  </p>
                  <div className="mt-4">
                    <label
                      htmlFor="uploadQrImage"
                      className="btn btn-outline-success"
                    >
                      <i className="bi bi-upload me-2"></i>Tải lên mã QR
                    </label>
                    <input
                      id="uploadQrImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        {/* Modal thông báo */}
        <Modal
          show={modalState.show}
          onHide={handleCloseModal}
          centered
          backdrop="static"
          keyboard={false}
          size="md"
          aria-labelledby="notification-modal-title"
        >
          <Modal.Header
            closeButton
            className={`bg-${isSuccess ? "success" : "danger"} text-white`}
          >
            <Modal.Title
              id="notification-modal-title"
              className="d-flex align-items-center text-white"
            >
              <i
                className={`bi ${
                  isSuccess ? "bi-check-circle-fill" : "bi bi-x-octagon fs-3"
                } me-2`}
                style={{ fontSize: "1.5rem" }}
                aria-hidden="true"
              ></i>
              {isSuccess ? "Thành công" : "Thất bại"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-center">
              <i
                className={`bi ${
                  isSuccess ? "bi-check-circle" : "bi-exclamation-circle"
                } me-3`}
                style={{
                  fontSize: "2rem",
                  color: isSuccess ? "#28a745" : "#dc3545",
                }}
                aria-hidden="true"
              ></i>
              <div>
                <p className="mb-1 fs-5">{modalState.message}</p>
                {/* Bạn có thể thêm thông tin bổ sung ở đây nếu cần */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={isSuccess ? "success" : "danger"}
              onClick={handleCloseModal}
              className="w-100"
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};

export default TicketCheck;
