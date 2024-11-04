import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import trainerService from "../../services/TrainerService"; // Cập nhật lại tên service
import Page500 from "../pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const TrainerManagement = () => {
  const [trainerData, setTrainerData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const trainerColumns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Họ và Tên" },
    { key: "phoneNumber", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "specialty", label: "Chuyên môn" },
    { key: "experienceYears", label: "Kinh nghiệm (năm)" },
    { key: "schedule", label: "Lịch Trình" },
    { key: "rating", label: "Đánh giá TB" },
    { key: "status", label: "Trạng thái" },
    { key: "userId", label: "Mã người dùng" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi trainerColumns
  const keysToRemove = ["email", "phoneNumber", "userId", "specialty"];
  const defaultColumns = trainerColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchTrainerData = async () => {
    setLoadingPage(true);
    try {
      const data = await trainerService.getTrainers();
      setTrainerData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "fullName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;
      case "phoneNumber":
        if (!value || !/^\d{10}$/.test(value)) {
          // kiểm tra số điện thoại có 10 chữ số
          error = "Số điện thoại không hợp lệ.";
        }
        break;
      case "specialty":
        if (!value || value.trim() === "") {
          error = "Chuyên môn không được để trống.";
        }
        break;
      case "experienceYears":
        if (!value || isNaN(value) || value < 0 || value > 100) {
          // giới hạn từ 0 đến 100
          error = "Số năm kinh nghiệm không hợp lệ.";
        }
        break;
      case "schedule":
        if (!value || value.trim() === "") {
          error = "Lịch trình không được để trống.";
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

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Tên không được để trống.";
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }
    if (
      !formData.email ||
      !/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.specialty || formData.specialty.trim() === "") {
      newErrors.specialty = "Chuyên môn không được để trống.";
    }
    if (
      !formData.experienceYears ||
      isNaN(formData.experienceYears) ||
      formData.experienceYears < 0 ||
      formData.experienceYears > 100
    ) {
      newErrors.experienceYears = "Số năm kinh nghiệm không hợp lệ.";
    }
    if (!formData.schedule || formData.schedule.trim() === "") {
      newErrors.schedule = "Lịch trình không được để trống.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: true,
      specialty: "",
      experienceYears: "0",
      schedule: "",
      status: "ACTIVE",
    });
    setIsEditing(false);
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (isEditing) {
        const updatedTrainer = await trainerService.updateTrainer(
          formData.id,
          formData
        );
        const updatedTrainers = trainerData.map((trainer) =>
          trainer.id === updatedTrainer.id ? updatedTrainer : trainer
        );
        setTrainerData(updatedTrainers);
        toast.success("Cập nhật thành công!");
      } else {
        const newTrainer = await trainerService.createTrainer(formData);
        setTrainerData([...trainerData, newTrainer]);
        toast.success("Thêm mới thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data + "!"); // Hiển thị thông điệp lỗi
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau !"); // Thông báo lỗi chung
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      trainerService
        .deleteTrainer(deleteId)
        .then(() => {
          setTrainerData(
            trainerData.filter((trainer) => trainer.id !== deleteId)
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
          <Form.Group controlId="formFullName">
            <Form.Label>
              Họ và tên <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              maxLength={100}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              isInvalid={!!errorFields.fullName}
              placeholder="VD: Nguyen Van A"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.fullName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>
              Số điện thoại <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              maxLength={15}
              onChange={(e) =>
                handleInputChange("phoneNumber", e.target.value.trim())
              }
              isInvalid={!!errorFields.phoneNumber}
              placeholder="Nhập vào SĐT"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formEmail">
            <Form.Label>
              Email <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("email", e.target.value.trim())
              }
              isInvalid={!!errorFields.email}
              placeholder="Nhập vào email"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.email}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formGender">
            <Form.Label>Giới tính</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Nam"
                name="gender"
                value="true"
                checked={formData.gender === true}
                onChange={() => handleInputChange("gender", true)}
                inline
                isInvalid={!!errorFields.gender}
              />
              <Form.Check
                type="radio"
                label="Nữ"
                name="gender"
                value="false"
                checked={formData.gender === false}
                onChange={() => handleInputChange("gender", false)}
                inline
                isInvalid={!!errorFields.gender}
              />
            </div>
            {errorFields.gender && (
              <div className="invalid-feedback d-block">
                {errorFields.gender}
              </div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formSpecialty">
            <Form.Label>
              Chuyên môn <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={(e) => handleInputChange("specialty", e.target.value)}
              isInvalid={!!errorFields.specialty}
              placeholder="VD: HLV bơi lội, ..."
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.specialty}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formExperienceYears">
            <Form.Label>
              Số năm kinh nghiệm <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="experienceYears"
              min="0"
              max="90"
              value={formData.experienceYears}
              onChange={(e) =>
                handleInputChange("experienceYears", e.target.value)
              }
              isInvalid={!!errorFields.experienceYears}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.experienceYears}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formSchedule">
            <Form.Label>
              Lịch trình <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange("schedule", e.target.value)}
              isInvalid={!!errorFields.schedule}
              placeholder="VD: Cả tuần (6h-18h)"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.schedule}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formSchedule">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={
                formData.status && formData.status.includes("ACTIVE")
                  ? "Hoạt động"
                  : "Vô hiệu hóa"
              }
              onChange={(e) =>
                handleInputChange(
                  "status",
                  e.target.checked ? "ACTIVE" : "DISABLED"
                )
              }
              checked={formData.status === "ACTIVE"}
            />
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý Huấn luyện viên - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <TableManagement
          columns={trainerColumns}
          data={trainerData}
          title={"Quản lý huấn luyện viên"}
          defaultColumns={defaultColumns}
          modalContent={modalContent}
          isEditing={isEditing}
          handleReset={handleReset}
          onEdit={handleEdit}
          handleSaveItem={handleSaveItem}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default TrainerManagement;
