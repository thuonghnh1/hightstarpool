package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.DiscountDTO;

import edu.poly.hightstar.service.DiscountService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

        private final DiscountService discountService;

        public DiscountController(DiscountService discountService) {
                this.discountService = discountService;
        }

        @GetMapping

        public List<DiscountDTO> getAllDiscounts() {

                return discountService.getAllDiscounts();
        }

        @GetMapping("/{id}")

        public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable Long id) {
                DiscountDTO discountDTO = discountService.getDiscountById(id);
                if (discountDTO == null) {
                        return ResponseEntity.notFound().build(); // 404 Not Found nếu không tìm thấy
                }
                return ResponseEntity.ok(discountDTO); // 200 OK với discountDto
        }

        @PostMapping
        public ResponseEntity<DiscountDTO> createDiscount(@RequestBody DiscountDTO discountDTO) {
                DiscountDTO createdDiscount = discountService.createDiscount(discountDTO);

                // trả về phản hồi với mã trạng thái(HTTP 201 created), body là phần thân p/hồi
                return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);

        }

        @PutMapping("/{id}")
        public ResponseEntity<DiscountDTO> updateDiscount(@PathVariable Long id, @RequestBody DiscountDTO discountDTO) {
                DiscountDTO updatedDiscount = discountService.updateDiscount(id, discountDTO);

                return ResponseEntity.ok(updatedDiscount);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
                return ResponseEntity.ok("Discount deleted successfully."); // 200 OK với thông điệp
        }
}
