import React, { useState } from "react";

const VietQRGenerator = () => {
  const [formData, setFormData] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "",
    amount: 0,
    description: "",
  });

  const [qrData, setQrData] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateVietQR = () => {
    const { bankCode, accountNumber, amount, description, accountName } =
      formData;
    if (!bankCode || !accountNumber || amount <= 0 || !accountName) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const encodedDescription = encodeURIComponent(description);
    const qrString = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(
      accountName
    )}`;
    setQrData(qrString);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Thanh toán qua VietQR</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3>Thông tin đơn hàng</h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Mã ngân hàng:</label>
              <input
                type="text"
                className="form-control"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleInputChange}
                placeholder="Ví dụ: ACB"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số tài khoản:</label>
              <input
                type="text"
                className="form-control"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Số tài khoản nhận tiền"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tên tài khoản:</label>
              <input
                type="text"
                className="form-control"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="Tên người nhận"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số tiền (VND):</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Số tiền cần chuyển"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung chuyển khoản:</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nội dung giao dịch"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={generateVietQR}
            >
              Tạo QR Code
            </button>
          </form>
        </div>

        {qrData && (
          <div className="col-md-6 text-center">
            <h3>Quét mã qua Internet Banking</h3>
            <img
              src={qrData}
              alt="Mã QR VietQR"
              className="img-fluid border p-2 object-fit-cover"
              style={{height:"450px"}}
            />
            <p className="mt-3">Sử dụng ứng dụng ngân hàng để quét mã.</p>
          </div>
        )}
      </div>
      <div className="text-center mt-4">
        <p>
          Hotline hỗ trợ: <a href="tel:0366675206">0366675206</a>
        </p>
        <p>
          Email hỗ trợ:{" "}
          <a href="mailto:nguyendinhnghi211@gmail.com">nguyendinhnghi211@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default VietQRGenerator;
