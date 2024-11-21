const Invoice = ({ buyer, cartItems = [], totalPrice, discount, date, invoiceCode }) => {
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = discount ? subTotal * (discount.percentage / 100) : 0;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        width: "58mm",
        padding: "5px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <p style={{ margin: "10px 0", fontWeight: "bold", fontSize: "12px" }}>
          HÓA ĐƠN BÁN HÀNG
        </p>
        <p style={{ margin: "2px 0" }}>15 Mộc Bài 7, Hòa Minh, Liên Chiểu</p>
        <p style={{ margin: "2px 0" }}>Hotline: 0888 372 325</p>
      </div>

      {/* Thông tin khách hàng */}
      <div
        style={{
          borderBottom: "1px dashed #000",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
      >
        <p style={{ margin: "5px 0" }}>
          Khách hàng: {buyer.fullName || "Khách lẻ"}
        </p>
        <p style={{ margin: "5px 0" }}>Số ĐT: {buyer.username || "N/A"}</p>
        <p style={{ margin: "5px 0" }}>Ngày: {date}</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div
        style={{
          borderBottom: "1px dashed #000",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
      >
        {cartItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span style={{ flex: 1 }}>
              {index + 1}. {item.name}
            </span>
            <span style={{ flex: 1, textAlign: "right" }}>
              {item.quantity} x {item.price.toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>

      {/* Tổng kết */}
      <div
        style={{
          textAlign: "right",
          marginBottom: "10px",
          borderBottom: "1px dashed #000",
          paddingBottom: "10px",
        }}
      >
        <p style={{ margin: "5px 0" }}>
          Tạm tính: {subTotal.toLocaleString()}đ
        </p>
        {discount && (
          <p style={{ margin: "5px 0" }}>
            Giảm giá: -{discountAmount.toLocaleString()}đ
          </p>
        )}
        <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "12px" }}>
          Thành tiền: {totalPrice.toLocaleString()}đ
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ margin: "5px 0" }}>Cảm ơn quý khách!</p>
        <p style={{ margin: "5px 0" }}>Hẹn gặp lại!</p>
        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
          Mã HĐ: {`HD${invoiceCode}`}
        </p>
        {/* Logo */}
        <img
          src="https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png" // Thay URL logo của bạn vào đây
          alt="Logo"
          style={{ width: "80px", marginTop: "10px" }}
        />{" "}
      </div>
    </div>
  );
};

export default Invoice;
