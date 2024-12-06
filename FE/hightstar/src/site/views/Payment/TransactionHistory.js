import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/public/transactions");
        if (!response.data.error) {
          setTransactions(response.data);
        } else {
          console.error("Lỗi khi lấy dữ liệu:", response.data.message);
        }
      } catch (error) {
        console.error("Không thể tải lịch sử giao dịch:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Lịch sử giao dịch</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description} - {transaction.creditAmount} {transaction.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
