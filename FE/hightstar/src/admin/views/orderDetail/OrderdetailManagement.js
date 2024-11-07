import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import orderService from "../../services/OrderService";
import { toast } from "react-toastify";

const OrderDetailManagement = ({ orderId }) => {
    const [details, setDetails] = useState([]);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const data = await orderService.getOrderDetails(orderId);
            setDetails(data);
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy details", error);
            toast.error("Đã xảy ra lỗi khi lấy đơn hàng chi tiết. Vui lòng thử lại sau!");
        }
    };

    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng tiền</th>
                </tr>
            </thead>
            <tbody>
                {details.map((detail) => (
                    <tr key={detail.id}>
                        <td>{detail.id}</td>
                        <td>
                            <img
                                src={detail.image || "default-image-path.jpg"} // Kiểm tra nếu không có image thì sử dụng mặc định
                                alt={detail.name}
                                className="object-fit-cover rounded-circle"
                                style={{ width: "45px", height: "45px" }}
                            />
                        </td>
                        <td>
                            {detail.name}
                        </td>
                        <td>{detail.quantity}</td>
                        <td>
                            {detail.unitPrice ? new Intl.NumberFormat('vi-VN').format(detail.unitPrice) + "đ" : "N/A"}
                        </td>
                        <td>
                            {(detail.quantity * (detail.unitPrice || 0)) ? new Intl.NumberFormat('vi-VN').format((detail.quantity * (detail.unitPrice || 0))) + "đ" : "N/A"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default OrderDetailManagement;
