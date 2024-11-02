import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import studentService from "../../services/StudentService.js";
import Page500 from "../pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Bounce, ToastContainer, toast } from "react-toastify";

const StudentManagement = () => {
    // State để lưu trữ dữ liệu giảm giá từ API
    const [studentData, setStudentData] = useState([]); // đổi tên biến
    const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
    const [avatarPreview, setAvatarPreview] = useState({});

    const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
    const [isEditing, setIsEditing] = useState(false); // Trạng thái để biết đang thêm mới hay chỉnh sửa
    // State để xử lý trạng thái tải dữ liệu và lỗi

    const [isLoading, setIsLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
    const [errorServer, setErrorServer] = useState(null);

    // Mảng cột của bảng (cần đổi theo các trường có trong csdl. lưu ý giữ nguyên id là 'id' sau ni làm be r giải thích sau)
    const studentColumns = [
        { key: "id", label: "Mã Học Viên" },
        { key: "fullName", label: "Họ Tên Học Viên" },
        { key: "age", label: "Tuổi" },
        { key: "avatar", label: "Ảnh" },
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
                }
                break;

            case "age":
                if (value === "" || value === null) {
                    error = "Tuổi không được để trống.";
                } else if (isNaN(value) || value < 1 || value > 100) {
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
        setFormData({ ...formData, [key]: key === "gender" ? value === "true" : value === "false" ? false : value });
        validateField(key, value);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });

            // Hiển thị preview ảnh đại diện
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Hàm reset form khi thêm mới
    const handleReset = () => {
        setFormData({
            fullName: "",
            avatar: "",
            nickname: "",
            age: "",
            note: ""
        });
        setAvatarPreview("");
        setIsEditing(false);
        setErrorFields({});
    };

    // Hàm gọi khi nhấn "Sửa" một hàng
    const handleEdit = (item) => {
        setFormData({
            ...item,
        });
        setAvatarPreview(item.avatar || "");
        setIsEditing(true);
        setErrorFields({});
    };

    // Hàm lưu thông tin sau khi thêm hoặc sửa
    const handleSaveItem = () => {
        if (!validateForm()) return false;

        setIsLoading(true); // Bắt đầu quá trình tải
        // console.log("Dữ liệu formData trước khi gửi:", formData); // Kiểm tra dữ liệu
        if (isEditing) {
            // Gọi API cập nhật sử dụng studentService
            studentService
                .updateStudent(formData.id, formData)
                .then((response) => {
                    let updatedStudent = response; // Lấy phản hồi từ server
                    console.log("Update: " + updatedStudent);

                    // Cập nhật state studentData với student đã được sửa
                    const updatedStudents = studentData.map((student) =>
                        student.id === updatedStudent.id ? updatedStudent : student
                    );
                    setStudentData(updatedStudents);
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
            };

            // Gọi API thêm mới sử dụng studentService
            studentService
                .createStudent(newStudent)
                .then((response) => {
                    let createdStudent = response; // Lấy phản hồi từ server (bao gồm ID)
                    // Cập nhật mảng studentData với item vừa được thêm
                    setStudentData([...studentData, createdStudent]);

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

    // Đổi lại chọ input để thêm sửa (lưu ý chia cột theo định dạng bên dưới 2 hoặc 3 cột trên 1 hàng và có resposive)
    const modalContent = (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formFullName">
                        <Form.Label>Họ Tên Học Viên</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            maxLength={50}
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
                    <Form.Group controlId="formNickname">
                        <Form.Label>Biệt Danh</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            maxLength={50}
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
                            {errorFields.age}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                {/* Giới Tính */}
                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formGender">
                        <Form.Label>Giới Tính</Form.Label>
                        <Form.Select
                            value={formData.gender}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            isInvalid={!!errorFields.gender}
                        >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errorFields.gender}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                {/* Ảnh Đại Diện */}
                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formAvatar">
                        <Form.Label>Ảnh Đại Diện</Form.Label>
                        <Form.Control type="file" onChange={handleAvatarChange} />
                    </Form.Group>
                </div>

                <div className="col-md-12 mb-3">
                    <Form.Group controlId="formNote">
                        <Form.Label>Ghi Chú</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="note"
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

                {/* <div className="col-md-6 mb-3">
                    <Form.Group controlId="formUserId">
                        <Form.Label>Mã Người Dùng</Form.Label>
                        <Form.Control
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={(e) => handleInputChange("userId", e.target.value)}
                            isInvalid={!!errorFields.userId}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.userId}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div> */}
            </div>
        </>
    );

    return (
        <>
        { console.log("Dữ liệu API trả về:", studentData)}
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