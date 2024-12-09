// src/components/TicketCheck.js

import { useState, useEffect, useRef, useCallback } from "react";
import { Table, Card, Modal, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import QrScanner from "qr-scanner";
import { toast } from "react-toastify";
import "../../css/ticket/ticket-check.css";
import AttendanceService from "../../services/AttendanceService"; // Đảm bảo đường dẫn đúng

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

  // Danh sách khách
  const [guestList, setGuestList] = useState([]);

  const calculateDuration = useCallback((checkIn, checkOut) => {
    const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
    const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);
    const totalMinutes =
      checkOutHours * 60 +
      checkOutMinutes -
      (checkInHours * 60 + checkInMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} giờ ${minutes} phút`;
  }, []);

  // Hàm xử lý khi quét thành công
  const handleScanSuccessRef = useRef();

  handleScanSuccessRef.current = async (decodedData) => {
    try {
      const qrCodeBase64 = decodedData.data; // Lấy qrCodeBase64 từ dữ liệu quét được

      // Gọi API scanQRCode với qrCodeBase64
      const response = await AttendanceService.scanQRCode(qrCodeBase64);

      const currentTime = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Cập nhật danh sách khách
      setGuestList((prevGuestList) =>
        prevGuestList.map((g) =>
          g.ticketId === response.ticketId
            ? {
                ...g,
                checkout: currentTime,
                duration: calculateDuration(g.checkIn, currentTime),
              }
            : g
        )
      );

      setModalState({
        show: true,
        type: "success",
        message: `Cập nhật giờ ra thành công cho khách với ticketId ${response.ticketId}`,
      });
    } catch (error) {
      console.error("Lỗi khi xử lý mã QR:", error);
      setModalState({
        show: true,
        type: "failure",
        message:
          typeof error === "string"
            ? error
            : error.message || ERROR_MESSAGES.INVALID_QR,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, show: false });
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
      if (error.message && error.message.includes("No QR code found")) {
        setModalState({
          show: true,
          type: "failure",
          message: ERROR_MESSAGES.NO_QR_FOUND,
        });
      } else {
        console.error("Lỗi khi quét mã QR từ ảnh:", error);
        setModalState({
          show: true,
          type: "failure",
          message: ERROR_MESSAGES.GENERIC_ERROR,
        });
      }
    }
  };

  useEffect(() => {
    // Lấy danh sách khách chưa có checkOut từ API khi component mount
    const fetchAttendances = async () => {
      try {
        const attendances =
          await AttendanceService.getAttendancesWithoutCheckOut();
        const formattedAttendances = attendances.map((attendance) => ({
          id: attendance.attendanceId,
          checkIn: attendance.checkInTime
            ? new Date(attendance.checkInTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Chưa vào",
          checkout: attendance.checkOutTime
            ? new Date(attendance.checkOutTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Chưa ra",
          duration: attendance.checkOutTime
            ? calculateDuration(
                new Date(attendance.checkInTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                new Date(attendance.checkOutTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              )
            : "Chưa ra",
          studentId: attendance.studentId,
          ticketId: attendance.ticketId,
          penalty: attendance.penaltyAmount
            ? `${attendance.penaltyAmount}đ`
            : "0đ",
        }));
        setGuestList(formattedAttendances);
      } catch (error) {
        console.error(
          "Lỗi khi lấy danh sách điểm danh chưa có checkOut:",
          error
        );
        toast.error("Đã xảy ra lỗi khi lấy danh sách điểm danh.");
      }
    };

    fetchAttendances();
  }, [calculateDuration]);

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
  }, []); // Không có dependency để đảm bảo chỉ chạy một lần

  return (
    <>
      <Helmet>
        <title>Quản lý soát vé - Hight Star</title>
      </Helmet>
      <section className="row m-0 p-0 bg-white rounded-3 h-100">
        <div className="row g-0">
          <div className="col-lg-8 p-4">
            <Card className="border-0">
              <Card.Body className="overflow-y-auto table-responsive custom-scrollbar">
                <h5 className="text-uppercase fw-bold mb-4">
                  Bảng quản lý số lượng khách trong hồ
                </h5>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Mã điểm danh</th>
                      <th>Giờ vào</th>
                      <th>Giờ ra</th>
                      <th>Thời gian bơi</th>
                      <th>Mã học viên</th>
                      <th>Mã vé</th>
                      <th>Tiền phạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestList.map((guest, index) => (
                      <tr key={index}>
                        <td className="text-nowrap">{guest.id}</td>
                        <td className="text-nowrap">{guest.checkIn}</td>
                        <td className="text-nowrap">{guest.checkout}</td>
                        <td className="text-nowrap">{guest.duration}</td>
                        <td className="text-nowrap">
                          {guest.studentId || "N/A"}
                        </td>
                        <td className="text-nowrap">{guest.ticketId}</td>
                        <td className="text-nowrap">{guest.penalty}</td>
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
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalState.type === "success" ? (
                <>
                  <i
                    className="bi bi-check-circle-fill text-success me-2"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  Thành công
                </>
              ) : (
                <>
                  <i
                    className="bi bi-x-circle-fill text-danger me-2"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  Thất bại
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{modalState.message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={modalState.type === "success" ? "success" : "danger"}
              onClick={handleCloseModal}
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
