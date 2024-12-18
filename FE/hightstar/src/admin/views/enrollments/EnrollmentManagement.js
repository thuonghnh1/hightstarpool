import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import EnrollmentService from "../../services/EnrollmentService";
import Page500 from "../../../common/pages/Page500";
import Select from "react-select";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";

const EnrollmentManagement = () => {
  // State để lưu trữ danh sách đăng ký học viên từ API
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa
  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  const [listStudentOption, setListStudentOption] = useState([]);
  const [listClassOption, setListClassOption] = useState([]);

  // Các nút hiển thị trên Table
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  // Cột hiển thị trên bảng quản lý
  const enrollmentColumns = [
    { key: "id", label: "ID" },
    { key: "classId", label: "Mã lớp học" },
    { key: "courseName", label: "Tên khóa học" },
    { key: "studentName", label: "Tên học viên" },
    { key: "status", label: "Trạng thái" },
    { key: "timeSlots", label: "Lịch học" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi enrollmentColumns
  const keysToRemove = ["timeSlots"];
  const defaultColumns = enrollmentColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API lấy dữ liệu từ server
  const fetchEnrollmentData = async () => {
    setLoadingPage(true);
    try {
      const data = await EnrollmentService.getEnrollments();
      setEnrollmentData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      const students = await EnrollmentService.getStudentsNotEnroll();
      // Chuyển đổi danh sách học viên đã lọc thành định dạng phù hợp cho Select
      if (students.length === 0) {
        return;
      }
      const studentOptions = students.map((student) => ({
        value: student.id,
        label: `#${student.id} - ${student.fullName}`,
      }));
      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListStudentOption(studentOptions);
    } catch (error) {
      console.log(error);
    }

    try {
      const classes = await EnrollmentService.getAvailableClasses(null); // mặc định khi tạo mới sẽ lấy tất cả khóa học chưa bắt đầu
      if (classes.length === 0) {
        return;
      }
      const classEntityOptions = classes.map((classEntity) => ({
        value: classEntity.id,
        label: `#${classEntity.id} - (${classEntity.trainerName}) - ${classEntity.courseName}`,
      }));

      setListClassOption(classEntityOptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "studentId":
        if (!value) error = "ID học viên không được để trống.";
        break;
      case "classId":
        if (!value) error = "ID lớp học không được để trống.";
        break;
      default:
        break;
    }
    setErrorFields((prevErrors) => ({ ...prevErrors, [key]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId)
      newErrors.studentId = "ID học viên không được để trống.";
    if (!formData.classId)
      newErrors.classId = "ID lớp học không được để trống.";
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus,
      ...newStatus,
    }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      studentId: "",
      classId: "",
      status: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  const handleEdit = async (item) => {
    setFormData({ ...item });
    updateStatus({ isEditing: true });
    setErrorFields({});
    try {
      const classes = await EnrollmentService.getAvailableClasses(item.id); // lấy thêm class cho enroll hiện tại nếu nó ở trạng thái khác
      if (classes.length === 0) {
        return;
      }
      const classEntityOptions = classes.map((classEntity) => ({
        value: classEntity.id,
        label: `#${classEntity.id} - (${classEntity.trainerName}) - ${classEntity.courseName}`,
      }));

      setListClassOption(classEntityOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        const updatedEnrollment = await EnrollmentService.updateEnrollment(
          formData.id,
          formData
        );
        const updatedData = enrollmentData.map((enrollment) =>
          enrollment.id === updatedEnrollment.id
            ? updatedEnrollment
            : enrollment
        );
        setEnrollmentData(updatedData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const newEnrollment = await EnrollmentService.createEnrollment(
          formData
        );
        setEnrollmentData([...enrollmentData, newEnrollment]);
        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await EnrollmentService.deleteEnrollment(deleteId);
      setEnrollmentData((prevData) =>
        prevData.filter((enrollment) => enrollment.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className={`col-md-12} mb-3`}>
          <Form.Group controlId="formStudentId">
            <Form.Label>
              Mã học viên <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listStudentOption}
              value={listStudentOption.find(
                (option) => option.value === formData.studentId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "studentId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn học viên"
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
            />
            {errorFields.studentId && (
              <div className="invalid-feedback d-block">
                {errorFields.studentId}
              </div>
            )}
          </Form.Group>
        </div>
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formClassId">
            <Form.Label>
              Mã lớp học <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listClassOption}
              value={listClassOption.find(
                (option) => option.value === formData.classId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "classId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn lớp học"
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
            />
            {errorFields.classId && (
              <div className="invalid-feedback d-block">
                {errorFields.classId}
              </div>
            )}
          </Form.Group>
        </div>
        {statusFunction.isEditing && (
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formStatus">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                label={
                  formData.status !== "WITHDRAWN"
                    ? "Bình thường"
                    : "Đã nghỉ học"
                }
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.checked ? "IN_PROGRESS" : "WITHDRAWN"
                  )
                }
                checked={formData.status !== "WITHDRAWN"}
              />
            </Form.Group>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản Lý Đăng Ký Lớp Học - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <TableManagement
            columns={enrollmentColumns}
            data={enrollmentData}
            title={"Quản Lý Đăng Ký Lớp Học"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            buttonCustom={button}
          />
        </section>
      )}
    </>
  );
};

export default EnrollmentManagement;
