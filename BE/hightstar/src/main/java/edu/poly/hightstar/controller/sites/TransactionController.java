package edu.poly.hightstar.controller.sites;

import edu.poly.hightstar.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/api/public/transactions")
    public Object getTransactions() {
        return transactionService.getTransactionHistory(); // Trả về dữ liệu cho frontend
    }
}
