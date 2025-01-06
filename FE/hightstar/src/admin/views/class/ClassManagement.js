import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import ClassService from "../../services/ClassService";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import { formatDateToDMY, formatDateToISO } from "../../utils/FormatDate";
import CourseService from "../../services/CourseService";
import TimeSlotService from "../../services/TimeSlotService";

const ClassManagement = () => {
  // State lưu data từ API
  const [classData, setClassData] = useState([]);
  const [formData, setFormData] = useState({ timeSlots: [] });
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  const [listCourseOption, setListCourseOption] = useState([]);
  const [listTrainerOption, setListTrainerOption] = useState([]);
  const [listTimeSlotOption, setListTimeSlotOption] = useState([]);
  const [numSessionsPerWeek, setNumSessionsPerWeek] = useState(3); // Mặc định là 3 buổi học trong 1 tuần

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  const handelChangeDayOfWeek = (dayOfWeek) => {
    const dayLabels = {
      MONDAY: "Thứ Hai",
      TUESDAY: "Thứ Ba",
      WEDNESDAY: "Thứ Tư",
      THURSDAY: "Thứ Năm",
      FRIDAY: "Thứ Sáu",
      SATURDAY: "Thứ Bảy",
      SUNDAY: "Chủ Nhật",
    };
    return dayLabels[dayOfWeek];
  };

  // Mảng cột của bảng
  const classColumns = [
    { key: "id", label: "ID" },
    { key: "courseName", label: "Khóa học" },
    { key: "trainerName", label: "Huấn luyện viên" },
    { key: "startDate", label: "Ngày bắt đầu" },
    { key: "endDate", label: "Ngày kết thúc" },
    { key: "maxStudents", label: "Số học viên tối đa" },
    { key: "numberOfSessions", label: "Tổng buổi học" },
    { key: "progress", label: "Tiến trình" },
    { key: "status", label: "Trạng thái" },
    { key: "timeSlots", label: "Lịch học" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi classColumns
  const keysToRemove = ["startDate", "endDate", "timeSlots"];
  const defaultColumns = classColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Lấy dữ liệu từ API
  const fetchClassData = useCallback(async () => {
    setLoadingPage(true);
    try {
      const data = await ClassService.getClasses();
      setClassData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      const courses = await CourseService.getCourses();
      const courseOptions = courses.map((course) => ({
        value: course.id,
        label: course.courseName,
      }));
      setListCourseOption(courseOptions);

      const timeSlots = await TimeSlotService.getTimeSlots();

      // Chuyển đổi danh sách thành định dạng phù hợp cho Select
      const timeSlotOptions = timeSlots.map((timeSlot) => ({
        value: timeSlot.id,
        label: `#${timeSlot.id}: ${handelChangeDayOfWeek(
          timeSlot.dayOfWeek
        )} (${timeSlot.startTime} - ${timeSlot.endTime})`, // label có định dạng vd: #1: Thứ Hai (6:00 - 7:00)
      }));

      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListTimeSlotOption(timeSlotOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách khóa học hoặc huấn luyện viên");
    }
  }, []);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "courseId":
        if (!value) {
          error = "Khóa học không được để trống.";
        }
        break;
      case "trainerId":
        if (!value) {
          error = "Huấn luyện viên không được để trống.";
        }
        break;
      case "startDate":
        if (!value) {
          error = "Ngày bắt đầu không được để trống.";
        }
        break;
      case "endDate":
        if (!value) {
          error = "Ngày kết thúc không được để trống.";
        } else if (new Date(value) < new Date(formData.startDate)) {
          error = "Ngày kết thúc phải sau ngày bắt đầu.";
        }
        break;
      case "maxStudents":
        if (!value || value <= 0) {
          error = "Số học viên tối đa phải lớn hơn 0.";
        }
        break;
      default:
        break;
    }
    setErrorFields((prevErrors) => ({
      ...prevErrors,
      [key]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra các trường cơ bản
    if (!formData.courseId) {
      newErrors.courseId = "Khóa học không được để trống.";
    }
    if (!formData.trainerId) {
      newErrors.trainerId = "Huấn luyện viên không được để trống.";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống.";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống.";
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    }
    if (!formData.maxStudents || formData.maxStudents <= 0) {
      newErrors.maxStudents = "Số học viên tối đa phải lớn hơn 0.";
    }

    if (
      !formData.timeSlots ||
      formData.timeSlots.length !== numSessionsPerWeek || // Kiểm tra đủ số suất học
      formData.timeSlots.some((slot) => !slot) // Kiểm tra các giá trị không hợp lệ (bị null, undefined, "")
    ) {
      newErrors.timeSlots = "Vui lòng chọn đầy đủ và không trùng suất học!";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
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
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 1); // Tính ngày kết thúc, 1 tháng sau ngày hiện tại

    // Đặt các giá trị mặc định vào formData
    setFormData({
      courseId: "",
      trainerId: "",
      startDate: currentDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      maxStudents: 0,
      timeSlots: [],
    });

    setErrorFields({});
    handleResetStatus();
  };

  const handleEdit = (item) => {
    const updatedFormData = {
      ...item,
      timeSlots: item.timeSlots.map((slot) => slot.id), // Chỉ lấy id để lưu vào formData.timeSlots
      startDate: formatDateToISO(item.startDate),
      endDate: formatDateToISO(item.endDate),
    };

    setFormData(updatedFormData);
    setNumSessionsPerWeek(item.timeSlots.length); // Cập nhật số buổi học trong tuần
    setStatusFunction({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updatedClass = await ClassService.updateClass(formData.id, {
          ...formData,
          timeSlotIds: formData.timeSlots, // đổi tên để khớp với api
        });
        const formattedClass = {
          ...updatedClass,
          startDate: formatDateToDMY(updatedClass.startDate),
          endDate: formatDateToDMY(updatedClass.endDate),
        };

        const updatedClasses = classData.map((classItem) =>
          classItem.id === formattedClass.id ? formattedClass : classItem
        );
        setClassData(updatedClasses);
        toast.success("Cập nhật lớp học thành công!");
      } else if (statusFunction.isAdd) {
        const createdClass = await ClassService.createClass({
          ...formData,
          timeSlotIds: formData.timeSlots, // đổi tên để khớp với api
        });
        const formattedClass = {
          ...createdClass,
          startDate: formatDateToDMY(createdClass.startDate),
          endDate: formatDateToDMY(createdClass.endDate),
        };
        setClassData([...classData, formattedClass]);
        toast.success("Thêm mới lớp học thành công!");
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
      await ClassService.deleteClass(deleteId);
      setClassData(classData.filter((classItem) => classItem.id !== deleteId));
      toast.success("Xóa lớp học thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa lớp học.");
    } finally {
      setIsLoading(false);
    }
  };

  // _____________START TIMESLOT______________

  // Hàm kiểm tra tất cả timeSlotId đã được chọn
  const areAllTimeSlotsSelected = useCallback(() => {
    return (
      formData.timeSlots?.length === numSessionsPerWeek &&
      formData.timeSlots.every((slotId) => {
        // Nếu bất kỳ phần tử nào không thỏa mãn, nó trả về false
        const slotStr = String(slotId); // Chuyển số thành chuỗi
        return slotStr.trim() !== ""; // Kiểm tra chuỗi không rỗng
      })
    );
  }, [formData.timeSlots, numSessionsPerWeek]);

  // Hàm gọi API lấy danh sách HLV dựa trên các suất học và ngày bắt đầu
  const fetchAvailableTrainers = useCallback(async () => {
    if (!areAllTimeSlotsSelected()) return; // Chỉ gọi API nếu đủ số suất học

    try {
      // Kiểm tra formData.id, nếu không có thì gán giá trị mặc định (null)(Khi thêm mới)
      const classId = formData.id || null;

      // Call API
      const trainers = await ClassService.getAvailableTrainers(
        formData.timeSlots,
        classId,
        formData.startDate
      );

      // Chuyển đổi danh sách thành định dạng phù hợp cho Select
      const trainerOptions = trainers.map((trainer) => ({
        value: trainer.id,
        label: `#${trainer.id} - ${trainer.fullName}`, // label có định dạng: #1 - Nguyễn Văn A
      }));

      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListTrainerOption(trainerOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách HLV!");
    }
  }, [
    formData.timeSlots,
    formData.id,
    formData.startDate,
    areAllTimeSlotsSelected,
  ]);

  // Gọi fetchAvailableTrainers mỗi khi timeSlots thay đổi
  useEffect(() => {
    fetchAvailableTrainers();
  }, [
    formData.timeSlots,
    areAllTimeSlotsSelected,
    fetchAvailableTrainers,
    formData.startDate,
  ]);

  // Hàm xử lý thay đổi số buổi học
  const handleNumSessionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumSessionsPerWeek(value);
  };

  const renderTimeSlotInputs = () => {
    // Tính toán lớp cột dựa trên số buổi học trong tuần
    const columnClass =
      numSessionsPerWeek === 1
        ? "col-12"
        : numSessionsPerWeek % 2 === 0
        ? "col-md-6"
        : "col-md-4";

    // Hàm tạo danh sách options loại bỏ các suất học đã chọn để tránh trùng lặp
    const getAvailableTimeSlots = (currentIndex) => {
      const selectedSlots = formData.timeSlots.filter(
        (_, idx) => idx !== currentIndex
      ); // Lấy danh sách đã chọn trừ index hiện tại
      return listTimeSlotOption.filter(
        (option) => !selectedSlots.includes(option.value) // Loại bỏ các giá trị đã chọn
      );
    };

    return Array.from({ length: numSessionsPerWeek }, (_, index) => (
      <div className={`${columnClass} mb-3`} key={index}>
        <Form.Group controlId={`formTimeSlot${index}`}>
          <Form.Label>
            Suất học {index + 1} <span className="text-danger">(*)</span>
          </Form.Label>
          <Select
            options={getAvailableTimeSlots(index)} // Cập nhật options cho Select
            value={listTimeSlotOption.find(
              (option) => option.value === formData.timeSlots[index]
            )}
            onChange={(selectedOption) => {
              const updatedTimeSlots = [...formData.timeSlots];
              updatedTimeSlots[index] = selectedOption
                ? selectedOption.value
                : "";
              handleInputChange("timeSlots", updatedTimeSlots);
            }}
            placeholder={`Chọn suất học ${index + 1}`}
            isInvalid={!!errorFields.timeSlots}
            isClearable
            isSearchable
          />
          {errorFields.timeSlots && (
            <div className="invalid-feedback d-block">
              {errorFields.timeSlots}
            </div>
          )}
        </Form.Group>
      </div>
    ));
  };

  // _____________END TIMESLOT______________

  const modalContent = (
    <div className="row">
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formCourse">
          <Form.Label>
            Khóa học <span className="text-danger">(*)</span>
          </Form.Label>
          <Select
            options={listCourseOption}
            value={listCourseOption.find(
              (option) => option.value === formData.courseId
            )}
            onChange={(selectedOption) =>
              handleInputChange(
                "courseId",
                selectedOption ? selectedOption.value : ""
              )
            }
            placeholder="Chọn khóa học"
            isInvalid={!!errorFields.courseId}
            isClearable
            isSearchable
          />
          {errorFields.courseId && (
            <div className="invalid-feedback d-block">
              {errorFields.courseId}
            </div>
          )}
        </Form.Group>
      </div>
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formMaxStudents">
          <Form.Label>
            Số học viên tối đa <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleInputChange("maxStudents", e.target.value)}
            isInvalid={!!errorFields.maxStudents}
          />
          {errorFields.maxStudents && (
            <div className="invalid-feedback d-block">
              {errorFields.maxStudents}
            </div>
          )}
        </Form.Group>
      </div>
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formStartDate">
          <Form.Label>
            Ngày bắt đầu <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            isInvalid={!!errorFields.startDate}
          />
          {errorFields.startDate && (
            <div className="invalid-feedback d-block">
              {errorFields.startDate}
            </div>
          )}
        </Form.Group>
      </div>
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formEndDate">
          <Form.Label>
            Ngày kết thúc <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            isInvalid={!!errorFields.endDate}
          />
          {errorFields.endDate && (
            <div className="invalid-feedback d-block">
              {errorFields.endDate}
            </div>
          )}
        </Form.Group>
      </div>
      {/* Ô chọn số lượng buổi học */}
      <div className="col-12 mb-3">
        <Form.Group controlId="formNumSessions">
          <Form.Label>
            Số buổi học / tuần <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Select
            value={numSessionsPerWeek}
            onChange={handleNumSessionsChange}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} buổi
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      {/* Render các ô chọn suất học */}
      {renderTimeSlotInputs()}
      {/* Ô chọn HLV */}
      {formData.timeSlots?.length === numSessionsPerWeek && (
        <div className="col-12 mb-3">
          <Form.Group controlId="formTrainer">
            <Form.Label>
              Huấn luyện viên <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listTrainerOption}
              value={listTrainerOption.find(
                (option) => option.value === formData.trainerId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "trainerId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Vui lòng chọn HLV"
              isInvalid={!!errorFields.trainerId}
              isClearable
              isSearchable
            />
            {errorFields.trainerId && (
              <div className="invalid-feedback d-block">
                {errorFields.trainerId}
              </div>
            )}
          </Form.Group>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý lớp học - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <TableManagement
            data={classData}
            columns={classColumns}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            title={"Quản lý lớp học"}
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

export default ClassManagement;
