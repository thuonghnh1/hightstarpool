import { useEffect, useState } from "react";
import TableManagement from "../../components/common/TableManagement";
import orderService from "../../services/OrderService.js";
import Page500 from "../pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import OrderDetailManagement from "../orderDetail/OrderdetailManagement.js"

const OrderManagement = () => {
    // State để lưu trữ dữ liệu giảm giá từ API
    const [orderData, setOrderData] = useState([]); // đổi tên biến
    const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
    // State để xử lý trạng thái tải dữ liệu và lỗi
    const [statusFunction, setStatusFunction] = useState({ isAdd: false, isEditing: false, isViewDetail: false }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

    const [isLoading, setIsLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
    const [errorServer, setErrorServer] = useState(null); //lỗi từ server
    // Danh sách button
    const button = { btnAdd: false, btnEdit: true, btnDelete: false, btnDetail: true, btnFilter: true }
    // Mảng cột của bảng 
    const orderColumns = [
        { key: "id", label: "ID" },
        { key: "orderDate", label: "Ngày đặt hàng" },
        { key: "total", label: "Tổng tiền" },
        { key: "paymentMethod", label: "Phương thức thanh toán" },
        { key: "notes", label: "Ghi chú" },
        { key: "status", label: "Trạng thái" },
        { key: "shippingAddress", label: "Địa chỉ giao hàng" },
        { key: "discountId", label: "Mã giảm giá" },
        { key: "userId", label: "Mã Người Dùng" },
    ];

    // Loại bỏ cột 'description' khỏi orderColumns
    const defaultColumns = orderColumns.filter(
        (column) =>
            column.key !== "notes" &&
            column.key !== "paymentMethod" &&
            column.key !== "shippingAddress" &&
            column.key !== "discountId"

    );

    // Gọi API để lấy dữ liệu từ server
    const fetchOrderData = async () => {
        setLoadingPage(true);
        try {
            //lấy giữ liệu orders từ API
            const data = await orderService.getOrders();
            setOrderData(data); // Lưu dữ liệu vào state
        } catch (err) {
            setErrorServer(err.message); // Lưu lỗi vào state nếu có
        } finally {
            setLoadingPage(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchOrderData();
    }, []);

    // Hàm xử lý khi thay đổi giá trị input
    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const updateStatus = (newStatus) => {
        setStatusFunction(prevStatus => ({
            ...prevStatus,    // Giữ lại các thuộc tính trước đó
            ...newStatus      // Cập nhật các thuộc tính mới (ví dụ: isEditing: true)
        }));
    };

    // Hàm gọi khi nhấn "Sửa" một hàng
    const handleEdit = async (item) => {
        setFormData({
            ...item,
        });
        updateStatus({ isEditing: true })
    };

    // Hàm gọi khi nhấn "Xem" một hàng
    const handleViewDetail = async (item) => {
        console.log(`Id order là: ${item.id}`)
        updateStatus({ isViewDetail: true })
    };
    const handleResetStatus = () => {
        updateStatus({ isAdd: false, isEditing: false, isViewDetail: false })
    };
    // Xử lý cập nhật trạng thái của đơn hàng
    const handleSaveItem = async () => {
        console.log(formData.id)
        setIsLoading(true);
        try {
            const updatedOrder = await orderService.updateOrder(formData.id, formData);
            // cập nhật lại danh sách order
            const updatedOrders = orderData.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
            );
            setOrderData(updatedOrders);
            toast.success("Cập nhật trạng thái thành công!");
            handleResetStatus();
            return true;
        } catch (err) {
            toast.error("Lỗi khi cập nhật trạng thái");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = statusFunction.isViewDetail ? (
        <OrderDetailManagement orderId={formData.id} />
    ) : statusFunction.isEditing && (
        <Form.Group controlId="statusSelect">
            <Form.Label>Chọn trạng thái</Form.Label>
            <Form.Select
                aria-label="Default select example"
                value={formData.status || 'PENDING'}  // Gán giá trị mặc định 'PENDING' nếu formData.status chưa có giá trị
                onChange={(e) => handleInputChange("status", e.target.value)}
            >
                <option value="PENDING">Đang chờ xử lý</option>
                <option value="ON_DELIVERY">Đang giao hàng</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
            </Form.Select>
        </Form.Group>
    );


    return (
        <>
            <Helmet>
                <title>Quản lý Huấn luyện viên - Hight Star</title>
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
                        data={orderData}
                        columns={orderColumns}
                        title={"Quản lý đặt hàng"}
                        defaultColumns={defaultColumns}
                        isLoading={isLoading}
                        modalContent={modalContent}
                        handleSaveItem={handleSaveItem}
                        onEdit={handleEdit}
                        onViewDetail={handleViewDetail}
                        buttonCustom={button}
                        statusFunction={statusFunction}
                        onResetStatus={handleResetStatus}
                    />
                </section>
            )}
        </>
    );
};
export default OrderManagement;
