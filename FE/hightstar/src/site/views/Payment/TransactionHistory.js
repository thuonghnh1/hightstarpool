import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Hàm lấy dữ liệu giao dịch
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/public/transactions"
      );
      if (!response.data.error) {
        setTransactions(response.data.transactionHistoryList);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Không thể tải lịch sử giao dịch.");
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  // Gọi API khi component load và mỗi 10 giây sau đó
  useEffect(() => {
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 3000); // 10 giây
    return () => clearInterval(intervalId);
  }, []);

  // Hàm để xác định trạng thái giao dịch
  const getTransactionStatus = (transactionType) => {
    // Ví dụ trạng thái có thể là 'ACSM' hoặc loại khác, tùy vào cách API trả về
    switch (transactionType) {
      case "ACSM":
        return "Chuyển tiền thành công";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <Container className="mt-5 p-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Lịch sử giao dịch</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-center">Ngày Giao Dịch</th>
                    <th className="text-center">Số Tài Khoản</th>
                    <th className="text-center">Miêu Tả</th>
                    <th className="text-center">Số Tiền Chuyển Đi (VND)</th>
                    <th className="text-center">Số Tiền Chuyển Đến (VND)</th>
                    <th className="text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {transaction.transactionDate}
                      </td>
                      <td className="text-center">{transaction.accountNo}</td>
                      <td className="text-center">{transaction.description}</td>
                      <td className="text-center">
                        {transaction.debitAmount} VND
                      </td>
                      <td className="text-center">
                        {transaction.creditAmount} VND
                      </td>
                      <td className="text-center">
                        {getTransactionStatus(transaction.transactionType)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionHistory;
