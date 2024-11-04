import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import userService from "../../services/UserService";
import Page500 from "../pages/Page500";
import { Helmet } from "react-helmet-async";
import {
  formatDateTimeToISO,
  formatDateTimeToDMY,
} from "../../utils/FormatDate";
import { Spinner, Form } from "react-bootstrap";

const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "username", label: "Tên người dùng" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai Trò" },
    { key: "registeredDate", label: "Ngày đăng ký" },
    { key: "lastLogin", label: "Lần đăng nhập cuối" },
    { key: "status", label: "Trạng thái" },
  ];

  const keysToRemove = ["lastLogin"];
  const defaultColumns = userColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchUserData = async () => {
    setLoadingPage(true);
    try {
      const data = await userService.getUsers();
      setUserData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchUserData();
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
    if (!isEditing && (!formData.fullName || formData.fullName.trim() === "")) { // nếu là edit thì sẽ không validate trường này
      newErrors.fullName = "Tên không được để trống.";
    }

    if (!isEditing && (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      role: "USER",
      password: "",
      status: "ACTIVE",
    });
    setIsEditing(false);
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      registeredDate: formatDateTimeToISO(item.registeredDate),
      lastLogin: formatDateTimeToISO(item.lastLogin),
    });
    setIsEditing(true);
    setErrorFields({});
  };

  const handleSaveItem = async () => {

    if (!validateForm()) return false;
    setIsLoading(true);

    try {
      if (isEditing) {
        const updatedUser = await userService.updateUser(formData.id, formData);

        const formattedUser = {
          ...updatedUser,
          registeredDate: formatDateTimeToDMY(updatedUser.registeredDate),
          lastLogin: formatDateTimeToDMY(updatedUser.lastLogin),
        };

        const updatedUsers = userData.map((user) =>
          user.id === formattedUser.id ? formattedUser : user
        );

        setUserData(updatedUsers);
        toast.success("Cập nhật thành công!");
      } else {
        const newUser = await userService.createUser(formData);
        console.log(formData.fullName);
        const formattedUser = {
          ...newUser,
          registeredDate: formatDateTimeToDMY(newUser.registeredDate),
          lastLogin: formatDateTimeToDMY(newUser.lastLogin),
        };

        setUserData([...userData, formattedUser]);
        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data + "!");
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      userService
        .deleteUser(deleteId)
        .then(() => {
          setUserData(userData.filter((user) => user.id !== deleteId));
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
      {/* Nếu là edit thì không cần họ và tên */}
      <div className="row">
        {isEditing || (
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
        )}
        {isEditing || (
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
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                isInvalid={!!errorFields.phoneNumber}
                placeholder="Nhập số điện thoại"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errorFields.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        )}

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
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.email}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              isInvalid={!!errorFields.role}
              required
              disabled={isEditing}
            >
              <option value="ADMIN">Quản trị</option>
              <option value="USER">Người dùng</option>
              {/* Nếu là tạo mới thì không tạo HLV ở user */}
              {isEditing && <option value="TRAINER">Huấn luyện viên</option>}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errorFields.role}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        {isEditing && (
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formPassword">
              <Form.Label>
                Mật khẩu <span className="text-danger">(*)</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                isInvalid={!!errorFields.password}
                required={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {errorFields.password}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        )}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formStatus">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={formData.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hóa"}
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
        <title>Quản lý người dùng - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={userColumns}
            data={userData}
            title={"Quản lý người dùng"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            isEditing={isEditing}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </section>
      )}
    </>
  );
};

export default UserManagement;
