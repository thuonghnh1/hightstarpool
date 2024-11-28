import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import AttendanceService from "../../services/AttendanceService";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import studentService from "../../services/StudentService";
import ticketService from "../../services/TicketService";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { Spinner, Form } from "react-bootstrap";
import { getCurrentTime } from "../../utils/FormatDate";

const AttendanceManagement = () => {
    // State để lưu trữ dữ liệu giảm giá từ API
    const [attendanceData, setAttendanceData] = useState([]);
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
    const [listTicketOption, setListTicketOption] = useState([]);

    // Mảng cột của bảng
    const attendanceColumns = [
        { key: "id", label: "ID" },
        { key: "checkInTime", label: "Thời gian bắt đầu điểm danh" },
        { key: "checkOutTime", label: "Thời gian kết thúc điểm danh" },
        { key: "studentId", label: "Mã học viên" },
        { key: "ticketId", label: "Mã vé" },
        { key: "penaltyAmount", label: "Tiền phạt" }
    ];

    // Loại bỏ một số cột không cần thiết khỏi attendanceColumns
    const keysToRemove = ["description"];
    const defaultColumns = attendanceColumns.filter(
        (column) => !keysToRemove.includes(column.key)
    );

    // Gọi API để lấy dữ liệu từ server
    const fetchAttendanceData = async () => {
        setLoadingPage(true);
        try {
            const data = await AttendanceService.getAttendances();
            setAttendanceData(data); // Lưu dữ liệu vào state
        } catch (err) {
            setErrorServer(err.message); // Lưu lỗi vào state nếu có
        } finally {
            setLoadingPage(false);
        }
        try {
            let students = await studentService.getStudents();
            // Chuyển đổi danh sách học viên đã lọc thành định dạng phù hợp cho Select
            const studentOptions = students.map((student) => ({
                value: student.id,
                label: `#${student.id} - ${student.fullName}`,
            }));
            // Cập nhật trạng thái danh sách tùy chọn cho Select
            setListStudentOption(studentOptions);
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách học viên");
            console.log(error)
        }

        try {
            let tickets = await ticketService.getTickets();
            // Chuyển đổi danh sách vé đã lọc thành định dạng phù hợp cho Select
            const studentOptions = tickets.map((ticket) => ({
                value: ticket.id,
                label: `#${ticket.id} - ${ticket.ticketCode}`,
            }));
            // Cập nhật trạng thái danh sách tùy chọn cho Select
            setListStudentOption(studentOptions);
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách học viên");
            console.log(error)
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchAttendanceData();
    }, []);

    // Hàm validate cho từng trường input
    const validateField = (key, value) => {
        let error = "";

        switch (key) {
            case "checkInTime":
                if (!value) {
                    error = "Thời bắt đầu điểm danh không được để trống.";
                }
                break;

            case "checkOutTime":
                if (!value) {
                    error = "Thời gian kết thúc điểm danh không được để trống.";
                } else if (new Date(value) < new Date(formData.checkInTime)) {
                    error = "Thời gian kết thúc điểm danh phải sau thời gian bắt đầu điểm danh.";
                }
                break;
            case "studentId":
                if (!value) {
                    error = "Mã học viên không được để trống.";
                }
                break;
            case "ticketId":
                if (!value) {
                    error = "Mã vé không được để trống.";
                }
                break;
            case "penaltyAmount":
                if (value === "" || value === null) {
                    error = "Tiền phạt không được để trống.";
                } else if (isNaN(value) || value < 0) {
                    error = "Tiền phạt phải là một số không âm.";
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
        if (!formData.checkInTime) {
            newErrors.checkInTime = "Thời gian bắt đầu điểm danh không được để trống.";
        }

        if (!formData.checkOutTime) {
            newErrors.checkOutTime = "Thời gian kết thúc điểm danh không được để trống.";
        } else if (new Date(formData.checkOutTime) < new Date(formData.checkInTime)) {
            newErrors.checkOutTime = "Thời gian kết thúc điểm danh phải sau ngày bắt đầu.";
        }
        if (!formData.studentId) {
            newErrors.studentId = "Mã học viên không được để trống."
        }
        if (!formData.ticketId) {
            newErrors.ticketId = "Mã vé không được để trống."
        }
        if (formData.penaltyAmount === "" || formData.penaltyAmount === null) {
            newErrors.penaltyAmount = "Tiền phạt không được để trống.";
        } else if (
            isNaN(formData.penaltyAmount) ||
            formData.penaltyAmount < 0
        ) {
            newErrors.penaltyAmount =
                "Tiền phạt phải là một số không âm.";
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
            checkInTime: getCurrentTime(), // Ngày hiện tại
            checkOutTime: "",
            penaltyAmount: "0",
        });
        handleResetStatus();
        setErrorFields({});
    };

    // Hàm gọi khi nhấn "Sửa" một hàng
    const handleEdit = (item) => {
        setFormData({
            ...item,
        });
        updateStatus({ isEditing: true });
        setErrorFields({});
    };

    const handleSaveItem = async () => {
        if (!validateForm()) return false;

        setIsLoading(true);

        try {
            if (statusFunction.isEditing) {
                // Gọi API cập nhật sử dụng attendanceService
                const updatedAttendance = await AttendanceService.updateAttendance(
                    formData.id,
                    formData
                );

                // Đổi định dạng ngày giờ trước khi lưu vào mảng
                const formattedAttendance = {
                    ...updatedAttendance,
                };

                // Cập nhật state attendanceData với attendance đã được sửa
                const updatedAttendances = attendanceData.map((attendance) =>
                    attendance.id === formattedAttendance.id ? formattedAttendance : attendance
                );

                setAttendanceData(updatedAttendances);
                toast.success("Cập nhật thành công!");
            } else if (statusFunction.isAdd) {
                // Nếu đang ở trạng thái thêm mới
                const newAttendance = await AttendanceService.createAttendance(formData);

                // Đổi định dạng ngày giờ trước khi lưu vào mảng
                const formattedAttendance = {
                    ...newAttendance,
                };

                // Cập nhật mảng attendanceData với item vừa được thêm
                setAttendanceData([...attendanceData, formattedAttendance]);

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

    const handleDelete = async (deleteId) => {
        if (!deleteId) return; // kiểm tra sớm

        setIsLoading(true);
        try {
            await AttendanceService.deleteAttendance(deleteId); // Thực hiện xóa
            setAttendanceData((prevData) =>
                prevData.filter((attendance) => attendance.id !== deleteId)
            );
            toast.success("Xóa thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa.");
        } finally {
            setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
        }
    };

    const modalContent = (
        <>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formcheckInTime">
                        <Form.Label>
                            Thời gian bắt đầu điểm danh <span className="text-danger">(*)</span>
                        </Form.Label>
                        <Form.Control
                            type="time"
                            name="checkInTime"
                            value={formData.checkInTime}
                            onChange={(e) => handleInputChange("checkInTime", e.target.value)}
                            isInvalid={!!errorFields.checkInTime}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.checkInTime}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formEndDate">
                        <Form.Label>
                            Thời gian kết thúc điểm danh <span className="text-danger">(*)</span>
                        </Form.Label>
                        <Form.Control
                            type="time"
                            name="checkOutTime"
                            value={formData.checkOutTime}
                            onChange={(e) => handleInputChange("checkOutTime", e.target.value)}
                            isInvalid={!!errorFields.checkOutTime}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorFields.checkOutTime}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>

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

                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formTicketId">
                        <Form.Label>
                            Mã vé <span className="text-danger">(*)</span>
                        </Form.Label>
                        <Select
                            options={listTicketOption}
                            value={listTicketOption.find(
                                (option) => option.value === formData.ticketId
                            )}
                            onChange={(selectedOption) =>
                                handleInputChange(
                                    "ticketId",
                                    selectedOption ? selectedOption.value : ""
                                )
                            }
                            placeholder="Chọn vé"
                            isClearable // Cho phép xóa chọn lựa
                            isSearchable // Bật tính năng tìm kiếm

                        />
                        {errorFields.ticketId && (
                            <div className="invalid-feedback d-block">
                                {errorFields.ticketId}
                            </div>
                        )}
                    </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                    <Form.Group controlId="formPenaltyAmount">
                        <Form.Label>Tiền phạt <span className="text-danger">(*)</span></Form.Label>
                        <NumericFormat
                            thousandSeparator={true}
                            suffix=" VNĐ"
                            decimalScale={0} // cho phép số thập phân tối đa 2 chữ số
                            allowNegative={false} // Không cho phép số âm
                            value={formData.penaltyAmount}
                            onValueChange={(values) => {
                                const { floatValue } = values;
                                handleInputChange("penaltyAmount", floatValue); // Lấy giá trị số thực (floatValue là giá trị số thực không có dấu phân cách hay định dạng   )
                            }}
                            className="form-control"
                            placeholder="Nhập tiền phạt (VNĐ)"
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
                <title>Quản lý điểm danh - Hight Star</title>
            </Helmet>
            {/* Hiển thị loader khi đang tải trang */}
            {loadingPage ? (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" className="text-primary" />
                </div>
            ) : errorServer ? (
                <Page500 message={errorServer} />
            ) : (
                <section className="row m-0 p-0 ">
                    <TableManagement
                        columns={attendanceColumns}
                        data={attendanceData}
                        title={"Quản lý điểm danh"}
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
export default AttendanceManagement;
