package edu.poly.hightstar.controller;

import edu.poly.hightstar.model.DiscountDto;
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
        public List<DiscountDto> getAllDiscounts() {
                return discountService.getAllDiscounts();
        }

        @GetMapping("/{id}")
        public Optional<DiscountDto> getDiscountById(@PathVariable Long id) {
                return discountService.getDiscountById(id);
        }

        @PostMapping
        public DiscountDto createDiscount(@RequestBody DiscountDto discountDto) {
                System.out.println("Received discount data: " + discountDto);
                return discountService.createDiscount(discountDto);
        }

        @PutMapping("/{id}")
        public DiscountDto updateDiscount(@PathVariable Long id, @RequestBody DiscountDto discountDto) {
                return discountService.updateDiscount(id, discountDto);
        }

        @DeleteMapping("/{id}")
        public void deleteDiscount(@PathVariable Long id) {
                discountService.deleteDiscount(id);
        }
}
