package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.model.DiscountDTO;
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
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream().map(discount -> {
            DiscountDTO dto = new DiscountDTO();
            BeanUtils.copyProperties(discount, dto); // Chuyển từ entity sang DTO
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public DiscountDTO getDiscountById(Long id) {
        Optional<Discount> discount = discountRepository.findById(id);
        if (discount.isPresent()) {
            DiscountDTO discountDto = new DiscountDTO();
            BeanUtils.copyProperties(discount.get(), discountDto);
            return discountDto;
        }
        return null;
    }

    @Override
    public DiscountDTO createDiscount(DiscountDTO discountDto) {
        Discount discount = new Discount();
        BeanUtils.copyProperties(discountDto, discount); // Chuyển từ DTO sang entity
        Discount createdDiscount = discountRepository.save(discount);

        DiscountDTO createdDiscountDto = new DiscountDTO();
        BeanUtils.copyProperties(createdDiscount, createdDiscountDto); // Trả về DTO sau khi tạo
        return createdDiscountDto;
    }

    @Override
    public DiscountDTO updateDiscount(Long id, DiscountDTO discountDto) {
        Optional<Discount> discountOptional = discountRepository.findById(id);
        if (discountOptional.isPresent()) {
            Discount discountDetails = discountOptional.get();
            BeanUtils.copyProperties(discountDto, discountDetails);
            Discount updatedDiscount = discountRepository.save(discountDetails);

            DiscountDTO updatedDiscountDto = new DiscountDTO();
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
