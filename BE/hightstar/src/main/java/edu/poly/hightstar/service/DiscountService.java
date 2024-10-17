package edu.poly.hightstar.service;

import edu.poly.hightstar.model.DiscountDto;

import java.util.List;

public interface DiscountService {

    List<DiscountDto> getAllDiscounts();

    DiscountDto getDiscountById(Long id);

    DiscountDto createDiscount(DiscountDto discountDto);

    DiscountDto updateDiscount(Long id, DiscountDto discountDto);

    void deleteDiscount(Long id);
}
