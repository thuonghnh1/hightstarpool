package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

}
