import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import TimeSlotService from "../../services/TimeSlotService";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";

const TimeSlotManagement = () => {
  // State để lưu trữ dữ liệu suất học từ API
  const [timeSlotData, setTimeSlotData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);
  const listDayOfWeekOption = [
    {
      value: "MONDAY",
      label: "Thứ Hai",
    },
    {
      value: "TUESDAY",
      label: "Thứ Ba",
    },
    {
      value: "WEDNESDAY",
      label: "Thứ Tư",
    },
    {
      value: "THURSDAY",
      label: "Thứ Năm",
    },
    {
      value: "FRIDAY",
      label: "Thứ Sáu",
    },
    {
      value: "SATURDAY",
      label: "Thứ Bảy",
    },
    {
      value: "SUNDAY",
      label: "Chủ Nhật",
    },
  ]; // Lưu danh sách thứ

  // Mảng cột của bảng
  const timeSlotColumns = [
    { key: "id", label: "ID" },
    { key: "dayOfWeek", label: "Ngày trong tuần" },
    { key: "startTime", label: "Thời gian bắt đầu" },
    { key: "endTime", label: "Thời gian kết thúc" },
  ];

  const defaultColumns = [...timeSlotColumns];

  // Gọi API để lấy dữ liệu từ server
  const fetchTimeSlotData = async () => {
    setLoadingPage(true);
    try {
      const data = await TimeSlotService.getTimeSlots();
      setTimeSlotData(data || []); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchTimeSlotData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "dayOfWeek":
        if (!value) {
          error = "Ngày trong tuần không được để trống.";
        }
        break;

      case "startTime":
        if (!value) {
          error = "Thời gian bắt đầu không được để trống.";
        }
        break;

      case "endTime":
        if (!value) {
          error = "Thời gian kết thúc không được để trống.";
        } else if (formData.startTime && value <= formData.startTime) {
          error = "Thời gian kết thúc phải sau thời gian bắt đầu.";
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

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.dayOfWeek) {
      newErrors.dayOfWeek = "Ngày trong tuần không được để trống.";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Thời gian bắt đầu không được để trống.";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Thời gian kết thúc không được để trống.";
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus, // Giữ lại các thuộc tính trước đó
      ...newStatus, // Cập nhật các thuộc tính mới
    }));
  };
  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng timeSlotService
        const updatedTimeSlot = await TimeSlotService.updateTimeSlot(
          formData.id,
          formData
        );

        // Cập nhật state timeSlotData với timeSlot đã được sửa
        const updatedTimeSlots = timeSlotData.map((timeSlot) =>
          timeSlot.id === updatedTimeSlot.id ? updatedTimeSlot : timeSlot
        );

        setTimeSlotData(updatedTimeSlots);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newTimeSlot = await TimeSlotService.createTimeSlot(formData);

        // Cập nhật mảng timeSlotData với item vừa được thêm
        setTimeSlotData([...timeSlotData, newTimeSlot]);

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

  // Hàm xóa một timeSlot
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      TimeSlotService.deleteTimeSlot(deleteId)
        .then(() => {
          setTimeSlotData(
            timeSlotData.filter((timeSlot) => timeSlot.id !== deleteId)
          );
          toast.success("Xóa thành công!");
        })
        .catch(() => {
          toast.error("Đã xảy ra lỗi khi xóa.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formDayOfweek">
            <Form.Label>
              Ngày trong tuần <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listDayOfWeekOption}
              value={listDayOfWeekOption.find(
                (option) => option.value === formData.dayOfWeek
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "dayOfWeek",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Vd: Thứ Hai"
              isInvalid={!!errorFields.dayOfWeek}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.dayOfWeek && (
              <div className="invalid-feedback d-block">
                {errorFields.dayOfWeek}
              </div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formStartTime">
            <Form.Label>
              Thời gian bắt đầu <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              isInvalid={!!errorFields.startTime}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.startTime}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formEndTime">
            <Form.Label>
              Thời gian kết thúc <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              isInvalid={!!errorFields.endTime}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.endTime}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý suất học - Hight Star</title>
      </Helmet>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={timeSlotColumns}
            data={timeSlotData}
            title={"Quản lý suất học"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default TimeSlotManagement;
