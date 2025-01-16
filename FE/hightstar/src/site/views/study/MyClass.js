import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import { UserContext } from "../../../contexts/UserContext";
import StudentService from "../../../admin/services/StudentService";
import ClassService from "../../../admin/services/ClassService";
import ClassModal from "./ClassModal";
import { formatDateToDMY } from "../../../admin/utils/FormatDate";

const MyClass = () => {
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const studentData = await StudentService.getStudentsByUserId(
          user.userId
        );
        setStudents(studentData);
        if (studentData.length > 0) {
          setActiveTab(studentData[0].id);
          const initialClasses = {};
          for (const student of studentData) {
            const classes = await ClassService.getEnrolledClassesByStudent(
              student.id
            );
            initialClasses[student.id] = classes;
          }
          setEnrolledClasses(initialClasses);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.userId) {
      fetchStudents();
    }
  }, [user]);

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  const handleRowClick = (classDetails) => {
    setSelectedClass(classDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const renderRowCustom = (statusData) => {
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
        style={{ fontSize: "13px" }}
      >
        {statusText}
      </span>
    );
  };

  return (
    <div className="bg-white p-3 p-md-5 " style={{ minHeight: "90vh" }}>
      <h2 className="text-center mb-4">Lớp học đã tham gia</h2>
      {isLoading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : students.length > 0 ? (
        <Tabs
          id="children-tabs"
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="mb-3 custom-tabs"
        >
          {students.map((student) => (
            <Tab
              eventKey={student.id}
              title={student.fullName || "Unnamed Student"}
              key={student.id}
            >
              {enrolledClasses[student.id]?.length > 0 ? (
                <div className="table-responsive col-12 p-0 custom-scrollbar">
                  <Table hover className="">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th>#</th>
                        <th className="text-nowrap">Tên khóa học</th>
                        <th className="text-nowrap">
                          Huấn luyện viên phụ trách
                        </th>
                        <th className="text-nowrap">Ngày bắt đầu</th>
                        <th className="text-nowrap">Ngày kết thúc</th>
                        <th className="text-nowrap">Trạng thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledClasses[student.id].map((cls, index) => (
                        <tr
                          key={cls.id}
                          onClick={() => handleRowClick(cls)}
                          className="table-row-hover"
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-nowrap">{index + 1}</td>
                          <td className="text-nowrap">{cls.courseName}</td>
                          <td className="text-nowrap">{cls.trainerName}</td>
                          <td className="text-nowrap">
                            {formatDateToDMY(cls.startDate)}
                          </td>
                          <td className="text-nowrap">
                            {formatDateToDMY(cls.endDate)}
                          </td>
                          <td className="text-nowrap">
                            {renderRowCustom(cls.status)}
                          </td>
                          <td className="text-center text-primary text-nowrap">
                            <i className="bi bi-card-list me-1"></i> Xem chi
                            tiết
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center mt-5">
                  Học viên này chưa tham gia bất kì lớp học nào!
                </p>
              )}
            </Tab>
          ))}
        </Tabs>
      ) : (
        <p className="text-center">Chưa tham gia bất kì lớp học nào!</p>
      )}

      <ClassModal
        show={showModal}
        onHide={handleCloseModal}
        classDetails={selectedClass}
        studentId={activeTab}
        studentName={
          students.find((student) => String(student.id) === String(activeTab))
            ?.fullName || "Không xác định"
        }
      />
    </div>
  );
};
export default MyClass;
