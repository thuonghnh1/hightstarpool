import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import userService from "../../services/UserService";
import Page500 from "../pages/Page500";
import { Helmet } from "react-helmet-async";
import {
  formatDateTimeToISO,
  formatDateTimeToDMY,
  formatDateTimeLocal,
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
  const today = new Date().toISOString().split("T")[0];

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "username", label: "Tên người dùng" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai Trò" },
    { key: "registeredDate", label: "Ngày đăng ký" },
    { key: "lastLogin", label: "Lần đăng nhập cuối" },
    { key: "status", label: "Trạng thái" },
    { key: "password", label: "Mật khẩu" },
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
      case "username":
        if (!value || value.trim() === "") {
          error = "Tên người dùng không được để trống.";
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

    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "Tên người dùng không được để trống.";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!isEditing) {
      if (!formData.password || formData.password.trim() === "") {
        newErrors.password = "Mật khẩu không được để trống.";
      } else if (formData.password.length < 5) {
        newErrors.password = "Mật khẩu phải có ít nhất 5 ký tự.";
      }
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
      username: "",
      email: "",
      registeredDate: formatDateTimeLocal(),
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
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formUsername">
            <Form.Label>
              Tên người dùng <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              maxLength={100}
              onChange={(e) => handleInputChange("username", e.target.value)}
              isInvalid={!!errorFields.username}
              placeholder="Nhập tên người dùng"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.username}
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
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.email}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              isInvalid={!!errorFields.role}
              required
            >
              <option value="">Chọn vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="TRAINER">TRAINER</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errorFields.role}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

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
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formRegisteredDate">
            <Form.Label>Ngày đăng ký</Form.Label>
            <Form.Control
              type="datetime-local"
              name="registeredDate"
              value={formData.registeredDate || today}
              onChange={(e) =>
                handleInputChange("registeredDate", e.target.value)
              }
              required
              readOnly={isEditing}
            />
          </Form.Group>
        </div>

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
