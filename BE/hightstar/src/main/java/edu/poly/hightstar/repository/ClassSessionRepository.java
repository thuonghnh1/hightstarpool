package edu.poly.hightstar.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.ClassEntity;
import edu.poly.hightstar.domain.ClassSession;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findByClassEntityClassId(Long classId);

    Optional<ClassSession> findByClassEntityClassIdAndSessionDate(Long classId, LocalDate date);

    void deleteAllByClassEntity(ClassEntity classEntity);
}
