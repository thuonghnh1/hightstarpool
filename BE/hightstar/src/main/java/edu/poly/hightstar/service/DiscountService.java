package edu.poly.hightstar.service;

import edu.poly.hightstar.domain.Discount;
import java.util.List;
import java.util.Optional;

public interface DiscountService {
    List<Discount> getAllDiscounts();

    Optional<Discount> getDiscountById(Long discountId);

    Discount createDiscount(Discount discount);

    Discount updateDiscount(Long discountId, Discount discountDetails);

    void deleteDiscount(Long discountId);
}
