package edu.poly.hightstar.controller.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import edu.poly.hightstar.model.ProductDTO;
import edu.poly.hightstar.service.CloudinaryService;
import edu.poly.hightstar.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'TRAINER', 'USER')")
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") String productData,
            @RequestPart("file") MultipartFile file) {
        String publicId = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            ProductDTO productDTO = mapper.readValue(productData, ProductDTO.class);

            String imageUrl = cloudinaryService.uploadImage(file, "product");
            if (imageUrl != null) {
                publicId = extractPublicId(imageUrl);
                productDTO.setProductImage(imageUrl);
            }

            ProductDTO createdProduct = productService.createProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);

        } catch (Exception e) {
            handleImageDeletion(publicId);
            throw new RuntimeException("Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{id}")
    public ProductDTO updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            ProductDTO productDTO = mapper.readValue(productData, ProductDTO.class);
            ProductDTO existingProduct = productService.getProductById(id);

            if (file != null && !file.isEmpty()) {
                handleImageDeletion(extractPublicId(existingProduct.getProductImage()));
                productDTO.setProductImage(cloudinaryService.uploadImage(file, "product"));
            } else {
                productDTO.setProductImage(existingProduct.getProductImage());
            }

            return productService.updateProduct(id, productDTO);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        ProductDTO productDTO = productService.getProductById(id);
        handleImageDeletion(extractPublicId(productDTO.getProductImage()));
        productService.deleteProduct(id);
        return ResponseEntity.ok("Sản phẩm đã được xóa thành công!");
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/") && imageUrl.contains(".")) {
            int start = imageUrl.lastIndexOf("/") + 1;
            int end = imageUrl.lastIndexOf(".");
            return imageUrl.substring(start, end);
        }
        return null;
    }

    private void handleImageDeletion(String publicId) {
        if (publicId != null) {
            try {
                cloudinaryService.deleteImage(publicId);
            } catch (IOException e) {
                System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
            }
        }
    }
}
