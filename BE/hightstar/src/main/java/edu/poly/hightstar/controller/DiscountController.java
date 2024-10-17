package edu.poly.hightstar.controller;

import edu.poly.hightstar.model.DiscountDto;
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
        public List<DiscountDto> getAllDiscounts() {
                return discountService.getAllDiscounts();
        }

        @GetMapping("/{id}")
        public ResponseEntity<DiscountDto> getDiscountById(@PathVariable Long id) {
                DiscountDto discountDto = discountService.getDiscountById(id);
                if (discountDto == null) {
                        return ResponseEntity.notFound().build(); // 404 Not Found nếu không tìm thấy
                }
                return ResponseEntity.ok(discountDto); // 200 OK với discountDto
        }

        @PostMapping
        public ResponseEntity<DiscountDto> createDiscount(@RequestBody DiscountDto discountDto) {
                DiscountDto createdDiscount = discountService.createDiscount(discountDto);
                // trả về phản hồi với mã trạng thái(HTTP 201 created), body là phần thân p/hồi
                return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);

        }

        @PutMapping("/{id}")
        public ResponseEntity<DiscountDto> updateDiscount(@PathVariable Long id, @RequestBody DiscountDto discountDto) {
                DiscountDto updatedDiscount = discountService.updateDiscount(id, discountDto);
                return ResponseEntity.ok(updatedDiscount);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
                return ResponseEntity.ok("Discount deleted successfully."); // 200 OK với thông điệp
        }
}
