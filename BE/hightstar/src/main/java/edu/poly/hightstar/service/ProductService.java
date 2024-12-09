package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.ProductDTO;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct (Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
}
