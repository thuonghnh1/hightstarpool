import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import NotificationService from "../../services/NotificationService";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import UserService from "../../services/UserService";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import { formatDateTimeToDMY, formatDateTimeToISO } from "../../utils/FormatDate";

const NotificationManagement = () => {
  // State lưu data từ API
  const [notificationData, setNotificationData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [listUserOption, setListUserOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const notificationColumns = [
    { key: "id", label: "Mã thông báo" },
    { key: "content", label: "Nội dung" },
    { key: "status", label: "Trạng thái" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "recipientType", label: "Loại người nhận" },
    { key: "userId", label: "Mã người dùng" },
  ];

  // Loại bỏ cột 'content' khỏi notificationColumns
  const defaultColumns = notificationColumns.filter(
    (column) => column.key !== "content"  //lấy all - content k lấy dấu => (trả về) 1 ds mới ... là duyệt trong mảng.. khi mà cái key = content trong mảng thì nó sẽ bỏ qua cái content đó 
  );// filter sẽ tạo ra 1 mảng mới với các phần tử có mã đk là true.

  // Lấy dữ liệu từ API
  const fetchNotificationData = async () => {
    setLoadingPage(true);
    try {
      const data = await NotificationService.getNotifications();
      setNotificationData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
    try {
      let users = await UserService.getUsers();
      // Chuyển đổi danh sách người dùng đã lọc thành định dạng phù hợp cho Select
      const userOptions = users.map((user) => ({
        value: user.id,
        label: `#${user.id} - ${user.username}`,
      }));
      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListUserOption(userOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "content":
        if (!value || value.trim() === "") {
          error = "Nội dung không được để trống.";
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
    if (!formData.content || formData.content.trim() === "") {
      newErrors.content = "Nội dung không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    // Kiểm tra nếu key là userId và có giá trị
    if (key === "userId" && value) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: value,
        recipientType: "INDIVIDUAL", // Cập nhật recipientType thành "INDIVIDUAL" nếu userId có giá trị
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: value,
      }));
    }

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

  const handleReset = () => {
    setFormData({
      content: "",
      recipientType: "ALL",
      userId: "",
    });
    setErrorFields({});
    handleResetStatus();
  };

  const handleEdit = (item) => {
    console.log(item);

    // Kiểm tra nếu userId có giá trị
    const updatedFormData = {
      ...item,
      createdAt: formatDateTimeToISO(item.createdAt),
    };

    if (item.userId) {
      // Nếu userId có giá trị, set recipientType là "INDIVIDUAL"
      updatedFormData.recipientType = "INDIVIDUAL";
    }

    setFormData(updatedFormData);
    setStatusFunction({ isEditing: true });
    setErrorFields({});
  };


  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updatedNotification = await NotificationService.updateNotification(
          formData.id,
          formData
        );
        const formattedNotification = {
          ...updatedNotification,
          createdAt: formatDateTimeToDMY(updatedNotification.createdAt),
        };

        const updatedNotifications = notificationData.map((notification) =>
          notification.id === formattedNotification.id
            ? formattedNotification
            : notification
        );
        setNotificationData(updatedNotifications);
        toast.success("Cập nhật thông báo thành công!");
      } else if (statusFunction.isAdd) {
        const createdNotification = await NotificationService.createNotification(
          formData
        );
        const formattedNotification = {
          ...createdNotification,
          createdAt: formatDateTimeToDMY(createdNotification.createdAt),
        };
        setNotificationData([...notificationData, formattedNotification]);
        toast.success("Thêm mới thông báo thành công!");
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
      await NotificationService.deleteNotification(deleteId);
      setNotificationData(
        notificationData.filter((notification) => notification.id !== deleteId)
      );
      toast.success("Xóa thông báo thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa thông báo.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Form.Group controlId="formContent">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            type="text"
            name="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            isInvalid={!!errorFields.content}
          />
          <Form.Control.Feedback type="invalid">
            {errorFields.content}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="col-md-6 mb-3">
        <Form.Group controlId="formUser">
          <Form.Label>
            Mã Người Dùng <span className="text-danger">(*)</span>
          </Form.Label>
          <Select
            options={listUserOption}
            value={listUserOption.find(
              (option) => option.value === formData.userId
            )}
            onChange={(selectedOption) =>
              handleInputChange(
                "userId",
                selectedOption ? selectedOption.value : ""
              )
            }
            placeholder="Chọn người dùng"
            isInvalid={!!errorFields.userId}
            isClearable // Cho phép xóa chọn lựa
            isSearchable // Bật tính năng tìm kiếm
            styles={{
              menu: (provided) => ({
                ...provided,
              }),
            }}
          />
          {errorFields.userId && (
            <div className="invalid-feedback d-block">
              {errorFields.userId}
            </div>
          )}
        </Form.Group>
      </div>

      {formData?.userId ? null : (<div className="col-md-6 mb-3">
        <Form.Group controlId="formRecipientType">
          <Form.Label>Loại người nhận</Form.Label>
          <Form.Select
            name="recipientType"
            value={formData.recipientType}
            onChange={(e) => handleInputChange("recipientType", e.target.value)}
            isInvalid={!!errorFields.recipientType}
            required
          >
            {[{ value: "ALL", label: "Tất cả" }, { value: "ADMIN", label: "Quản trị" }, { value: "EMPLOYEE", label: "Nhân viên" }, { value: "TRAINER", label: "Huấn luyện viên" }, { value: "USER", label: "Khách hàng" }].map((object) => (
              <option key={object.value} value={object.value}>
                {object.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errorFields.recipientType}
          </Form.Control.Feedback>
        </Form.Group>
      </div>)}
      <div className="small fst-italic text-danger mb-3">Lưu ý: Bỏ trống trường người dùng nếu gửi chung!</div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý thông báo - Hight Star</title>
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
            data={notificationData}
            columns={notificationColumns}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            title={"Quản lý thông báo"}
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

export default NotificationManagement;
