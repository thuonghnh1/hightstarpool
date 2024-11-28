import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import studentService from "../../services/StudentService.js";
import UserService from "../../services/UserService.js";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import { Helmet } from "react-helmet-async";


const StudentManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [studentData, setStudentData] = useState([]); // đổi tên biến
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState(null); // State lưu trữ ảnh upload
  const [listUserOption, setListUserOption] = useState([]);

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

  // Mảng cột của bảng
  const studentColumns = [
    { key: "id", label: "ID" },
    { key: "avatar", label: "Ảnh" },
    { key: "fullName", label: "Họ Tên Học Viên" },
    { key: "age", label: "Tuổi" },
    { key: "nickname", label: "Biệt Danh" },
    { key: "gender", label: "Giới Tính" },
    { key: "note", label: "Ghi Chú" },
    { key: "userId", label: "Mã Người Dùng" },
  ];

  // Loại bỏ cột 'description' khỏi studentColumns
  const defaultColumns = studentColumns.filter(
    (column) => column.key !== "note"
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchStudentData = async () => {
    setLoadingPage(true);
    try {
      const data = await studentService.getStudents();
      setStudentData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
    try {
      let users = await UserService.getUsers();
      // Lọc danh sách người dùng để chỉ lấy những người có vai trò USER
      const filteredUsers = users.filter((user) => user.role === "USER");

      // Chuyển đổi danh sách người dùng đã lọc thành định dạng phù hợp cho Select
      const userOptions = filteredUsers.map((user) => ({
        value: user.id,
        label: `#${user.id} - ${user.username}`,
      }));
      // Cập nhật trạng thái danh sách tùy chọn cho Select
      setListUserOption(userOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng");
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "fullName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }else if (/\d/.test(value)) {
          error = "Tên không được chứa chữ số.";
        } 
        break;

      case "age":
        if (value === "" || value === null) {
          error = "Tuổi không được để trống.";
        } else if (isNaN(value) || value < 1 || value > 100) {
          error = "Tuổi phải lớn hơn 0 và nhỏ hơn 100.";
        }
        break;

      case "userId":
        if (value === "" || value === null) {
          error = "Mã người dùng không được để trống.";
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

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Tên không được để trống.";
    } else if (/\d/.test(formData.fullName)) {
      newErrors.fullName = "Tên không được chứa chữ số.";
    }    

    if (formData.age === "" || formData.age === null) {
      newErrors.age = "Tuổi không được để trống.";
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 100) {
      newErrors.age = "Tuổi phải lớn hơn 0 và nhỏ hơn 100.";
    }
    if (!formData.userId) {
      newErrors.userId = "Mã người dùng là bắt buộc.";
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
      fullName: "",
      avatar: "",
      nickname: "",
      age: 0,
      gender: true,
      note: "",
    });
    handleResetStatus();
    setErrorFields({});
  };
  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = async (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  // Hàm lưu thông tin sau khi thêm hoặc sửa
  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng studentService
        const updatedStudent = await studentService.updateStudent(
          formData.id,
          formData,
          imageFile
        );
        // Cập nhật state studentData với student đã được sửa
        const updatedStudents = studentData.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
        setStudentData(updatedStudents);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Gọi API thêm mới sử dụng studentService
        const newStudent = await studentService.createStudent(
          formData,
          imageFile
        );
        // Cập nhật mảng studentData với item vừa được thêm
        setStudentData([...studentData, newStudent]);
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

  // Hàm xóa một student
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      studentService
        .deleteStudent(deleteId)
        .then(() => {
          setStudentData(
            studentData.filter((student) => student.id !== deleteId)
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
        {/* Họ Tên Học Viên */}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formFullName">
            <Form.Label>
              Họ Tên Học Viên <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Nhập họ tên học viên"
              value={formData.fullName}
              maxLength={50}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              isInvalid={!!errorFields.fullName}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.fullName}
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
          <Form.Group controlId="formGender">
            <Form.Label>
              Giới tính <span className="text-danger">(*)</span>
            </Form.Label>
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

        {/* Ảnh Đại Diện */}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formImage">
            <Form.Label>Ảnh đại diện</Form.Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Control
                type="file"
                name="avatar"
                accept="avatar/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                    const fileUrl = URL.createObjectURL(file);
                    handleInputChange("avatar", fileUrl); // lưu file vào img để xem trước
                  } else {
                    // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả avatar và imageFile
                    handleInputChange("avatar", "");
                    setImageFile(null);
                  }
                }}
                isInvalid={!!errorFields.avatar}
                required
                style={{ flex: 1 }}
              />
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Hình ảnh khóa học"
                  className="object-fit-cover"
                  style={{
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
            <Form.Control.Feedback type="invalid">
              {errorFields.avatar}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Mã Người Dùng với Select có tìm kiếm */}
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formUserId">
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
              placeholder="Chọn mã người dùng"
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
      </div>
    </>
  );

  return (
    <>
      {/* Những cái bên dưới truyền prop cho đúng tên của những cái m đổi rồi là đc */}
      {/* Hiển thị loader khi đang tải trang */}
      <Helmet>
        <title>Quản lý Học viên - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            data={studentData}
            columns={studentColumns}
            title={"Quản lý học viên"}
            defaultColumns={defaultColumns}
            handleSaveItem={handleSaveItem}
            onEdit={handleEdit}
            onDelete={handleDelete}
            handleReset={handleReset}
            formData={formData}
            setFormData={setFormData}
            modalContent={modalContent}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};
export default StudentManagement;
