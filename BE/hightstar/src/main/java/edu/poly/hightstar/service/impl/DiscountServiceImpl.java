package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Discount;
import edu.poly.hightstar.repository.DiscountRepository;
import edu.poly.hightstar.service.DiscountService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    public Optional<Discount> getDiscountById(Long discountId) {
        return discountRepository.findById(discountId);
    }

    @Override
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    @Override
    public Discount updateDiscount(Long discountId, Discount discountDetails) {
        Optional<Discount> optionalDiscount = discountRepository.findById(discountId);

        if (optionalDiscount.isPresent()) {
            Discount discount = optionalDiscount.get();
            discount.setDiscountName(discountDetails.getDiscountName());
            discount.setPercentage(discountDetails.getPercentage());
            discount.setValidFrom(discountDetails.getValidFrom());
            discount.setValidTo(discountDetails.getValidTo());
            discount.setDescription(discountDetails.getDescription());
            return discountRepository.save(discount);
        } else {
            throw new RuntimeException("Discount not found with id " + discountId);
        }
    }

    @Override
    public void deleteDiscount(Long discountId) {
        discountRepository.deleteById(discountId);
    }
}
