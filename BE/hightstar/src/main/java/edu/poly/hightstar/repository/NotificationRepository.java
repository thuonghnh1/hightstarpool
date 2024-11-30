package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.poly.hightstar.domain.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
