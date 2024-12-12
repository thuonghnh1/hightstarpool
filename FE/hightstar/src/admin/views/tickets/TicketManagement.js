import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import TicketService from "../../services/TicketService";
import Page500 from "../../../common/pages/Page500";
import {
  formatDateTimeLocal,
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../utils/FormatDate";
import { Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import studentService from "../../services/StudentService";
import SalesService from "../../services/SalesService";
import { NumericFormat } from "react-number-format";
import TicketPriceModal from "./TicketPriceModal";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TicketPriceService from "../../services/TicketPriceService";

// Khai báo các plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const TicketManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [ticketData, setTicketData] = useState([]);
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
  const [listStudentOption, setListStudentOption] = useState([]);
  const [showModalTicketPrice, setShowModalTicketPrice] = useState(false);
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: true,
  };
  const listTicketTypeOption = [
    {
      value: "ONETIME_TICKET",
      label: "Vé một lần",
    },
    {
      value: "WEEKLY_TICKET",
      label: "Vé tuần",
    },
    {
      value: "MONTHLY_TICKET",
      label: "Vé tháng",
    },
    {
      value: "STUDENT_TICKET",
      label: "Vé học viên",
    },
  ];

  // Mảng cột của bảng
  const ticketColumns = [
    { key: "id", label: "ID" },
    { key: "qrCodeBase64", label: "Mã QR" },
    { key: "issueDate", label: "Ngày Phát Hành" },
    { key: "expiryDate", label: "Ngày Hết Hạn" },
    { key: "ticketType", label: "Loại Vé" },
    { key: "status", label: "Trạng thái" },
    { key: "price", label: "Giá Vé" },
    { key: "studentId", label: "Mã Học Viên" },
  ];

  // Loại bỏ cột khỏi ticketColumns
  const defaultColumns = ticketColumns.filter(
    (column) => column.key !== "price"
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchTicketData = async () => {
    setLoadingPage(true);
    try {
      const data = await TicketService.getTickets();
      setTicketData(data);
    } catch (err) {
      setErrorServer(err.message);
      console.log(err);
    } finally {
      setLoadingPage(false);
    }

    try {
      const students = await studentService.getStudents();
      // Chuyển đổi danh sách học viên đã lọc thành định dạng phù hợp cho Select
      if (students.length === 0) { return; }
      const studentOptions = students.map((student) => ({
        value: student.id,
        label: `#${student.id} - ${student.fullName}`,
      }));
      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListStudentOption(studentOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTicketPriceByTicketTypeData = async (ticketType) => {
    try {
      const price = await TicketPriceService.getTicketPriceByTicketType(
        ticketType
      );
      return price;
    } catch (error) {
      return "";
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchTicketData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "issueDate":
        if (!value) {
          error = "Ngày phát hành không được để trống.";
        }
        break;

      case "expiryDate":
        if (!value) {
          error = "Ngày hết hạn không được để trống.";
        } else if (new Date(value) < new Date(formData.issueDate)) {
          error = "Ngày hết hạn phải sau ngày phát hành.";
        }
        break;

      case "ticketType":
        if (!value) {
          error = "Loại vé không được để trống.";
        }
        break;

      case "price":
        if (value === "" || value === null) {
          error = "Vui lòng đợi hệ thống cập nhật giá vé.";
        } else if (isNaN(value) || value < 0) {
          error = "Giá vé phải là một số và không âm.";
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

    if (!formData.issueDate) {
      newErrors.issueDate = "Ngày phát hành không được để trống.";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Ngày hết hạn không được để trống.";
    } else if (new Date(formData.expiryDate) < new Date(formData.issueDate)) {
      newErrors.expiryDate = "Ngày hết hạn phải sau ngày phát hành.";
    }

    if (!formData.ticketType || formData.ticketType.trim() === "") {
      newErrors.ticketType = "Loại vé không được để trống.";
    }

    if (formData.ticketType === "STUDENT_TICKET" && !formData.studentId) {
      newErrors.studentId = "Mã học viên không được để khống.";
    }

    if (statusFunction.isEditing) {
      if (formData.price === "" || formData.price === null) {
        newErrors.price = "Giá vé không được để trống.";
      } else if (isNaN(formData.price) || formData.price < 0) {
        newErrors.price = "Giá vé phải là một số và không âm.";
      }
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateExpiryDate = (issueDate, ticketType) => {
    // Chuyển đổi input datetime-local thành đối tượng Date
    const date = new Date(issueDate);

    if (ticketType === "ONETIME_TICKET") {
      date.setHours(23, 59, 59, 999); // Cộng thêm giờ để hết ngày hiện tại
    } else if (ticketType === "WEEKLY_TICKET") {
      date.setDate(date.getDate() + 7); // Cộng thêm 7 ngày
    } else if (ticketType === "MONTHLY_TICKET") {
      date.setMonth(date.getMonth() + 1); // Cộng thêm 1 tháng
    } else if (ticketType === "STUDENT_TICKET") {
      date.setMonth(date.getMonth() + 6); // Cộng thêm 6 tháng
    }

    // Format theo giờ địa phương (Việt Nam)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate; // Trả về định dạng YYYY-MM-DDTHH:mm
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = async (key, value) => {
    let updatedFormData = { ...formData, [key]: value };

    if (key === "issueDate" && formData.ticketType) {
      // Tự động tính ngày hết hạn khi thay đổi ngày phát hành
      updatedFormData.expiryDate = calculateExpiryDate(
        value,
        formData.ticketType
      );
    }

    if (key === "ticketType" && value && formData.issueDate) {
      // Tự động tính ngày hết hạn khi thay đổi loại vé
      updatedFormData.expiryDate = calculateExpiryDate(
        formData.issueDate,
        value
      );

      // Tự động lấy giá vé theo loại vé
      const ticketPriceObj = await fetchTicketPriceByTicketTypeData(value);
      updatedFormData.price = ticketPriceObj.price;
    }

    // Clean studentId nếu người dùng đối sang loại vé khác nhưng đã chọn student
    if (key === "ticketType" && value !== "STUDENT_TICKET") {
      updatedFormData.studentId = "";
    }

    setFormData(updatedFormData);
    validateField(key, value); // Gọi validateField nếu cần
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
      qrCodeBase64: "",
      issueDate: formatDateTimeLocal(), // Ngày hiện tại
      expiryDate: "",
      ticketType: "",
      price: "",
      studentId: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
      issueDate: formatDateTimeToISO(item.issueDate),
      expiryDate: formatDateTimeToISO(item.expiryDate),
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const prepareOrderData = () => {
    // Dữ liệu cho Order
    const orderData = {
      total: formData.price,
      paymentMethod: "CASH",
      shippingAddress: null,
      discountId: null,
      userId: null,
    };

    const detail = {
      quantity: 1,
      unitPrice: formData.price,
    };

    // Kết hợp dữ liệu Order và OrderDetails
    const invoiceObj = {
      order: orderData,
      orderDetails: [detail],
    };

    return invoiceObj;
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng TicketService
        const updatedTicket = await TicketService.updateTicket(
          formData.id,
          formData
        );

        // Đổi định dạng ngày trước khi lưu vào mảng
        const formattedTicket = {
          ...updatedTicket,
          issueDate: formatDateTimeToDMY(updatedTicket.issueDate),
          expiryDate: formatDateTimeToDMY(updatedTicket.expiryDate),
        };

        // Cập nhật state ticketData với ticket đã được sửa
        const updatedTickets = ticketData.map((ticket) =>
          ticket.id === formattedTicket.id ? formattedTicket : ticket
        );

        setTicketData(updatedTickets);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newTicket = await TicketService.createTicket(formData);

        // Đổi định dạng ngày trước khi lưu vào mảng
        const formattedTicket = {
          ...newTicket,
          issueDate: formatDateTimeToDMY(newTicket.issueDate),
          expiryDate: formatDateTimeToDMY(newTicket.expiryDate),
        };

        await SalesService.createInvoice(prepareOrderData());

        // Cập nhật mảng ticketData với ticket vừa được thêm
        setTicketData([...ticketData, formattedTicket]);
        toast.success("Thêm mới thành công!");
      }
      handleReset(); // Reset form
      return true;
    } catch (error) {
      console.error("Lỗi xử lý ticket:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      return false;
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải
    }
  };

  // Hàm xóa một ticket
  const handleDelete = async (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      try {
        // Gọi API xóa ticket
        await TicketService.deleteTicket(deleteId);

        // Cập nhật state sau khi xóa
        setTicketData(ticketData.filter((ticket) => ticket.id !== deleteId));
        toast.success("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa ticket:", error);
        toast.error("Đã xảy ra lỗi khi xóa. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formTicketType">
            <Form.Label>
              Loại Vé <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listTicketTypeOption}
              value={listTicketTypeOption.find(
                (option) => option.value === formData.ticketType
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "ticketType",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn Loại Vé"
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
            />
            {errorFields.ticketType && (
              <div className="invalid-feedback d-block">
                {errorFields.ticketType}
              </div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formTicketPrice">
            <Form.Label>
              Giá Vé <span className="text-danger">(*)</span>
            </Form.Label>
            <NumericFormat
              thousandSeparator={true}
              suffix=" VNĐ"
              decimalScale={0} // Không cho phép số thập phân
              value={formData.price}
              onValueChange={(values) => {
                const { floatValue } = values;
                handleInputChange("price", floatValue); // Lấy giá trị số thực (floatValue là giá trị số thực không có dấu phân cách hay định dạng   )
              }}
              className="form-control"
              placeholder="Không cần điền."
              required
              readOnly
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.price}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formIssueDate">
            <Form.Label>
              Ngày Phát Hành <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="issueDate"
              value={formData.issueDate}
              onChange={(e) => handleInputChange("issueDate", e.target.value)}
              isInvalid={!!errorFields.issueDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.issueDate}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formExpiryDate">
            <Form.Label>
              Ngày Hết Hạn <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              isInvalid={!!errorFields.expiryDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.expiryDate}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {formData.ticketType === "STUDENT_TICKET" && (
          <div className="col-md-6 mb-3">
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
        )}

        {statusFunction.isEditing && (
          <div className="col-md-12 my-1 text-center">
            <img
              src={`data:image/png;base64,${formData.qrCodeBase64}`}
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý vé - Hight Star</title>
      </Helmet>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            data={ticketData}
            columns={ticketColumns}
            title={"Quản lý vé"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            onSetting={() => setShowModalTicketPrice(true)}
            buttonCustom={button}
          />
        </section>
      )}
      <TicketPriceModal
        show={showModalTicketPrice}
        onClose={() => setShowModalTicketPrice(false)}
        ticketTypes={listTicketTypeOption} // Dữ liệu loại vé
      />
    </>
  );
};

export default TicketManagement;
