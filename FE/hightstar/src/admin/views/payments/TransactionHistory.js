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
} from "react-bootstrap";
import { parse, format, isValid } from "date-fns"; // Import từ date-fns

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

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
            <i className="bi bi-check-circle-fill me-1"></i> Thành
            công
          </span>
        );
      case "PENDING":
        return (
          <span className="text-warning d-flex align-items-center justify-content-center">
            <i className="bi bi-hourglass-split me-1"></i> Đang xử lý
          </span>
        );
      case "FAILED":
        return (
          <span className="text-danger d-flex align-items-center justify-content-center">
            <i className="bi bi-exclamation-circle-fill me-1"></i> Thất bại
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
        transaction.accountNo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

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

  return (
    <Container className="p-4 bg-white h-100 text-dark rounded-2" fluid>
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
            style={{ maxWidth: "300px" }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="border-0">
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <Table hover responsive variant="light">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center text-capitalize">
                          Ngày
                        </th>
                        <th className="text-center text-capitalize">
                          Số Tài Khoản
                        </th>
                        <th className="text-center text-capitalize">
                          Nội dung chuyển tiền
                        </th>
                        <th className="text-center text-capitalize text-nowrap">
                          Số Tiền Chuyển Đi
                        </th>
                        <th className="text-center text-capitalize text-nowrap">
                          Số Tiền Nhận
                        </th>
                        <th className="text-center">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((transaction, index) => {
                          // In ra giá trị của transactionDate để kiểm tra
                          console.log(
                            "Transaction Date:",
                            transaction.transactionDate
                          );

                          // Xử lý ngày giao dịch
                          let formattedDate = "Không xác định";
                          if (transaction.transactionDate) {
                            try {
                              let parsedDate;

                              // Kiểm tra kiểu dữ liệu của transactionDate
                              if (
                                typeof transaction.transactionDate === "string"
                              ) {
                                // Thử parse theo định dạng 'dd/MM/yyyy HH:mm:ss'
                                parsedDate = parse(
                                  transaction.transactionDate,
                                  "dd/MM/yyyy HH:mm:ss",
                                  new Date()
                                );

                                // Kiểm tra xem parse có thành công không
                                if (!isValid(parsedDate)) {
                                  console.error(
                                    "Ngày không hợp lệ sau khi parse:",
                                    transaction.transactionDate
                                  );
                                }
                              } else if (
                                typeof transaction.transactionDate === "number"
                              ) {
                                // Giả sử là timestamp (số mili giây)
                                parsedDate = new Date(
                                  transaction.transactionDate
                                );
                              } else {
                                // Nếu không phải string hoặc number, cố gắng sử dụng Date constructor
                                parsedDate = new Date(
                                  transaction.transactionDate
                                );
                              }

                              // Kiểm tra xem parsedDate có hợp lệ không
                              if (isValid(parsedDate)) {
                                formattedDate = format(
                                  parsedDate,
                                  "dd/MM/yyyy"
                                );
                              } else {
                                console.error(
                                  "Ngày không hợp lệ sau khi parse:",
                                  transaction.transactionDate
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Lỗi khi phân tích ngày:",
                                error,
                                transaction.transactionDate
                              );
                            }
                          }

                          return (
                            <tr key={index}>
                              <td className="text-center">{formattedDate}</td>
                              <td className="text-center">
                                {transaction.accountNo}
                              </td>
                              <td className="text-center">
                                {transaction.description}
                              </td>
                              <td className="text-center">
                                {Number(
                                  transaction.debitAmount
                                ).toLocaleString()}{" "}
                                VND
                              </td>
                              <td className="text-center">
                                {Number(
                                  transaction.creditAmount
                                ).toLocaleString()}{" "}
                                VND
                              </td>
                              <td className="text-center text-nowrap">
                                {getTransactionStatus(
                                  transaction.transactionType
                                )}
                              </td>
                            </tr>
                          );
                        })
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
