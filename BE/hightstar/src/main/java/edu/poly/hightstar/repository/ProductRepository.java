package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}