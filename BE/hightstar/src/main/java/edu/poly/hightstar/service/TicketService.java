package edu.poly.hightstar.service;

import edu.poly.hightstar.model.TicketDTO;
import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.List;

public interface TicketService {
    List<TicketDTO> getAllTickets();

    TicketDTO getTicketById(Long id);

    TicketDTO createTicket(TicketDTO ticketDTO) throws WriterException, IOException;

    TicketDTO updateTicket(Long id, TicketDTO ticketDTO) throws WriterException, IOException;

    void deleteTicket(Long id);

    TicketDTO getTicketByCode(String ticketCode);
}
