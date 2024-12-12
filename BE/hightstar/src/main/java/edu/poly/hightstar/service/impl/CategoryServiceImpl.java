package edu.poly.hightstar.service.impl;

import edu.poly.hightstar.domain.Category;
import edu.poly.hightstar.model.CategoryDTO;
import edu.poly.hightstar.repository.CategoryRepository;
import edu.poly.hightstar.service.CategoryService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

   
    
    @Override
    public List <CategoryDTO> getAllCategorys() {
        return categoryRepository.findAll().stream().map(category -> {
            CategoryDTO dto = new CategoryDTO();
            BeanUtils.copyProperties(category, dto);
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public CategoryDTO getCategoryById(Long id){
        Category category = categoryRepository.findById(id).orElseThrow(()-> new AppException("Không tìm thấy loại hàng này", ErrorCode.CATEGORY_NOT_FOUND));
        CategoryDTO categoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(category, categoryDTO);
        return categoryDTO;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO){
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        Category createdCategory = categoryRepository.save(category);

        CategoryDTO createdCategoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(createdCategory, createdCategoryDTO);
        return createdCategoryDTO;
    }

    @Override 
    public CategoryDTO updateCategory (Long id, CategoryDTO categoryDTO){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy loại hàng này với ID " + id, ErrorCode.CATEGORY_NOT_FOUND));
        BeanUtils.copyProperties(categoryDTO, category);
        Category updatedCategory = categoryRepository.save(category);

        CategoryDTO updatedCategoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(updatedCategory, updatedCategoryDTO);
        return updatedCategoryDTO;
    }

    @Override
    public void deleteCategory (Long id) {
        if (!categoryRepository.existsById(id)){
            throw new AppException("Không tìm thấy loại hàng này! ", ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }


}