import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import ticketService from "../../services/TicketService";
import Page500 from "../../../common/pages/Page500";
import { formatDateToISO, formatDateToDMY } from "../../utils/FormatDate";
import { Spinner, Form } from "react-bootstrap";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Select from "react-select";

const TicketManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [ticketData, setTicketData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa
  // State để xử lý trạng thái tải dữ liệu và lỗi

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  const listTicketTypeOption = [{
    value: "ONETIME_TICKET",
    label: "Vé một lần",
  }, {
    value: "WEEKLY_TICKET",
    label: "Vé tuần",
  }, {
    value: "MONTHLY_TICKET",
    label: "Vé tháng",
  }]; // Lưu danh sách type

  // Mảng cột của bảng
  const ticketColumns = [
    { key: "id", label: "ID" },
    { key: "ticketCode", label: "Mã vé" },
    { key: "issueDate", label: "Ngày Phát Hành" },
    { key: "expiryDate", label: "Ngày Hết Hạn" },
    { key: "ticketType", label: "Loại Vé" },
    { key: "status", label: "Trạng thái" },
    { key: "ticketPrice", label: "Giá Vé" },
    { key: "studentId", label: "Mã Học Viên" },
  ];

  // Loại bỏ cột khỏi ticketColumns
  const defaultColumns = ticketColumns.filter(
    (column) => column.key !== "ticketPrice"
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchTicketData = async () => {
    setLoadingPage(true);
    try {
      const data = await ticketService.getTickets();
      setTicketData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  // useEffect(() => {
  //   fetchTicketData();
  // }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "ticketCode":
        if (!value || value.trim() === "") {
          error = "Mã vé không được để trống.";
        }
        break;

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

      case "ticketPrice":
        if (value === "" || value === null) {
          error = "Giá vé không được để trống.";
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

    if (!formData.ticketCode || formData.ticketCode.trim() === "") {
      newErrors.ticketCode = "Mã vé không được để trống.";
    }

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

    if (formData.ticketPrice === "" || formData.ticketPrice === null) {
      newErrors.ticketPrice = "Giá vé không được để trống.";
    } else if (
      isNaN(formData.ticketPrice) ||
      formData.ticketPrice < 0
    ) {
      newErrors.ticketPrice =
        "Giá vé phải là một số và không âm.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      ticketCode: "",
      issueDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
      expiryDate: "",
      ticketType: "ONETIME_TICKET",
      ticketPrice: "",
    });
    setIsEditing(false);
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
      issueDate: formatDateToISO(item.issueDate),
      expiryDate: formatDateToISO(item.expiryDate),
    });
    setIsEditing(true);
    setErrorFields({});
  };

  // Hàm lưu thông tin sau khi thêm hoặc sửa
  const handleSaveItem = () => {
    if (!validateForm()) return false;

    setIsLoading(true); // Bắt đầu quá trình tải

    if (isEditing) {
      // Tìm vé đang chỉnh sửa dựa vào `id`
      const updatedTickets = ticketData.map((ticket) => {
        if (ticket.id === formData.id) {
          return {
            ...formData,
            issueDate: formatDateToDMY(formData.issueDate),
            expiryDate: formatDateToDMY(formData.expiryDate),
          };
        } else {
          return ticket;
        }
      });

      // Cập nhật mảng ticketData
      setTicketData(updatedTickets);

      // Gọi API cập nhật sử dụng ticketService
      ticketService
        .updateTicket(formData.id, formData)
        .then(() => {
          toast.success("Cập nhật thành công!");
          handleReset();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật", error);
          toast.error("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setIsLoading(false); // Kết thúc quá trình tải
        });
    } else {
      // Nếu đang ở trạng thái thêm mới
      const newTicket = {
        ...formData,
        issueDate: formatDateToDMY(formData.issueDate),
        expiryDate: formatDateToDMY(formData.expiryDate),
        id: Date.now().toString(), // tạo id tạm thời để gửi lên server
      };

      // Cập nhật mảng ticketData
      setTicketData([...ticketData, newTicket]);

      // Gọi API thêm mới sử dụng ticketService
      ticketService
        .createTicket(newTicket)
        .then((response) => {
          fetchTicketData(); // Gọi lại để lấy dữ liệu mới nhất từ server
          toast.success("Thêm mới thành công!");
          handleReset();
        })
        .catch((error) => {
          console.error("Lỗi khi thêm mới", error);
          toast.error("Đã xảy ra lỗi khi thêm mới. Vui lòng thử lại sau.");
        })
        .finally(() => {
          setIsLoading(false); // Kết thúc quá trình tải
        });
    }
  };

  // Hàm xóa một ticket
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      ticketService
        .deleteTicket(deleteId)
        .then(() => {
          setTicketData(
            ticketData.filter((ticket) => ticket.id !== deleteId)
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
          <Form.Group controlId="formName">
            <Form.Label>Mã Vé</Form.Label>
            <Form.Control
              type="text"
              name="ticketCode"
              value={formData.ticketCode}
              onChange={(e) => handleInputChange("ticketCode", e.target.value)}
              isInvalid={!!errorFields.ticketCode}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.ticketCode}
            </Form.Control.Feedback>
          </Form.Group>
        </div>


        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formIssueDate">
              <Form.Label>Ngày Phát Hành</Form.Label>
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
              <Form.Label>Ngày Hết Hạn</Form.Label>
              <Form.Control
                type="date"
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
        </div>


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
            <Form.Label>Giá Vé</Form.Label>
            <Form.Control
              type="number"
              name="ticketPrice"
              min={0}
              value={formData.ticketPrice}
              onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
              isInvalid={!!errorFields.ticketPrice}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.ticketPrice}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
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
            isEditing={isEditing}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </section>
      )}
    </>
  );
};

export default TicketManagement;
