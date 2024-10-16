package edu.poly.hightstar.controller;

import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.service.DiscountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

        private final DiscountService discountService;

        public DiscountController(DiscountService discountService) {
                this.discountService = discountService;
        }

        @GetMapping
        public List<Discount> getAllDiscounts() {
                return discountService.getAllDiscounts();
        }

        @GetMapping("/{id}")
        public Optional<Discount> getDiscountById(@PathVariable Long id) {
                return discountService.getDiscountById(id);
        }

        @PostMapping
        public Discount createDiscount(@RequestBody Discount discount) {
                return discountService.createDiscount(discount);
        }

        @PutMapping("/{id}")
        public Discount updateDiscount(@PathVariable Long id, @RequestBody Discount discountDetails) {
                return discountService.updateDiscount(id, discountDetails);
        }

        @DeleteMapping("/{id}")
        public void deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
        }
}
