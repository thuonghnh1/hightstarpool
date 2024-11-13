package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}
