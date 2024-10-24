package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.model.DiscountDto;
import edu.poly.hightstar.repository.DiscountRepository;
import edu.poly.hightstar.service.DiscountService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public List<DiscountDto> getAllDiscounts() {
        return discountRepository.findAll().stream().map(discount -> {
            DiscountDto dto = new DiscountDto();
            BeanUtils.copyProperties(discount, dto); // Chuyển từ entity sang DTO
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public DiscountDto getDiscountById(Long id) {
        Optional<Discount> discount = discountRepository.findById(id);
        if (discount.isPresent()) {
            DiscountDto discountDto = new DiscountDto();
            BeanUtils.copyProperties(discount.get(), discountDto);
            return discountDto;
        }
        return null;
    }

    @Override
    public DiscountDto createDiscount(DiscountDto discountDto) {
        Discount discount = new Discount();
        BeanUtils.copyProperties(discountDto, discount); // Chuyển từ DTO sang entity
        Discount createdDiscount = discountRepository.save(discount);

        DiscountDto createdDiscountDto = new DiscountDto();
        BeanUtils.copyProperties(createdDiscount, createdDiscountDto); // Trả về DTO sau khi tạo
        return createdDiscountDto;
    }

    @Override
    public DiscountDto updateDiscount(Long id, DiscountDto discountDto) {
        Optional<Discount> discountOptional = discountRepository.findById(id);
        if (discountOptional.isPresent()) {
            Discount discountDetails = discountOptional.get();
            BeanUtils.copyProperties(discountDto, discountDetails);
            Discount updatedDiscount = discountRepository.save(discountDetails);

            DiscountDto updatedDiscountDto = new DiscountDto();
            BeanUtils.copyProperties(updatedDiscount, updatedDiscountDto);
            return updatedDiscountDto;
        }
        return null; // Hoặc xử lý lỗi nếu không tìm thấy
    }

    @Override
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }
}
