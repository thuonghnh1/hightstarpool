import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import studentService from "../../services/StudentService.js";
import Page500 from "../pages/Page500";
import {
    formatDateTimeToISO,
    formatDateTimeToDMY,
    formatDateTimeLocal,
} from "../../utils/FormatDate";
import { Spinner, Form } from "react-bootstrap";
import { Bounce, ToastContainer, toast } from "react-toastify";

const StudentManagement = () => {
    // State để lưu trữ dữ liệu giảm giá từ API
    const [studentData, setStudentData] = useState([]); // đổi tên biến
    const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
    const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
    const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa
    // State để xử lý trạng thái tải dữ liệu và lỗi

    const [isLoading, setIsLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
    const [errorServer, setErrorServer] = useState(null);

    // Mảng cột của bảng (cần đổi theo các trường có trong csdl. lưu ý giữ nguyên id là 'id' sau ni làm be r giải thích sau)
    const discountColumns = [
        { key: "id", label: "Mã Học Viên" },
        { key: "fullName", label: "Họ Tên Học Viên" },
        { key: "nickname", label: "Biệt Danh" },
        { key: "age", label: "Tuổi" },
        { key: "avatar", label: "Tuổi" },
        { key: "gender", label: "Giới Tính" },
        { key: "note", label: "Ghi Chú" },
        { key: "userId", label: "Mã Người Dùng" },
    ];

    // Loại bỏ cột 'description' khỏi discountColumns (đoạn ni sẽ bỏ những cột k cần hiện mặc định lên bảng, như ở dưới mặc định sẽ k có cột 'mô tả' khi reder. mà chỉ khi tích chọn vào mới hiện)
    const defaultColumns = discountColumns.filter(
        (column) => column.key !== "note"
    );

    // Gọi API để lấy dữ liệu từ server
    const fetchStudentData = async () => { // (cần đổi tên hàm)
        setLoadingPage(true);
        try {
            const data = await studentService.getStudents(); // (cần đổi)
            setStudentData(data); // Lưu dữ liệu vào state
        } catch (err) {
            setErrorServer(err.message); // Lưu lỗi vào state nếu có
        } finally {
            setLoadingPage(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchDiscountData();
    }, []);

    // Hàm validate cho từng trường input
    // (cần đổi validate cho các trường input m nhập vô)
    const validateField = (key, value) => {
        let error = "";

        switch (key) {
            case "fullName":
                if (!value || value.trim() === "") {
                    error = "Tên không được để trống.";
                }
                break;

            case "age":
                if (value === "" || value === null) {
                    error = "Tuổi không được để trống.";
                } else if (isNaN(value)|| value < 1 || value >100) {
                    error = "Tuổi phải lớn hơn 0 và nhỏ hơn 100."
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
    // (cần đổi validate cho các trường input m nhập vô)
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName || formData.fullName.trim() === "") {
            newErrors.fullName = "Tên không được để trống.";
        }

        if (formData.age === "" || formData.age === null) {
            newErrors.age = "Tuổi không được để trống.";
        } else if (
            isNaN(formData.age) ||
            formData.age < 1 ||
            formData.age > 100
        ) {
            newErrors.age = 
                "Tuổi phải lớn hơn 0 và nhỏ hơn 100.";
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
        setFormData({ // đổi lại theo giống form input của m
            fullName: "",
            nickname: "",
            age: "",
            gender: "",
            note: "",
            userId: ""
        });
        setIsEditing(false);
        setErrorFields({});
    };

    // Hàm gọi khi nhấn "Sửa" một hàng
    const handleEdit = (item) => {
        console.log(item);
        setFormData({
            ...item
        });
        setIsEditing(true);
        setErrorFields({});
    };

    // Hàm lưu thông tin sau khi thêm hoặc sửa
    const handleSaveItem = () => {
        if (!validateForm()) return false;

        setIsLoading(true); // Bắt đầu quá trình tải

        if (isEditing) {
            // Tìm mục giảm giá đang chỉnh sửa dựa vào `id`
            // (Cần đổi tên biến)
            const updatedStudents = studentData.map((student) => {
                if (student.id === formData.id) {
                    return {
                        ...formData
                    };
                } else {
                    return discount;
                }
            });

            // Cập nhật mảng discountData
            setStudentData(updatedStudents);

            // Gọi API cập nhật sử dụng discountService
            // discountService thành cái sv của m
            studentService
                .updateStudent(formData.id, formData)
                .then(() => {
                    // fetchDiscountData(); // Gọi lại để lấy dữ liệu mới nhất từ server
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
            const newStudent = {
                ...formData,
                id: Date.now().toString(), // tạo id tạm thời để gửi lên server
            };
            // (Tương tự cái trên)
            // Gọi API thêm mới sử dụng discountService
            studentService
                .createStudent(newStudent)
                .then((response) => {
                    fetchStudentData(); // Gọi lại để lấy dữ liệu mới nhất từ server
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
        return true;
    };

    // Hàm xóa một discount
    const handleDelete = (deleteId) => {
        //(cần đổi tương tự)
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

    // Đổi lại chọ input để thêm sửa (lưu ý chia cột theo định dạng bên dưới 2 hoặc 3 cột trên 1 hàng và có resposive)
    const modalContent = (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formName">
                        <Form.Label>Họ Tên Học Viên</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                            }
                            isInvalid={!!errorFields.fullName}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.fullName}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formNickName">
                        <Form.Label>Biệt Danh</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={(e) =>
                                handleInputChange("nickname", e.target.value)
                            }
                            isInvalid={!!errorFields.nickname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.nickname}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formAge">
                        <Form.Label>Tuổi</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            min={1}
                            max={100}
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            isInvalid={!!errorFields.age}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.percentage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 mb-3">
                    <Form.Group controlId="formDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                        />
                    </Form.Group>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Những cái bên dưới truyền prop cho đúng tên của những cái m đổi rồi là đc */}
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
                        data={discountData}
                        columns={discountColumns}
                        title={"Quản lý giảm giá"}
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
export default StudentManagement;