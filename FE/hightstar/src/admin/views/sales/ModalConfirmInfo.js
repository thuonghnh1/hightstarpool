import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const MultiStepModal = ({ show, onHide, invoiceData }) => {
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
  });
  const [errorFields, setErrorFields] = useState({});

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

  // Xử lý bước tiếp theo
  const handleContinue = () => {
    if (validateStep()) {
      // Lưu thông tin của bước hiện tại
      // Để lưu vào database bạn có thể gọi API ở đây
      console.log("Form Data at step " + currentStep, formData);

      // Chuyển sang bước tiếp theo
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Bước 3: Xác nhận thanh toán
        console.log("Final data: ", formData);
        // Thực hiện lưu dữ liệu vào cơ sở dữ liệu
      }
    }
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
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <h6 className="fw-bold text-success fs-5 mb-3">
            Thông tin người mua:
          </h6>
          <p>
            <strong>Họ và tên:</strong> {formData.buyerFullName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {formData.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Giới tính:</strong> {formData.buyerGender ? "Nam" : "Nữ"}
          </p>
        </div>

        <div className="col-md-6 mb-3">
          <h6 className="fw-bold text-success fs-5 mb-3">
            Thông tin học viên:
          </h6>
          <p>
            <strong>Họ và tên học viên:</strong> {formData.studentFullName}
          </p>
          <p>
            <strong>Biệt danh:</strong>{" "}
            {formData.nickname || "Chưa có biệt danh"}
          </p>
          <p>
            <strong>Tuổi:</strong> {formData.age}
          </p>
          <p>
            <strong>Giới tính:</strong> {formData.studentGender ? "Nam" : "Nữ"}
          </p>
          <p>
            <strong>Ghi chứ:</strong> {formData.note || "Không có"}
          </p>
        </div>
      </div>

      <div>
        <h6 className="fw-bold text-success fs-5 mb-3">
          Thông tin thanh toán:
        </h6>
        <p>
          <strong>Tổng tiền:</strong> 500.000đ
        </p>
        {/* Thanh toán bằng QR */}
        <div>
          <strong>Thanh toán bằng QR:</strong>
          <br />{" "}
          <span className="text-danger fst-italic">
            Vui lòng quét mã QR dưới đây để hoàn tất thanh toán.
          </span>
          <div className="d-flex justify-content-center mt-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                "Thanh toán 500.000 VND"
              )}&size=200x200`}
              alt="QR Code"
            />
          </div>
        </div>
      </div>
    </div>
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

export default MultiStepModal;
