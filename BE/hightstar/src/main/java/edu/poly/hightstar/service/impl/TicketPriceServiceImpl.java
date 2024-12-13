package edu.poly.hightstar.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.poly.hightstar.domain.TicketPrice;
import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.repository.TicketPriceRepository;
import edu.poly.hightstar.service.TicketPriceService;

import java.util.List;

@Service
public class TicketPriceServiceImpl implements TicketPriceService {

    @Autowired
    private TicketPriceRepository ticketPriceRepository;

    @Override
    @Transactional
    public TicketPrice saveOrUpdateTicketPrice(TicketPrice ticketPrice) {
        return ticketPriceRepository.save(ticketPrice);
    }

    @Override
    @Transactional
    public void deleteTicketPriceByTicketType(TicketType ticketType) {
        TicketPrice ticketPrice = ticketPriceRepository.findByTicketType(ticketType);
        if (ticketPrice != null) {
            ticketPriceRepository.delete(ticketPrice);
        }
    }

    @Override
    public TicketPrice getTicketPriceByTicketType(TicketType ticketType) {
        return ticketPriceRepository.findByTicketType(ticketType);
    }

    @Override
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceRepository.findAll();
    }
}
