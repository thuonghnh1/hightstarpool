package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Category;

@Repository
public interface CategoryRepository extends JpaRepository <Category,Long > {

    
}