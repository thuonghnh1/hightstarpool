package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.TicketDTO;

public interface TicketService {
    List<TicketDTO> getAllTickets();

    TicketDTO getTicketById(Long id);

    TicketDTO createTicket(TicketDTO ticketDTO);

    TicketDTO updateTicket(Long id, TicketDTO ticketDTO);

    void deleteTicket(Long id);
}
