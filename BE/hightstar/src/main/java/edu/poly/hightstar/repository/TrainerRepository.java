package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}
