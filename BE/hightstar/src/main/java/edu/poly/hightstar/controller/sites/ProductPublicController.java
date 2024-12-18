package edu.poly.hightstar.controller.sites;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.model.ProductDTO;
import edu.poly.hightstar.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/products")
@RequiredArgsConstructor
public class ProductPublicController {
    private final ProductService productService;
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}
