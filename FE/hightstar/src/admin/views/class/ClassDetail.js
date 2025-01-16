import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import ClassService from "../../services/ClassService";
import ModalAttendanceStudent from "./ModalAttendanceStudent";

const ClassDetail = ({ classId }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState({});

  useEffect(() => {
    if (classId) {
      fetchListEnrollmentByClassId(classId);
    }
  }, [classId]);

  const fetchListEnrollmentByClassId = async (classId) => {
    try {
      const data = await ClassService.getEnrollmentsByClassId(classId);
      setEnrollments(data);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy danh sách Enrollment", error);
    }
  };

  // Hàm mở Modal khi click
  const handleShowModal = (classId, studentId) => {
    setSelectedEnrollment({ classId, studentId });
    setShowModal(true);
  };
  console.log(selectedEnrollment);
  // Hàm đóng Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnrollment({});
  };

  return (
    <>
      <Helmet>
        <title>Quản lý lớp học - Hight Star</title>
      </Helmet>

      {/* Bảng hiển thị danh sách enrollment */}

      {enrollments.length === 0 ? (
        <p className="text-center p-3">
          Chưa có học viên nào tham gia lớp học!
        </p>
      ) : (
        <Table striped hover>
          <thead>
            <tr>
              <th>Mã vào lớp</th>
              <th>Mã học viên</th>
              <th>Tên học viên</th>
              {/* <th>Số buổi vắng</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((item) => (
              <tr
                key={item.enrollmentId}
                style={{ cursor: "pointer" }}
                onClick={() => handleShowModal(item.classId, item.studentId)}
              >
                <td>{item.enrollmentId}</td>
                <td>{item.studentId}</td>
                <td>{item.studentName}</td>
                {/* <td>{item.status}</td> */}
                <td className="text-center text-primary text-nowrap">
                  <i className="bi bi-card-list me-1"></i> Xem chi tiết
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal hiển thị điểm danh cho enrollment được chọn */}
      <ModalAttendanceStudent
        classId={selectedEnrollment.classId}
        studentId={selectedEnrollment.studentId}
        show={showModal}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default ClassDetail;
