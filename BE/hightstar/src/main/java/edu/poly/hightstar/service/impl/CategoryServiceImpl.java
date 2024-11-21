package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Category;
import edu.poly.hightstar.model.CategoryDTO;
import edu.poly.hightstar.repository.CategoryRepository;
import edu.poly.hightstar.service.CategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOs = new ArrayList<>();

        for (Category category : categories) {
            CategoryDTO dto = convertToDTO(category);
            categoryDTOs.add(dto);
        }

        return categoryDTOs;
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(this::convertToDTO).orElse(null);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        BeanUtils.copyProperties(category, dto);
        return dto;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        Category createdCategory = categoryRepository.save(category);

        CategoryDTO createdCategoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(createdCategory, createdCategoryDTO);
        return createdCategoryDTO;
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isPresent()) {
            Category categoryDetails = categoryOptional.get();
            BeanUtils.copyProperties(categoryDTO, categoryDetails);
            Category updatedCategory = categoryRepository.save(categoryDetails);

            CategoryDTO updatedCategoryDTO = new CategoryDTO();
            BeanUtils.copyProperties(updatedCategory, updatedCategoryDTO);
            return updatedCategoryDTO;
        }
        return null;
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
