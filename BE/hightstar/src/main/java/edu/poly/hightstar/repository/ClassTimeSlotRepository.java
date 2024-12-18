package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassTimeSlot;

public interface ClassTimeSlotRepository extends JpaRepository<ClassTimeSlot, Long> {
    void deleteAllByClassEntity(ClassEntity classEntity);
}
