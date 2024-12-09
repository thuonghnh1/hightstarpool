package edu.poly.hightstar.controller.admin;

import edu.poly.hightstar.model.DiscountDTO;
import edu.poly.hightstar.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/discounts")
@RequiredArgsConstructor
public class DiscountController {

        private final DiscountService discountService;

        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
        @GetMapping
        public List<DiscountDTO> getAllDiscounts() {
                return discountService.getAllDiscounts();
        }

        @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
        @GetMapping("/{id}")
        public DiscountDTO getDiscountById(@PathVariable Long id) {
                return discountService.getDiscountById(id);
        }

        @PreAuthorize("hasAnyRole('ADMIN')")
        @PostMapping
        public ResponseEntity<DiscountDTO> createDiscount(@RequestBody DiscountDTO discountDTO) {
                DiscountDTO createdDiscount = discountService.createDiscount(discountDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);
        }

        @PreAuthorize("hasAnyRole('ADMIN')")
        @PutMapping("/{id}")
        public DiscountDTO updateDiscount(@PathVariable Long id, @RequestBody DiscountDTO discountDTO) {
                return discountService.updateDiscount(id, discountDTO);
        }

        @PreAuthorize("hasAnyRole('ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
                return ResponseEntity.ok("Xóa giảm giá thành công!");
        }
}
