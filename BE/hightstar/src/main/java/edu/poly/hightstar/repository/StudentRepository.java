package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
