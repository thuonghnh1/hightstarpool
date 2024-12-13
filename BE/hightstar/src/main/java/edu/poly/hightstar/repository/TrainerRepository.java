package edu.poly.hightstar.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    // Lấy danh sách huấn luyện viên được sắp xếp theo đánh giá giảm dần và giới hạn
    // số lượng
    Page<Trainer> findAllByOrderByRatingDesc(Pageable pageable);
}
