package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.model.DiscountDTO;
import edu.poly.hightstar.repository.DiscountRepository;
import edu.poly.hightstar.service.DiscountService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream().map(discount -> {
            DiscountDTO dto = new DiscountDTO();
            BeanUtils.copyProperties(discount, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<DiscountDTO> getActiveDiscounts() {
        List<DiscountDTO> allDiscounts = getAllDiscounts();
        List<DiscountDTO> activeDiscounts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (DiscountDTO discount : allDiscounts) {
            if (isActive(discount, now)) {
                activeDiscounts.add(discount);
            }
        }
        return activeDiscounts;
    }

    private static boolean isActive(DiscountDTO discount, LocalDateTime now) {
        return now.isAfter(discount.getStartDate()) && now.isBefore(discount.getEndDate());
    }

    @Override
    public DiscountDTO getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException("Giảm giá này không tồn tại!", ErrorCode.DISCOUNT_NOT_FOUND));

        DiscountDTO discountDTO = new DiscountDTO();
        BeanUtils.copyProperties(discount, discountDTO);
        return discountDTO;
    }

    @Override
    public DiscountDTO createDiscount(DiscountDTO discountDTO) {
        Discount discount = new Discount();
        BeanUtils.copyProperties(discountDTO, discount);
        Discount createdDiscount = discountRepository.save(discount);

        DiscountDTO createdDiscountDTO = new DiscountDTO();
        BeanUtils.copyProperties(createdDiscount, createdDiscountDTO);
        return createdDiscountDTO;
    }

    @Override
    public DiscountDTO updateDiscount(Long id, DiscountDTO discountDTO) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException("Giảm giá này không tồn tại!", ErrorCode.DISCOUNT_NOT_FOUND));
        BeanUtils.copyProperties(discountDTO, discount);
        Discount updatedDiscount = discountRepository.save(discount);

        DiscountDTO updatedDiscountDto = new DiscountDTO();
        BeanUtils.copyProperties(updatedDiscount, updatedDiscountDto);
        return updatedDiscountDto;
    }

    @Override
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new AppException("Giảm giá này không tồn tại!", ErrorCode.DISCOUNT_NOT_FOUND);
        }
        discountRepository.deleteById(id);
    }
}
