package edu.poly.hightstar.repository;

import edu.poly.hightstar.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
