import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import TicketService from "../../../admin/services/TicketService";
import SwimmingTicket from "./SwimmingTicket";

const ClassModal = ({ show, onHide, classDetails, studentId, studentName }) => {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await TicketService.getTicketByClassIdAndStudentId(
          classDetails.id,
          studentId
        );
        setTicket(ticketData);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    if (classDetails && studentId) {
      fetchTicket();
    }
  }, [classDetails, studentId]);

  const renderStatusCustom = (statusData) => {
    let statusClass = "";
    let statusText = "";
    switch (statusData) {
      case "ACTIVE":
        statusClass = "text-bg-success";
        statusText = "Hoạt động";
        break;
      case "EXPIRED":
        statusClass = "text-bg-secondary";
        statusText = "Đã hết hạn";
        break;
      case "USED":
        statusClass = "text-bg-info";
        statusText = "Đã sử dụng";
        break;
      case "NOT_STARTED":
        statusClass = "text-bg-secondary";
        statusText = "Chưa bắt đầu";
        break;
      case "IN_PROGRESS":
        statusClass = "text-bg-primary";
        statusText = "Đang diễn ra";
        break;
      default:
        statusClass = "text-bg-muted"; // Trường hợp mặc định
        statusText = "Không xác định";
    }

    return (
      <span
        className={`rounded-3 fw-bold px-2 py-1 ${statusClass}`}
        style={{ fontSize: "14px" }}
      >
        {statusText}
      </span>
    );
  };
  const renderTimeSlotsCustom = (timeSlots) => {
    const dayOfWeekLabels = {
      MONDAY: "Thứ Hai",
      TUESDAY: "Thứ Ba",
      WEDNESDAY: "Thứ Tư",
      THURSDAY: "Thứ Năm",
      FRIDAY: "Thứ Sáu",
      SATURDAY: "Thứ Bảy",
      SUNDAY: "Chủ Nhật",
    };
    return (
      <div className="d-flex flex-column">
        {timeSlots.map((timeSlot, index) => (
          <div key={index} className="row">
            <div className="col-lg-2 pe-0 fw-semibold">{dayOfWeekLabels[timeSlot.dayOfWeek]}:</div>
            <div className="col-lg-9">
              {timeSlot.startTime} - {timeSlot.endTime}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết lớp học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {classDetails ? (
          <div className="modal-body-details">
            <div className="row mb-3">
              <div className="col-4 fw-bold">Tên khóa học:</div>
              <div className="col-8">{classDetails.courseName}</div>
            </div>{" "}
            <div className="row mb-3">
              <div className="col-4 fw-bold">Huấn luyện viên:</div>
              <div className="col-8">{classDetails.trainerName}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Tổng số học viên:</div>
              <div className="col-8">{classDetails.maxStudents}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Tổng số buổi học:</div>
              <div className="col-8">{classDetails.numberOfSessions}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Trạng thái lớp học:</div>
              <div className="col-8">
                {renderStatusCustom(classDetails.status)}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Ngày bắt đầu:</div>
              <div className="col-8">{classDetails.startDate}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Ngày kết thúc:</div>
              <div className="col-8">{classDetails.endDate}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold">Lịch học:</div>
              <div className="col-8">
                {renderTimeSlotsCustom(classDetails.timeSlots)}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-4 fw-bold mb-3">Vé vào cổng:</div>
              <div className="col-12">
                {ticket ? (
                  SwimmingTicket({
                    ticketData: ticket,
                    studentName,
                    courseName: classDetails.courseName,
                  })
                ) : (
                  <span>Không có vé</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Thông tin chi tiết không có sẵn.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ClassModal;
