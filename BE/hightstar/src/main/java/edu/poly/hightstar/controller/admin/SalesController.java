package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.OrderDTO;
import edu.poly.hightstar.model.OrderRequest;
import edu.poly.hightstar.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee/sales")
public class SalesController {

    @Autowired
    private OrderService orderService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'USER')")
    @PostMapping("/createInvoice")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        OrderDTO savedOrder = orderService.createInvoice(request);
        return ResponseEntity.ok(savedOrder);
    }
}
