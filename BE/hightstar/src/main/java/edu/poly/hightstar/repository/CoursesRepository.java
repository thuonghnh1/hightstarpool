package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Course;

@Repository
public interface CoursesRepository extends JpaRepository <Course, Long> {
    
    
}
