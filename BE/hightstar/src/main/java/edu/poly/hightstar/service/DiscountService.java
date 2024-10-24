package edu.poly.hightstar.service;

import edu.poly.hightstar.model.DiscountDTO;

import java.util.List;

public interface DiscountService {

    List<DiscountDTO> getAllDiscounts();

    DiscountDTO getDiscountById(Long id);

    DiscountDTO createDiscount(DiscountDTO discountDTO);

    DiscountDTO updateDiscount(Long id, DiscountDTO discountDTO);

    void deleteDiscount(Long id);
}
