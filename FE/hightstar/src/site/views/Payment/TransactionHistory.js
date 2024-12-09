import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Form,
  Pagination,
  Button,
} from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaSun, FaMoon } from "react-icons/fa";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [darkMode, setDarkMode] = useState(false);

  // Hàm lấy dữ liệu giao dịch
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/public/transactions"
      );
      if (!response.data.error) {
        setTransactions(response.data.transactionHistoryList);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Không thể tải lịch sử giao dịch.");
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component load và mỗi 10 giây sau đó
  useEffect(() => {
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 10000); // 10 giây
    return () => clearInterval(intervalId);
  }, []);

  // Hàm để xác định trạng thái giao dịch
  const getTransactionStatus = (transactionType) => {
    switch (transactionType) {
      case "ACSM":
        return (
          <span className="text-success d-flex align-items-center justify-content-center">
            <FaCheckCircle className="me-1" /> Chuyển tiền thành công
          </span>
        );
      case "PENDING":
        return (
          <span className="text-warning d-flex align-items-center justify-content-center">
            <FaSpinner className="me-1" /> Đang xử lý
          </span>
        );
      case "FAILED":
        return (
          <span className="text-danger d-flex align-items-center justify-content-center">
            <FaExclamationCircle className="me-1" /> Thất bại
          </span>
        );
      default:
        return "Chưa xác định";
    }
  };

  // Tìm kiếm giao dịch
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Phân trang
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const pageNumbers = [];
  for (let number = 1; number <= totalPages; number++) {
    pageNumbers.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Chuyển đổi chế độ sáng/tối
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container className={`mt-5 p-5 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`} fluid>
      {/* Điều chỉnh hàng tiêu đề và tìm kiếm */}
      <Row className="mb-4 align-items-center">
        <Col md={6} className="d-flex justify-content-start">
          <h2>Lịch sử giao dịch</h2>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo số tài khoản hoặc miêu tả"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Đặt về trang đầu khi tìm kiếm
            }}
            style={{ maxWidth: '300px' }}
          />
          <Button variant={darkMode ? "light" : "dark"} onClick={toggleDarkMode} className="ms-3">
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Sáng" : "Tối"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className={darkMode ? "bg-secondary text-light" : ""}>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    variant={darkMode ? "dark" : "light"}
                  >
                    <thead className="table-dark">
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
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {new Date(transaction.transactionDate).toLocaleDateString()}
                            </td>
                            <td className="text-center">{transaction.accountNo}</td>
                            <td className="text-center">{transaction.description}</td>
                            <td className="text-end">
                              {Number(transaction.debitAmount).toLocaleString()} VND
                            </td>
                            <td className="text-end">
                              {Number(transaction.creditAmount).toLocaleString()} VND
                            </td>
                            <td className="text-center">
                              {getTransactionStatus(transaction.transactionType)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Không có giao dịch nào để hiển thị.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {/* Phân trang */}
                  {totalPages > 1 && (
                    <Pagination className="justify-content-center">
                      {pageNumbers}
                    </Pagination>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionHistory;
