import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SalesService from "../../services/SalesService";
import { toast } from "react-toastify";
import Invoice from "./Invoice";
import UserService from "../../services/UserService";
import StudentService from "../../services/StudentService";

const ModalConfirmInfo = ({
  show,
  onHide,
  invoiceData,
  cartItems,
  handleClearPage,
  printRef,
  selectedDiscount,
  buyer,
}) => {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (buyer && Object.keys(buyer).length !== 0) {
      setFormData((prev) => ({
        ...prev,
        buyerFullName: buyer.fullName,
        phoneNumber: buyer.phoneNumber,
        email: buyer.email,
      }));
      setCurrentStep(2);
    }
  }, [buyer]);

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

    if (currentStep === 1 && Object.keys(buyer).length === 0) {
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

  const clearForm = () => {
    setFormData({
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
  };

  const processInvoice = async (buyerData) => {
    try {
      // Gọi API tạo hóa đơn
      const orderResponse = await SalesService.createInvoice({
        ...invoiceData,
        order: {
          ...invoiceData.order,
          status: "PENDING",
          userId: Object.keys(buyer).length !== 0 ? buyer.id : buyerData.id,
        },
      });

      if (orderResponse && orderResponse.id) {
        const updatedInvoice = {
          ...invoiceData,
          order: {
            ...invoiceData.order,
            orderCode: orderResponse.id,
            userId: Object.keys(buyer).length !== 0 ? buyer.id : buyerData.id,
          },
        };

        // Render hóa đơn
        const invoiceComponent = (
          <Invoice
            buyer={buyerData}
            cartItems={cartItems}
            totalPrice={updatedInvoice.order.total}
            discount={selectedDiscount}
            date={new Date().toLocaleString()}
            invoiceCode={updatedInvoice.order.orderCode}
          />
        );

        // In hóa đơn
        if (printRef?.current) {
          await printRef.current.printInvoice(invoiceComponent);
        }

        toast.success("Thanh toán thành công!");
        handleClearPage(); // Xóa giỏ hàng
      } else {
        throw new Error("Không thể tạo hóa đơn!");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hóa đơn:", error);
      toast.error("Có lỗi xảy ra khi xử lý hóa đơn!");
    }
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
              gender: formData.buyerGender,
              role: "USER",
              status: "ACTIVE",
            },
            studentInfo: {
              fullName: formData.studentFullName,
              nickname: formData.nickname || null,
              age: formData.age,
              gender: formData.studentGender,
              note:
                `${formData.studentFullName} (${formData.age} Tuổi): ${formData.note}` ||
                `${formData.studentFullName} (${formData.age} Tuổi)`,
              userId: null || buyer.id,
            },
            invoice: invoiceData, // Hóa đơn từ component cha
          };

          // Gọi API
          setLoading(true);
          let createdUser = buyer;
          if (Object.keys(buyer).length === 0) {
            createdUser = await UserService.createUser(payload.buyerInfo);
            // tạo học viên
            if (createdUser) {
              await StudentService.createStudent({
                ...payload.studentInfo,
                userId: createdUser.id,
              });
            }
          } else {
            await StudentService.createStudent(payload.studentInfo);
          }

          toast.success("Đăng ký thông tin thành công!");
          processInvoice(createdUser); // in hóa đơn
          clearForm();
          onHide();
        } catch (error) {
          console.error("Lỗi khi đăng ký: ", error);
          toast.error("Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentStep(currentStep + 1);
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
            disabled={Object.keys(buyer).length !== 0}
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
            disabled={Object.keys(buyer).length !== 0}
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
            disabled={Object.keys(buyer).length !== 0}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.email}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      {/* Giới Tính */}
      {Object.keys(buyer).length === 0 && (
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
      )}
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

  const confirmSignUp = <></>;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 p-4" closeButton>
        <Modal.Title className="d-flex align-items-center w-100 text-uppercase fw-bold fs-5">
          <div
            className="me-auto"
            onClick={() =>
              setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep)
            }
            style={{ left: "35px" }}
          >
            <i
              className={`bi bi-arrow-left fs-3 text-muted ${
                currentStep === 1 && "opacity-50"
              }`}
            ></i>
          </div>
          <div className="modal__title me-auto">
            {currentStep === 1
              ? "Điền thông tin người mua"
              : currentStep === 2
              ? "Điền thông tin học viên"
              : "Xác nhận thanh toán"}
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
            {loading
              ? "Đang xử lý..."
              : currentStep === 3
              ? "Xác Nhận"
              : "Tiếp theo"}
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
                XÁC NHẬN THANH TOÁN
              </small>
            </div>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmInfo;
