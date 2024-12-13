package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Category;
import edu.poly.hightstar.domain.Product;
import edu.poly.hightstar.model.ProductDTO;
import edu.poly.hightstar.repository.CategoryRepository;
import edu.poly.hightstar.repository.ProductRepository;
import edu.poly.hightstar.service.ProductService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            BeanUtils.copyProperties(product, dto);
            dto.setCategoryId(product.getCategory().getCategoryId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy sản phẩm này", ErrorCode.PRODUCT_NOT_FOUND));
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        return productDTO;
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new AppException("Không tìm thấy loại sản phẩm này", ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);
        Product createdProduct = productRepository.save(product);

        ProductDTO createdProductDTO = new ProductDTO();
        BeanUtils.copyProperties(createdProduct, createdProductDTO);
        createdProductDTO.setCategoryId(productDTO.getCategoryId());
        return createdProductDTO;
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new AppException("Không tìm thấy sản phẩm với ID " + id, ErrorCode.PRODUCT_NOT_FOUND));
        BeanUtils.copyProperties(productDTO, product);
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new AppException("Không tìm thấy loại sản phẩm này", ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);
        Product updatedProduct = productRepository.save(product);

        ProductDTO updatedProductDTO = new ProductDTO();
        BeanUtils.copyProperties(updatedProduct, updatedProductDTO);
        updatedProductDTO.setCategoryId(productDTO.getCategoryId());
        return updatedProductDTO;
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new AppException("Không tìm thấy sản phẩm này! ", ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

}