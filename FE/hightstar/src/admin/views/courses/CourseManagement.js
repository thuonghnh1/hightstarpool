import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import CourseService from "../../services/CourseService";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form, InputGroup } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const CourseManagement = () => {
  // State lưu data từ api
  const [courseData, setCourseData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState(null); // State lưu trữ ảnh upload
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết
  const [isLoading, setIsLoading] = useState(false); // State để xử lý trạng thái tải dữ liệu
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const courseColumns = [
    { key: "id", label: "Mã khóa học" },
    { key: "courseName", label: "Tên khóa học" },
    { key: "image", label: "Hình ảnh" },
    { key: "maxStudents", label: "Số lượng học viên tối đa" },
    { key: "numberOfSessions", label: "Số lượng buổi học" },
    { key: "price", label: "Giá khóa học" },
    { key: "description", label: "Mô tả" },
  ];

  // Loại bỏ cột 'description' khỏi courseColumns
  const defaultColumns = courseColumns.filter(
    (column) => column.key !== "description"
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchCourseData = async () => {
    setLoadingPage(true);
    try {
      const data = await CourseService.getCourses(); // Sửa từ discountService thành CourseService
      setCourseData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // useEffect để gọi fetchCourseData khi component được mount
  useEffect(() => {
    fetchCourseData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "courseName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;
      case "image":
        if (!value || value.trim() === "") {
          error = "Hình ảnh không được để trống.";
        }
        break;

      case "maxStudents":
        if (value === "" || value === null) {
          error = "Số lượng học viên tối đa không được để trống.";
        } else if (isNaN(value) || value <= 0) {
          error = "Số lượng học viên tối đa phải là một số dương.";
        }
        break;

      case "numberOfSessions":
        if (value === "" || value === null) {
          error = "Số lượng buổi học không được để trống.";
        } else if (isNaN(value) || value <= 0) {
          error = "Số lượng buổi học phải là một số dương.";
        }
        break;

      case "price":
        if (value === "" || value === null) {
          error = "Giá khóa học không được để trống.";
        } else if (isNaN(value) || value < 0) {
          error = "Giá khóa học phải là một số không âm.";
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
    // Kiểm tra tên khóa học
    if (!formData.courseName || formData.courseName.trim() === "") {
      newErrors.courseName = "Tên khóa học không được để trống.";
    }

    // Kiểm tra hình ảnh khóa học
    if (!formData.image || formData.image.trim() === "") {
      newErrors.image = "Hình ảnh không được để trống.";
    }

    // Kiểm tra số lượng học viên tối đa
    if (formData.maxStudents === "" || formData.maxStudents === null) {
      newErrors.maxStudents = "Số lượng học viên tối đa không được để trống.";
    } else if (isNaN(formData.maxStudents) || formData.maxStudents <= 0) {
      newErrors.maxStudents = "Số lượng học viên tối đa phải là một số dương.";
    }
    // Kiểm tra số lượng buổi học
    if (
      formData.numberOfSessions === "" ||
      formData.numberOfSessions === null
    ) {
      newErrors.numberOfSessions = "Số lượng buổi học không được để trống.";
    } else if (
      isNaN(formData.numberOfSessions) ||
      formData.numberOfSessions <= 0
    ) {
      newErrors.numberOfSessions = "Số lượng buổi học phải là một số dương.";
    }

    // Kiểm tra giá khóa học
    if (formData.price === "" || formData.price === null) {
      newErrors.price = "Giá khóa học không được để trống.";
    } else if (isNaN(formData.price) || formData.price < 0) {
      newErrors.price = "Giá khóa học phải là một số không âm.";
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
      courseName: "",
      image: "",
      maxStudents: "4",
      numberOfSessions: "0",
      price: "0",
      description: "", // Nếu vẫn cần trường mô tả
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item, // Sao chép tất cả thuộc tính của item
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };
  // Hàm gọi khi lưu
  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật khóa học
        const updatedCourse = await CourseService.updateCourse(
          formData.id,
          formData,
          imageFile
        );
        const updatedCourses = courseData.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        );
        setCourseData(updatedCourses);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Gọi API thêm mới khóa học
        const createdCourse = await CourseService.createCourse(
          formData,
          imageFile
        );
        setCourseData([...courseData, createdCourse]);
        toast.success("Thêm mới thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data + "!"); // Hiển thị thông điệp lỗi từ server
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!"); // Thông báo lỗi chung
      }
      return false;
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);

    try {
      await CourseService.deleteCourse(deleteId);
      setCourseData(courseData.filter((course) => course.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          {/* Phần hiển thị hình ảnh */}
          <Form.Label>Hình ảnh khóa học</Form.Label>
          <div
            className="d-flex justify-content-center align-items-center mb-3 rounded bg-light"
            style={{
              width: "100%",
              height: "240px",
              overflow: "hidden",
              border: "2px dashed #ddd",
            }}
          >
            {formData.image ? (
              <img
                src={formData.image}
                alt="Hình ảnh khóa học"
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có hình ảnh nào</span>
            )}
          </div>
          <Form.Group controlId="formImage">
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("image", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("image", "");
                  setImageFile(null);
                }
              }}
              isInvalid={!!errorFields.image}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.image}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-md-6">
          <div className="row m-0 p-0">
            <div className="mb-3 p-0">
              <Form.Group controlId="formCourseName">
                <Form.Label>Tên khóa học</Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  maxLength={100}
                  onChange={(e) =>
                    handleInputChange("courseName", e.target.value)
                  }
                  placeholder="VD: Khóa học bơi ếch..."
                  isInvalid={!!errorFields.courseName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.courseName}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="mb-3 p-0">
              <Form.Group controlId="formMaxStudents">
                <Form.Label>Loại khóa học</Form.Label>
                <Form.Select
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    handleInputChange("maxStudents", e.target.value)
                  }
                  isInvalid={!!errorFields.maxStudents}
                  required
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      1 kèm {num}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errorFields.maxStudents}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="mb-3 p-0">
              <Form.Group controlId="formPrice">
                <Form.Label>Giá khóa học</Form.Label>
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
                  placeholder="Nhập giá (VNĐ)"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.price}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="mb-3 p-0">
            <Form.Group controlId="formNumberOfSessions">
              <Form.Label>Tổng số buổi học</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="numberOfSessions"
                  value={formData.numberOfSessions}
                  onChange={(e) =>
                    handleInputChange("numberOfSessions", e.target.value)
                  }
                  isInvalid={!!errorFields.numberOfSessions}
                  required
                />
                <InputGroup.Text>Buổi</InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errorFields.numberOfSessions}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>

        <div className="col-md-12 mb-1">
          <Form.Group controlId="formDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả khóa học..."
            />
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý khóa học - Hight Star</title>
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
            data={courseData} // Đổi thành courseData
            columns={courseColumns} // Đổi thành courseColumns
            title={"Quản lý khóa học"} // Đổi tiêu đề thành "Quản lý khóa học"
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
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

export default CourseManagement;
