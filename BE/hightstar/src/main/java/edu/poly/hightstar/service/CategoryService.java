package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.CategoryDTO;

public interface CategoryService {
List<CategoryDTO> getAllCategorys();
    CategoryDTO getCategoryById(Long id);
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    CategoryDTO updateCategory (Long id, CategoryDTO categoryDTO);

    void deleteCategory(Long id);
}