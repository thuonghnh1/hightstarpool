package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.service.TransactionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionHistoryController {

    @Autowired
    private TransactionHistoryService transactionHistoryService;

    @GetMapping("/api/public/transactions")
    public Object getTransactions() {
        return transactionHistoryService.getTransactionHistory(); // Trả về dữ liệu cho frontend
    }
}
