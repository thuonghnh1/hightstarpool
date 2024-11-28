package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

}
