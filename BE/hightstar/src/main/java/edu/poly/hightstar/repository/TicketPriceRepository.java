package edu.poly.hightstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.poly.hightstar.domain.TicketPrice;
import edu.poly.hightstar.enums.TicketType;

@Repository
public interface TicketPriceRepository extends JpaRepository<TicketPrice, Long> {
    TicketPrice findByTicketType(TicketType ticketType);
}
