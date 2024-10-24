package edu.poly.hightstar.service;

import edu.poly.hightstar.model.DiscountDTO;

import java.util.List;

public interface DiscountService {

    List<DiscountDTO> getAllDiscounts();

    DiscountDTO getDiscountById(Long id);

    DiscountDTO createDiscount(DiscountDTO discountDto);

    DiscountDTO updateDiscount(Long id, DiscountDTO discountDto);

    void deleteDiscount(Long id);
}
