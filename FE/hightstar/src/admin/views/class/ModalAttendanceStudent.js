import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import AttendanceService from "../../services/AttendanceService";

const ModalAttendanceStudent = ({ classId, studentId, show, handleClose }) => {
  const [sessionAttendances, setSessionAttendances] = useState([]);

  useEffect(() => {
    if (classId && studentId && show) {
      fetchSessionAttendanceForStudent(classId, studentId);
    }
  }, [classId, studentId, show]);

  const fetchSessionAttendanceForStudent = async (classId, studentId) => {
    try {
      const data = await AttendanceService.getSessionAttendanceForStudent(
        classId,
        studentId
      );
      setSessionAttendances(data);
    } catch (error) {
      console.error("Có lỗi khi lấy thông tin Attendance:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết điểm danh học viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sessionAttendances.length === 0 ? (
          <p className="text-center p-3">Chưa có phiên học nào được bắt đầu!</p>
        ) : (
          <Table hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày học</th>
                <th className="text-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {sessionAttendances.map((sa) => (
                <tr key={sa.sessionId}>
                  <td className="col-3">{sa.sessionId}</td>
                  <td>{sa.sessionDate}</td>
                  <td className="col-3 text-nowrap">
                    {sa.present === null ? (
                      <>
                        <i class="bi bi-backpack2 text-primary me-1"></i> Chưa
                        học
                      </>
                    ) : sa.present ? (
                      <>
                        <i class="bi bi-check-circle text-success me-1"></i> Có
                        mặt
                      </>
                    ) : (
                      <>
                        <i class="bi bi-x-circle text-danger me-1"></i> Vắng mặt
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalAttendanceStudent;
