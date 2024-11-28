import { useCallback, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SalesService from "../../services/SalesService";
import { toast } from "react-toastify";
import Select from "react-select";
import TimeSlotService from "../../services/TimeSlotService";
import TrainerService from "../../services/TrainerService";

const ModalConfirmInfo = ({ show, onHide, invoiceData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    buyerFullName: "",
    phoneNumber: "",
    email: "",
    buyerGender: true,
    studentFullName: "",
    studentGender: true,
    nickname: "",
    age: 0,
    note: "",
    timeSlots: [], // Mảng lưu các suất học được chọn
    trainerId: null,
  });
  const [errorFields, setErrorFields] = useState({});
  const [listTimeSlotOption, setListTimeSlotOption] = useState([]);
  const [listTrainerOption, setListTrainerOption] = useState([]);
  const [numSessionsPerWeek, setNumSessionsPerWeek] = useState(3); // Mặc định là 3 buổi học trong 1 tuần

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

  // Gọi API khi component mount
  useEffect(() => {
    const fetchTimeSlotData = async () => {
      try {
        let timeSlots = await TimeSlotService.getTimeSlots();

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
        toast.error("Lỗi khi lấy danh sách người dùng");
      }
    };
    fetchTimeSlotData();
  }, []);

  // Hàm kiểm tra tất cả timeSlotId đã được chọn
  const areAllTimeSlotsSelected = useCallback(() => {
    return (
      formData.timeSlots.length === numSessionsPerWeek &&
      formData.timeSlots.every((slotId) => { // Nếu bất kỳ phần tử nào không thỏa mãn, nó trả về false
        const slotStr = String(slotId); // Chuyển số thành chuỗi
        return slotStr.trim() !== ""; // Kiểm tra chuỗi không rỗng
      })
    );
  }, [formData.timeSlots, numSessionsPerWeek]);

  // Hàm gọi API lấy danh sách HLV dựa trên các suất học
  const fetchAvailableTrainers = useCallback(async () => {
    if (!areAllTimeSlotsSelected()) return; // Chỉ gọi API nếu đủ số suất học
    try {
      // Call API
      const trainers = await TrainerService.getAvailableTrainers(
        formData.timeSlots
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
  }, [formData.timeSlots, areAllTimeSlotsSelected]);

  // Gọi fetchAvailableTrainers mỗi khi timeSlots thay đổi
  useEffect(() => {
    if (areAllTimeSlotsSelected()) {
      fetchAvailableTrainers();
    }
  }, [formData.timeSlots, areAllTimeSlotsSelected, fetchAvailableTrainers]);

  // Hàm kiểm tra từng trường hợp lỗi
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "buyerFullName":
        if (!value || value.trim() === "") {
          error = "Tên người mua không được để trống.";
        } else if (/\d/.test(value)) {
          error = "Tên người mua không được chứa chữ số.";
        }
        break;
      case "phoneNumber":
        if (!value || !/^\d{10}$/.test(value)) {
          error = "Số điện thoại không hợp lệ.";
        }
        break;
      case "email":
        if (!value || value.trim() === "") {
          error = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ.";
        }
        break;
      case "studentFullName":
        if (!value || value.trim() === "") {
          error = "Tên học viên không được để trống.";
        } else if (/\d/.test(value)) {
          error = "Tên học viên không được chứa chữ số.";
        }
        break;
      case "age":
        if (value === "" || value === null) {
          error = "Tuổi không được để trống.";
        } else if (isNaN(value) || value < 1 || value > 100) {
          error = "Tuổi phải lớn hơn 0 và nhỏ hơn 100.";
        }
        break;
      case "note":
        if (value.length > 200) {
          error = "Ghi chú quá dài.";
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

  // Hàm kiểm tra tính hợp lệ của form
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      // Step 1: Kiểm tra các trường thông tin người mua
      if (!formData.buyerFullName || formData.buyerFullName.trim() === "") {
        newErrors.buyerFullName = "Tên người mua không được để trống.";
      } else if (/\d/.test(formData.buyerFullName)) {
        newErrors.buyerFullName = "Tên người mua không được chứa chữ số.";
      }

      if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
      }

      if (!formData.email || formData.email.trim() === "") {
        newErrors.email = "Email không được để trống.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
    }

    if (currentStep === 2) {
      // Step 2: Kiểm tra các trường thông tin học viên
      if (!formData.studentFullName || formData.studentFullName.trim() === "") {
        newErrors.studentFullName = "Tên học viên không được để trống.";
      } else if (/\d/.test(formData.studentFullName)) {
        newErrors.studentFullName = "Tên học viên không được chứa chữ số.";
      }
      if (formData.age === "" || formData.age === null) {
        newErrors.age = "Tuổi không được để trống.";
      } else if (
        isNaN(formData.age) ||
        formData.age < 1 ||
        formData.age > 100
      ) {
        newErrors.age = "Tuổi phải lớn hơn 0 và nhỏ hơn 100.";
      }
    }

    if (currentStep === 3) {
      // Step 3: Kiểm tra thông tin
      for (let i = 1; i <= numSessionsPerWeek; i++) {
        const key = `timeSlotId${i}`;
        if (!formData[key]) {
          newErrors[key] = `Vui lòng chọn suất học!`;
        }
      }
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
    console.log(formData);
  };

  // Hiển thị form theo từng bước
  const renderFormStep = () => {
    if (currentStep === 1) {
      return formBuyerInfo;
    }
    if (currentStep === 2) {
      return formStudentInfo;
    }
    if (currentStep === 3) {
      return confirmSignUp;
    }
    return null;
  };

  // Xử lý khi click bước tiếp theo
  const handleContinue = async () => {
    if (validateStep()) {
      console.log("Dữ liệu tại bước " + currentStep, formData);

      if (currentStep === 3) {
        try {
          const payload = {
            buyerInfo: {
              fullName: formData.buyerFullName,
              phoneNumber: formData.phoneNumber,
              email: formData.email,
              gender: formData.buyerGender ? "Nam" : "Nữ",
            },
            studentInfo: {
              fullName: formData.studentFullName,
              nickname: formData.nickname || null,
              age: formData.age,
              gender: formData.studentGender ? "Nam" : "Nữ",
              note: formData.note || null,
            },
            listTimeSlotId: formData.timeSlots, // Sử dụng mảng timeSlots đã chọn
            invoice: invoiceData, // Hóa đơn từ component cha
          };

          console.log("Payload gửi lên server: ", payload);

          // Gọi API
          const response = await SalesService.createInvoiceHaveCourse(payload);
          console.log("Đăng ký thành công: ", response);

          toast.success("Đăng ký thành công!");
          onHide();
        } catch (error) {
          console.error("Lỗi khi đăng ký: ", error);
          toast.error("Đăng ký thất bại. Vui lòng thử lại!");
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

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

    return Array.from({ length: numSessionsPerWeek }, (_, index) => (
      <div className={`${columnClass} mb-3`} key={index}>
        <Form.Group controlId={`formTimeSlot${index}`}>
          <Form.Label>
            Suất học {index + 1} <span className="text-danger">(*)</span>
          </Form.Label>
          <Select
            options={listTimeSlotOption}
            value={listTimeSlotOption.find(
              (option) => option.value === formData.timeSlots[index]
            )}
            onChange={(selectedOption) => {
              // Thay đổi trực tiếp trong mảng `timeSlots`
              const updatedTimeSlots = [...formData.timeSlots];
              updatedTimeSlots[index] = selectedOption
                ? selectedOption.value
                : "";
              handleInputChange("timeSlots", updatedTimeSlots);
            }}
            placeholder={`Chọn suất học ${index + 1}.`}
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

  const formBuyerInfo = (
    <>
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formBuyerFullName">
          <Form.Label>
            Họ và tên <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="buyerFullName"
            value={formData.buyerFullName}
            maxLength={100}
            onChange={(e) => handleInputChange("buyerFullName", e.target.value)}
            isInvalid={!!errorFields.buyerFullName}
            placeholder="VD: Nguyen Van A"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.buyerFullName}
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
            maxLength={100}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            isInvalid={!!errorFields.phoneNumber}
            placeholder="Nhập số điện thoại"
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
            onChange={(e) => handleInputChange("email", e.target.value)}
            isInvalid={!!errorFields.email}
            placeholder="Nhập địa chỉ email"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.email}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      {/* Giới Tính */}
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formBuyerGender">
          <Form.Label>
            Giới tính <span className="text-danger">(*)</span>
          </Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Nam"
              name="buyerGender"
              value="true"
              checked={formData.buyerGender === true}
              onChange={() => handleInputChange("buyerGender", true)}
              inline
              isInvalid={!!errorFields.buyerGender}
            />
            <Form.Check
              type="radio"
              label="Nữ"
              name="buyerGender"
              value="false"
              checked={formData.buyerGender === false}
              onChange={() => handleInputChange("buyerGender", false)}
              inline
              isInvalid={!!errorFields.buyerGender}
            />
          </div>
          {errorFields.buyerGender && (
            <div className="invalid-feedback d-block">
              {errorFields.buyerGender}
            </div>
          )}
        </Form.Group>
      </div>
    </>
  );

  const formStudentInfo = (
    <>
      {/* Họ Tên Học Viên */}
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formStudentFullName">
          <Form.Label>
            Họ Tên Học Viên <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="studentFullName"
            placeholder="Nhập họ tên học viên"
            value={formData.studentFullName}
            maxLength={50}
            onChange={(e) =>
              handleInputChange("studentFullName", e.target.value)
            }
            isInvalid={!!errorFields.studentFullName}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.studentFullName}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Biệt Danh */}
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formNickname">
          <Form.Label>Biệt Danh</Form.Label>
          <Form.Control
            type="text"
            name="nickname"
            placeholder="Nhập biệt danh"
            value={formData.nickname}
            maxLength={50}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            isInvalid={!!errorFields.nickname}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.nickname}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Tuổi */}
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formAge">
          <Form.Label>
            Tuổi <span className="text-danger">(*)</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="age"
            placeholder="Nhập tuổi"
            min={1}
            max={100}
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            isInvalid={!!errorFields.age}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.age}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Giới Tính */}
      <div className="col-md-6 mb-3">
        <Form.Group controlId="formStudentGender">
          <Form.Label>
            Giới tính <span className="text-danger">(*)</span>
          </Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Nam"
              name="studentGender"
              value="true"
              checked={formData.studentGender === true}
              onChange={() => handleInputChange("studentGender", true)}
              inline
              isInvalid={!!errorFields.studentGender}
            />
            <Form.Check
              type="radio"
              label="Nữ"
              name="studentGender"
              value="false"
              checked={formData.studentGender === false}
              onChange={() => handleInputChange("studentGender", false)}
              inline
              isInvalid={!!errorFields.studentGender}
            />
          </div>
          {errorFields.studentGender && (
            <div className="invalid-feedback d-block">
              {errorFields.studentGender}
            </div>
          )}
        </Form.Group>
      </div>

      {/* Ghi Chú */}
      <div className="col-md-12 mb-3">
        <Form.Group controlId="formNote">
          <Form.Label>Ghi Chú</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="note"
            placeholder="Nhập ghi chú"
            value={formData.note}
            maxLength={200}
            onChange={(e) => handleInputChange("note", e.target.value)}
            isInvalid={!!errorFields.note}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.note}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
    </>
  );

  const confirmSignUp = (
    <>
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
      <div className="col-12 mb-3">
        <Form.Group controlId="formTrainer">
          <Form.Label>
            Huấn luyện viên <span className="text-danger">(*)</span>
          </Form.Label>
          <Select
            options={listTrainerOption}
            value={listTrainerOption.find(
              (option) => option.value === formData.TrainerId
            )}
            onChange={(selectedOption) =>
              handleInputChange(
                "TrainerId",
                selectedOption ? selectedOption.value : ""
              )
            }
            placeholder="Vui lòng chọn HLV"
            isInvalid={!!errorFields.TrainerId}
            isClearable
            isSearchable
          />
          {errorFields.TrainerId && (
            <div className="invalid-feedback d-block">
              {errorFields.TrainerId}
            </div>
          )}
        </Form.Group>
      </div>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 p-4" closeButton>
        <Modal.Title className="d-flex align-items-center w-100 text-uppercase fw-bold fs-5">
          <div
            className="me-auto"
            onClick={() => setCurrentStep(currentStep > 1 && currentStep - 1)}
            style={{ left: "35px" }}
          >
            <i className="bi bi-arrow-left fs-3 text-muted"></i>
          </div>
          <div className="modal__title me-auto">
            {currentStep === 1
              ? "Điền thông tin người mua"
              : currentStep === 2
              ? "Điền thông tin học viên"
              : "Xác nhận đăng ký"}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3 px-4">
        <div className="row mb-3">{renderFormStep()}</div>
        <div className="w-100 text-center">
          <Button
            variant="success"
            className="mx-auto w-50 my-3 px-5 py-1 mx-2 fw-bold text-uppercase text-nowrap"
            onClick={handleContinue}
          >
            {currentStep === 3 ? "Xác Nhận" : "Tiếp theo"}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center w-100 pb-4">
          {/* Thanh tiến trình */}
          <div
            className="d-flex align-items-center w-100 position-relative"
            style={{ height: "30px" }}
          >
            {/* Bước 1 */}
            <div
              className="d-flex flex-column align-items-center position-relative"
              style={{ flex: 1 }}
            >
              <div
                className={`rounded-circle border border-3 ${
                  currentStep >= 1
                    ? "bg-success text-white"
                    : "bg-white text-success"
                }`}
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "1",
                }}
              >
                1
              </div>
              <div
                className={`border-top border-3 position-absolute ${
                  currentStep >= 2 ? "border-success" : "border-muted"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  width: "100%",
                  height: "2px",
                  zIndex: "0",
                }}
              ></div>
            </div>

            {/* Bước 2 */}
            <div
              className="d-flex flex-column align-items-center position-relative"
              style={{ flex: 1 }}
            >
              <div
                className={`rounded-circle border border-3 ${
                  currentStep >= 2
                    ? "bg-success text-white"
                    : "bg-white text-success"
                }`}
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "1",
                }}
              >
                2
              </div>
              <div
                className={`border-top border-3 position-absolute ${
                  currentStep >= 3 ? "border-success" : "border-muted"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  width: "100%",
                  height: "2px",
                  zIndex: "0",
                }}
              ></div>
            </div>

            {/* Bước 3 */}
            <div
              className="d-flex flex-column align-items-center position-relative"
              style={{ flex: 1 }}
            >
              <div
                className={`rounded-circle border border-3 ${
                  currentStep >= 3
                    ? "bg-success text-white"
                    : "bg-white text-success"
                }`}
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "1",
                }}
              >
                3
              </div>
            </div>
          </div>

          {/* Phần chữ bên dưới */}
          <div className="d-flex justify-content-between w-100 mt-1">
            <div className="text-center" style={{ flex: 1 }}>
              <small
                className={`${
                  currentStep >= 1 ? "text-success" : "text-muted"
                } fw-bold`}
              >
                THÔNG TIN NGƯỜI MUA
              </small>
            </div>
            <div className="text-center" style={{ flex: 1 }}>
              <small
                className={`${
                  currentStep >= 2 ? "text-success" : "text-muted"
                } fw-bold`}
              >
                THÔNG TIN HỌC VIÊN
              </small>
            </div>
            <div className="text-center" style={{ flex: 1 }}>
              <small
                className={`${
                  currentStep >= 3 ? "text-success" : "text-muted"
                } fw-bold`}
              >
                XÁC NHẬN ĐĂNG KÝ
              </small>
            </div>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmInfo;
