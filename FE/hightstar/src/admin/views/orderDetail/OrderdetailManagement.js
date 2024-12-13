import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import orderService from "../../services/OrderService";
import { Helmet } from "react-helmet-async";

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
    }
  };

  const nameTicketType = {
    ONETIME_TICKET: "Vé dùng 1 lần",
    WEEKLY_TICKET: "Vé tuần",
    MONTHLY_TICKET: "Vé tháng",
    STUDENT_TICKET: "Vé học viên",
  };

  return (
    <>
      <Helmet>
        <title>Quản lý đơn hàng - Hight Star</title>
      </Helmet>
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.id}>
              <td className="align-middle">{detail.id}</td>
              <td className="align-middle">
                <img
                  src={detail.image || "/assets/img/defaultOrderDetail.png"} // Kiểm tra nếu không có image thì sử dụng mặc định
                  alt={nameTicketType[detail.name] || detail.name}
                  className="object-fit-cover rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                />
              </td>
              <td className="align-middle">
                {nameTicketType[detail.name] || detail.name}
              </td>
              <td className="align-middle">{detail.quantity}</td>
              <td className="align-middle">
                {detail.unitPrice
                  ? new Intl.NumberFormat("vi-VN").format(detail.unitPrice) +
                    "đ"
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderDetailManagement;
